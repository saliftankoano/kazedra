import { NextResponse } from "next/server";
import {
  normalizePhone,
  paymentInitiateSchema,
  toPawaPayPhone,
} from "@/lib/booking-schema";
import { supabaseService } from "@/lib/supabase";
import { resolvePawaPayConfig } from "@/lib/pawapay";
import { PRICE_SCAN_ONLY, PRICE_SCAN_WITH_ROOGO } from "@/lib/time-slots";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const HOLD_MINUTES = 8;

interface PawaPayDepositPayload {
  depositId: string;
  payer: {
    type: "MMO";
    accountDetails: { phoneNumber: string; provider: string };
  };
  amount: string;
  currency: string;
  customerMessage: string;
  preAuthorisationCode?: string;
}

export async function POST(req: Request) {
  let raw: unknown;
  try {
    raw = await req.json();
  } catch {
    return NextResponse.json({ error: "Requête invalide" }, { status: 400 });
  }

  const parsed = paymentInitiateSchema.safeParse(raw);
  if (!parsed.success) {
    return NextResponse.json(
      { error: "Validation échouée", issues: parsed.error.flatten().fieldErrors },
      { status: 400 }
    );
  }

  const d = parsed.data;

  if (d.payment_provider === "ORANGE_BFA" && !d.pre_authorisation_code) {
    return NextResponse.json(
      {
        error:
          "Code de pré-autorisation Orange Money requis. Composez *144*4*6# pour l'obtenir.",
      },
      { status: 400 }
    );
  }

  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const picked = new Date(d.date + "T00:00:00");
  if (picked.getTime() < today.getTime()) {
    return NextResponse.json(
      { error: "La date choisie est déjà passée." },
      { status: 400 }
    );
  }

  const contactPhone = normalizePhone(d.phone);
  const payerPhoneFormatted = toPawaPayPhone(d.payment_phone);
  const amount = d.with_roogo ? PRICE_SCAN_WITH_ROOGO : PRICE_SCAN_ONLY;
  const supabase = supabaseService();

  // Self-heal: clear expired pending_payment rows for this slot so the unique
  // index doesn't block a fresh insert.
  await supabase
    .from("bookings")
    .update({ status: "cancelled", payment_status: "cancelled" })
    .eq("date", d.date)
    .eq("slot", d.slot)
    .eq("status", "pending_payment")
    .lt("held_until", new Date().toISOString());

  const depositId = crypto.randomUUID();
  const heldUntil = new Date(Date.now() + HOLD_MINUTES * 60_000).toISOString();

  const { data: inserted, error: insertError } = await supabase
    .from("bookings")
    .insert({
      date: d.date,
      slot: d.slot,
      name: d.name,
      company: d.company || null,
      phone: contactPhone,
      email: d.email || null,
      address: d.address,
      area_band: d.area_band,
      with_roogo: d.with_roogo,
      notes: d.notes || null,
      status: "pending_payment",
      payment_status: "pending",
      payment_provider: d.payment_provider,
      payment_deposit_id: depositId,
      held_until: heldUntil,
    })
    .select("id")
    .single();

  if (insertError) {
    if (insertError.code === "23505") {
      return NextResponse.json(
        {
          error: "Ce créneau vient d'être pris. Choisissez-en un autre.",
          code: "slot_taken",
        },
        { status: 409 }
      );
    }
    console.error("[payments/initiate] insert failed", insertError);
    return NextResponse.json(
      { error: "Erreur serveur. Réessayez dans un instant." },
      { status: 500 }
    );
  }

  let pawa: PawaPayConfigResult;
  try {
    const cfg = resolvePawaPayConfig();
    pawa = { url: cfg.url, token: cfg.token };
  } catch (err) {
    console.error("[payments/initiate] PawaPay config", err);
    await rollback(supabase, inserted.id);
    return NextResponse.json(
      { error: "Service de paiement indisponible." },
      { status: 500 }
    );
  }

  const customerMessage = d.pre_authorisation_code
    ? `${d.pre_authorisation_code} Kazedra 3D`.slice(0, 22)
    : "Kazedra 3D";

  const payload: PawaPayDepositPayload = {
    depositId,
    payer: {
      type: "MMO",
      accountDetails: {
        phoneNumber: payerPhoneFormatted,
        provider: d.payment_provider,
      },
    },
    amount: String(amount),
    currency: "XOF",
    customerMessage,
  };
  if (d.pre_authorisation_code) {
    payload.preAuthorisationCode = d.pre_authorisation_code;
  }

  let upstream: Response;
  try {
    upstream = await fetch(`${pawa.url}/v2/deposits`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${pawa.token}`,
      },
      body: JSON.stringify(payload),
    });
  } catch (err) {
    console.error("[payments/initiate] fetch failed", err);
    await rollback(supabase, inserted.id);
    return NextResponse.json(
      { error: "Impossible de joindre PawaPay. Réessayez." },
      { status: 502 }
    );
  }

  const text = await upstream.text();
  let result: Record<string, unknown>;
  try {
    result = JSON.parse(text) as Record<string, unknown>;
  } catch {
    result = { raw: text };
  }

  if (!upstream.ok) {
    const details = result.details as Record<string, unknown> | undefined;
    const failureReason = details?.failureReason as
      | { failureMessage?: string; failureCode?: string }
      | undefined;
    const message =
      failureReason?.failureMessage ||
      (details?.errorMessage as string | undefined) ||
      (result.message as string | undefined) ||
      "Échec de l'initiation du paiement.";

    await rollback(supabase, inserted.id, String(message));

    return NextResponse.json(
      {
        error: message,
        failureCode: failureReason?.failureCode,
      },
      { status: upstream.status }
    );
  }

  const pawaStatus =
    typeof result.status === "string" ? result.status.toUpperCase() : "PENDING";

  // PawaPay may immediately return COMPLETED (rare but possible). Mirror the DB.
  if (pawaStatus === "COMPLETED") {
    await supabase
      .from("bookings")
      .update({ status: "confirmed", payment_status: "completed" })
      .eq("id", inserted.id);
  } else if (pawaStatus === "SUBMITTED") {
    await supabase
      .from("bookings")
      .update({ payment_status: "submitted" })
      .eq("id", inserted.id);
  }

  return NextResponse.json(
    {
      success: true,
      depositId,
      status: pawaStatus,
      bookingId: inserted.id,
    },
    { status: 201 }
  );
}

type PawaPayConfigResult = { url: string; token: string };

async function rollback(
  supabase: ReturnType<typeof supabaseService>,
  bookingId: string,
  reason?: string
) {
  await supabase
    .from("bookings")
    .update({
      status: "cancelled",
      payment_status: "failed",
      notes: reason ? `[cancelled after initiate] ${reason}` : undefined,
    })
    .eq("id", bookingId);
}
