import { NextResponse } from "next/server";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

// Superseded by /api/payments/initiate on 2026-04-18. Bookings now require a
// PawaPay deposit up-front; we keep this route as a 410 Gone so any stale
// clients get a clear signal instead of a 404.
export async function POST() {
  return NextResponse.json(
    {
      error:
        "Cette API a été remplacée. Utilisez /api/payments/initiate pour créer une réservation.",
      code: "gone",
    },
    { status: 410 }
  );
}
