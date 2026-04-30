export const SLOTS = [
  "07:00-09:00",
  "09:00-11:00",
  "11:00-13:00",
  "13:00-15:00",
  "15:00-17:00",
] as const;

export type Slot = (typeof SLOTS)[number];

export const PRICE_PER_ROOM = 10_000;
export const PRICE_PER_ROOM_WITH_ROOGO = 7_500; // 25% off
export const ROOGO_DISCOUNT_PCT = 25;

export function computePrice(roomCount: number, withRoogo: boolean): number {
  const rate = withRoogo ? PRICE_PER_ROOM_WITH_ROOGO : PRICE_PER_ROOM;
  return Math.max(1, Math.floor(roomCount)) * rate;
}

export function formatDateISO(d: Date): string {
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${y}-${m}-${day}`;
}

export function formatFCFA(amount: number): string {
  return amount.toLocaleString("fr-FR") + " FCFA";
}
