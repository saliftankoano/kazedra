import { NextResponse } from "next/server";
import { supabaseAnon } from "@/lib/supabase";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const DATE_RE = /^\d{4}-\d{2}-\d{2}$/;

export async function GET(req: Request) {
  const url = new URL(req.url);
  const from = url.searchParams.get("from") ?? "";
  const to = url.searchParams.get("to") ?? "";

  if (!DATE_RE.test(from) || !DATE_RE.test(to)) {
    return NextResponse.json(
      { error: "Paramètres from/to invalides (format YYYY-MM-DD)." },
      { status: 400 }
    );
  }

  const supabase = supabaseAnon();
  const { data, error } = await supabase
    .from("booking_slots_view")
    .select("date, slot")
    .gte("date", from)
    .lte("date", to);

  if (error) {
    console.error("[availability] query failed", error);
    return NextResponse.json(
      { error: "Erreur serveur." },
      { status: 500 }
    );
  }

  const booked: Record<string, string[]> = {};
  for (const row of data ?? []) {
    const d = row.date as string;
    const s = row.slot as string;
    if (!booked[d]) booked[d] = [];
    booked[d].push(s);
  }

  return NextResponse.json(
    { booked },
    {
      headers: {
        "Cache-Control": "no-store",
      },
    }
  );
}
