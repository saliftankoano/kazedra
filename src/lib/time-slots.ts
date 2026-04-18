export const SLOTS = [
  "07:00-09:00",
  "09:00-11:00",
  "11:00-13:00",
  "13:00-15:00",
  "15:00-17:00",
] as const;

export type Slot = (typeof SLOTS)[number];

export const AREA_BANDS = ["<100", "100-200", "200-500", ">500"] as const;
export type AreaBand = (typeof AREA_BANDS)[number];

export const AREA_BAND_LABELS: Record<AreaBand, string> = {
  "<100": "Moins de 100 m²",
  "100-200": "100 à 200 m²",
  "200-500": "200 à 500 m²",
  ">500": "Plus de 500 m²",
};

export const PRICE_SCAN_ONLY = 50000;
export const PRICE_SCAN_WITH_ROOGO = 30000;

export function formatDateISO(d: Date): string {
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${y}-${m}-${day}`;
}

export function formatFCFA(amount: number): string {
  return amount.toLocaleString("fr-FR") + " FCFA";
}
