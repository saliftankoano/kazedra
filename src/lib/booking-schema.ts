import { z } from "zod";
import { SLOTS, AREA_BANDS } from "./time-slots";

const phoneRegex = /^(\+?226)?[\s-]?[0-9]{2}[\s-]?[0-9]{2}[\s-]?[0-9]{2}[\s-]?[0-9]{2}$/;

export const bookingSchema = z.object({
  date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, "Date invalide"),
  slot: z.enum(SLOTS, { message: "Créneau invalide" }),
  name: z.string().trim().min(2, "Nom trop court").max(120),
  company: z.string().trim().max(120).optional().or(z.literal("")),
  phone: z
    .string()
    .trim()
    .regex(phoneRegex, "Numéro invalide (ex. +226 70 12 34 56)"),
  email: z
    .string()
    .trim()
    .email("Email invalide")
    .optional()
    .or(z.literal("")),
  address: z.string().trim().min(4, "Adresse trop courte").max(500),
  area_band: z.enum(AREA_BANDS, { message: "Superficie invalide" }),
  with_roogo: z.boolean(),
  notes: z.string().trim().max(2000).optional().or(z.literal("")),
});

export type BookingInput = z.infer<typeof bookingSchema>;

export const PAYMENT_PROVIDERS = ["ORANGE_BFA", "MOOV_BFA"] as const;
export type PaymentProvider = (typeof PAYMENT_PROVIDERS)[number];

export const paymentInitiateSchema = bookingSchema.extend({
  payment_provider: z.enum(PAYMENT_PROVIDERS, {
    message: "Opérateur invalide",
  }),
  payment_phone: z
    .string()
    .trim()
    .regex(phoneRegex, "Numéro Mobile Money invalide"),
  pre_authorisation_code: z
    .string()
    .trim()
    .min(4)
    .max(12)
    .optional()
    .or(z.literal("")),
});

export type PaymentInitiateInput = z.infer<typeof paymentInitiateSchema>;

export function normalizePhone(input: string): string {
  const digits = input.replace(/\D/g, "");
  if (digits.startsWith("226")) return "+" + digits;
  if (digits.length === 8) return "+226" + digits;
  return input.startsWith("+") ? input : "+" + digits;
}

export function toPawaPayPhone(input: string): string {
  const digits = input.replace(/\D/g, "");
  if (digits.startsWith("226")) return digits.slice(0, 11);
  if (digits.length === 8) return "226" + digits;
  return digits;
}
