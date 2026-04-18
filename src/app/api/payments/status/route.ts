import { NextResponse } from "next/server";
import { supabaseService } from "@/lib/supabase";
import { resolvePawaPayConfig } from "@/lib/pawapay";
import {
  sendCustomerConfirmation,
  sendTeamNotification,
} from "@/lib/africastalking";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

type DbRow = {
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
  payment_deposit_id: string;
};

export async function POST(req: Request) {
  let body: { depositId?: string };
  try {
    body = (await req.json()) as { depositId?: string };
  } catch {
    return NextResponse.json({ error: "Requête invalide" }, { status: 400 });
  }

  const depositId = body.depositId?.trim();
  if (!depositId) {
    return NextResponse.json({ error: "depositId manquant" }, { status: 400 });
  }

  const supabase = supabaseService();

  const { data: row, error: fetchErr } = await supabase
    .from("bookings")
    .select(
      "id, date, slot, name, company, phone, address, with_roogo, status, payment_status, payment_deposit_id"
    )
    .eq("payment_deposit_id", depositId)
    .maybeSingle<DbRow>();

  if (fetchErr) {
    console.error("[payments/status] db fetch", fetchErr);
    return NextResponse.json({ error: "Erreur serveur" }, { status: 500 });
  }
  if (!row) {
    return NextResponse.json(
      { status: "NOT_FOUND", error: "Réservation introuvable" },
      { status: 404 }
    );
  }

  // Terminal DB state — short-circuit.
  if (row.payment_status === "completed") {
    return NextResponse.json({ status: "COMPLETED", bookingId: row.id });
  }
  if (row.payment_status === "failed" || row.payment_status === "cancelled") {
    return NextResponse.json({ status: "FAILED", bookingId: row.id });
  }

  // Still in flight — ask PawaPay.
  let pawa: { url: string; token: string };
  try {
    const cfg = resolvePawaPayConfig();
    pawa = { url: cfg.url, token: cfg.token };
  } catch (err) {
    console.error("[payments/status] config", err);
    return NextResponse.json({ status: "PENDING" });
  }

  let upstream: Response;
  try {
    upstream = await fetch(`${pawa.url}/v2/deposits/${depositId}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${pawa.token}`,
      },
    });
  } catch (err) {
    console.error("[payments/status] upstream fetch", err);
    return NextResponse.json({ status: "PENDING" });
  }

  if (upstream.status === 404) {
    return NextResponse.json({ status: "PENDING" });
  }

  const text = await upstream.text();
  let result: unknown;
  try {
    result = JSON.parse(text);
  } catch {
    return NextResponse.json({ status: "PENDING" });
  }

  const payload = Array.isArray(result) ? result[0] : result;
  const statusRaw =
    (payload as { status?: string; depositStatus?: string })?.status ||
    (payload as { depositStatus?: string })?.depositStatus ||
    "";
  const status = String(statusRaw).toUpperCase();

  if (!status) {
    return NextResponse.json({ status: "PENDING" });
  }

  // Translate & persist if we just learned a new terminal state.
  if (status === "COMPLETED" && row.payment_status !== "completed") {
    const { error: updErr } = await supabase
      .from("bookings")
      .update({ status: "confirmed", payment_status: "completed" })
      .eq("id", row.id);
    if (updErr) {
      console.error("[payments/status] update completed", updErr);
    } else {
      // Fire SMS asynchronously; we don't want SMS latency blocking the poll response.
      void Promise.all([
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
      ]).catch((err) =>
        console.error("[payments/status] sms dispatch", err)
      );
    }
    return NextResponse.json({ status: "COMPLETED", bookingId: row.id });
  }

  if (status === "FAILED" || status === "CANCELLED" || status === "REJECTED") {
    await supabase
      .from("bookings")
      .update({ status: "cancelled", payment_status: "failed" })
      .eq("id", row.id);
    return NextResponse.json({ status: "FAILED", bookingId: row.id });
  }

  if (status === "SUBMITTED" && row.payment_status !== "submitted") {
    await supabase
      .from("bookings")
      .update({ payment_status: "submitted" })
      .eq("id", row.id);
  }

  return NextResponse.json({ status: status || "PENDING" });
}
