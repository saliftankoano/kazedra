import { NextResponse } from "next/server";
import { supabaseService } from "@/lib/supabase";
import { PAWAPAY_IPS } from "@/lib/pawapay";
import {
  sendCustomerConfirmation,
  sendTeamNotification,
} from "@/lib/africastalking";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

type BookingRow = {
  id: string;
  date: string;
  slot: string;
  name: string;
  company: string | null;
  phone: string;
  address: string;
  with_roogo: boolean;
  status: string;
  payment_status: string;
};

export async function POST(req: Request) {
  const requestId = crypto.randomUUID().slice(0, 8);
  const log = (step: string, data: Record<string, unknown> = {}) => {
    console.log(
      JSON.stringify({
        route: "POST /api/pawapay/callback",
        requestId,
        step,
        ...data,
        timestamp: new Date().toISOString(),
      })
    );
  };

  // 0. IP whitelist (production only; dev skips so you can curl the endpoint).
  const forwardedFor = req.headers.get("x-forwarded-for");
  const clientIp = forwardedFor ? forwardedFor.split(",")[0].trim() : null;

  if (process.env.NODE_ENV === "production") {
    if (!clientIp || !PAWAPAY_IPS.includes(clientIp as (typeof PAWAPAY_IPS)[number])) {
      log("ip-blocked", { clientIp });
      return NextResponse.json({ error: "Unauthorized IP" }, { status: 403 });
    }
  }

  // 1. Parse body
  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }
  const data = (Array.isArray(body) ? body[0] : body) as Record<string, unknown>;
  const depositId =
    typeof data?.depositId === "string" ? (data.depositId as string) : null;
  const statusRaw = typeof data?.status === "string" ? data.status : "";
  const status = statusRaw.toUpperCase();

  if (!depositId || !status) {
    log("invalid-payload", { depositId, status });
    return NextResponse.json({ error: "Invalid payload" }, { status: 400 });
  }

  // 2. Status mapping
  let payment_status: string = "pending";
  if (status === "COMPLETED") payment_status = "completed";
  else if (status === "SUBMITTED") payment_status = "submitted";
  else if (status === "ACCEPTED") payment_status = "pending";
  else if (status === "FAILED" || status === "CANCELLED" || status === "REJECTED")
    payment_status = "failed";
  else if (status === "REFUNDED") payment_status = "refunded";

  const supabase = supabaseService();

  // 3. Load booking
  const { data: row, error: fetchErr } = await supabase
    .from("bookings")
    .select(
      "id, date, slot, name, company, phone, address, with_roogo, status, payment_status"
    )
    .eq("payment_deposit_id", depositId)
    .maybeSingle<BookingRow>();

  if (fetchErr) {
    log("db-fetch-error", { error: String(fetchErr) });
    return NextResponse.json({ error: "DB error" }, { status: 500 });
  }

  // Always 200 back to PawaPay even if the row is missing — we don't want retries.
  if (!row) {
    log("booking-not-found", { depositId });
    return NextResponse.json({ received: true, warning: "booking not found" });
  }

  // 4. Update booking
  const patch: Record<string, unknown> = { payment_status };
  if (status === "COMPLETED" && row.status !== "confirmed") {
    patch.status = "confirmed";
  } else if (
    payment_status === "failed" &&
    row.status === "pending_payment"
  ) {
    patch.status = "cancelled";
  }

  const { error: updErr } = await supabase
    .from("bookings")
    .update(patch)
    .eq("id", row.id);

  if (updErr) {
    log("db-update-error", { error: String(updErr) });
    return NextResponse.json({ error: "DB update failed" }, { status: 500 });
  }

  log("booking-updated", { depositId, payment_status, bookingId: row.id });

  // 5. Fire SMS on fresh completion (customer + team).
  if (status === "COMPLETED" && row.payment_status !== "completed") {
    try {
      await Promise.all([
        sendCustomerConfirmation(row.phone, row.date, row.slot),
        sendTeamNotification({
          name: row.name,
          company: row.company,
          phone: row.phone,
          date: row.date,
          slot: row.slot,
          address: row.address,
          with_roogo: row.with_roogo,
        }),
      ]);
    } catch (err) {
      log("sms-error", { error: String(err) });
    }
  }

  return NextResponse.json({ received: true });
}
