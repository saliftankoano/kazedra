"use client";

import { FormEvent, useState } from "react";
import { motion, useReducedMotion } from "framer-motion";
import { format, parseISO } from "date-fns";
import { fr } from "date-fns/locale";
import { cn } from "@/lib/utils";
import {
  AREA_BANDS,
  AREA_BAND_LABELS,
  formatFCFA,
  PRICE_SCAN_ONLY,
  PRICE_SCAN_WITH_ROOGO,
  type Slot,
  type AreaBand,
} from "@/lib/time-slots";
import { bookingSchema, type BookingInput } from "@/lib/booking-schema";

type Props = {
  date: string;
  slot: Slot;
  initialWithRoogo?: boolean;
  onRequestPayment: (booking: BookingInput) => void;
};

type FieldErrors = Partial<Record<keyof ReturnType<typeof blank>, string>>;

function blank(withRoogo = false) {
  return {
    name: "",
    company: "",
    phone: "",
    email: "",
    address: "",
    area_band: "100-200" as AreaBand,
    with_roogo: withRoogo,
    notes: "",
  };
}

export function BookingForm({
  date,
  slot,
  initialWithRoogo = false,
  onRequestPayment,
}: Props) {
  const reduce = useReducedMotion();
  const [values, setValues] = useState(blank(initialWithRoogo));
  const [errors, setErrors] = useState<FieldErrors>({});

  const price = values.with_roogo ? PRICE_SCAN_WITH_ROOGO : PRICE_SCAN_ONLY;

  function handleSubmit(e: FormEvent) {
    e.preventDefault();

    const candidate = { date, slot, ...values };
    const parsed = bookingSchema.safeParse(candidate);
    if (!parsed.success) {
      const flat = parsed.error.flatten().fieldErrors;
      const fe: FieldErrors = {};
      for (const key of Object.keys(flat) as Array<keyof FieldErrors>) {
        const msgs = flat[key as keyof typeof flat];
        if (msgs && msgs.length) fe[key] = msgs[0];
      }
      setErrors(fe);
      return;
    }
    setErrors({});
    onRequestPayment(parsed.data);
  }

  return (
    <motion.form
      onSubmit={handleSubmit}
      initial={reduce ? false : { opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="rounded-2xl border border-black/10 bg-white p-6 md:p-8 shadow-[0_7px_14px_#EAEAEA]"
    >
      <div className="flex flex-wrap items-baseline justify-between gap-2 mb-6">
        <div>
          <h3 className="text-xl font-bold">Vos informations</h3>
          <p className="text-sm text-black/50">
            Visite le {format(parseISO(date), "EEEE d MMMM yyyy", { locale: fr })}{" "}
            de {slot.replace("-", " à ")}
          </p>
        </div>
        <div className="text-right">
          <div className="text-sm text-black/50">Tarif</div>
          <div className="text-xl font-bold text-[#FF6B35]">
            {formatFCFA(price)}
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Field label="Nom complet" error={errors.name} required>
          <input
            type="text"
            className={input(errors.name)}
            value={values.name}
            onChange={(e) => setValues({ ...values, name: e.target.value })}
            placeholder="Awa Ouédraogo"
            autoComplete="name"
          />
        </Field>

        <Field label="Société / agence" error={errors.company}>
          <input
            type="text"
            className={input(errors.company)}
            value={values.company}
            onChange={(e) => setValues({ ...values, company: e.target.value })}
            placeholder="Immobilier Faso SARL"
            autoComplete="organization"
          />
        </Field>

        <Field label="Téléphone" error={errors.phone} required>
          <input
            type="tel"
            inputMode="tel"
            className={input(errors.phone)}
            value={values.phone}
            onChange={(e) => setValues({ ...values, phone: e.target.value })}
            placeholder="+226 70 12 34 56"
            autoComplete="tel"
          />
        </Field>

        <Field label="Email" error={errors.email}>
          <input
            type="email"
            className={input(errors.email)}
            value={values.email}
            onChange={(e) => setValues({ ...values, email: e.target.value })}
            placeholder="vous@exemple.com"
            autoComplete="email"
          />
        </Field>

        <div className="md:col-span-2">
          <Field label="Adresse du bien" error={errors.address} required>
            <input
              type="text"
              className={input(errors.address)}
              value={values.address}
              onChange={(e) =>
                setValues({ ...values, address: e.target.value })
              }
              placeholder="Quartier, secteur, point de repère"
              autoComplete="street-address"
            />
          </Field>
        </div>

        <Field label="Superficie approximative" error={errors.area_band} required>
          <select
            className={input(errors.area_band)}
            value={values.area_band}
            onChange={(e) =>
              setValues({ ...values, area_band: e.target.value as AreaBand })
            }
          >
            {AREA_BANDS.map((b) => (
              <option key={b} value={b}>
                {AREA_BAND_LABELS[b]}
              </option>
            ))}
          </select>
        </Field>

        <div className="flex items-end">
          <label className="flex items-center gap-3 cursor-pointer select-none p-3 rounded-xl border border-black/10 hover:bg-black/[0.02] transition-colors w-full">
            <input
              type="checkbox"
              className="h-5 w-5 accent-[#FF6B35]"
              checked={values.with_roogo}
              onChange={(e) =>
                setValues({ ...values, with_roogo: e.target.checked })
              }
            />
            <span className="text-sm">
              <span className="font-medium">Publier aussi sur Roogo</span>
              <span className="block text-black/50">
                Tarif réduit à {formatFCFA(PRICE_SCAN_WITH_ROOGO)}
              </span>
            </span>
          </label>
        </div>

        <div className="md:col-span-2">
          <Field label="Notes (optionnel)" error={errors.notes}>
            <textarea
              rows={3}
              className={input(errors.notes)}
              value={values.notes}
              onChange={(e) => setValues({ ...values, notes: e.target.value })}
              placeholder="Étage, accès, contraintes particulières…"
            />
          </Field>
        </div>
      </div>

      <button
        type="submit"
        className="mt-6 w-full bg-black text-white py-4 rounded-xl font-medium text-lg hover:bg-black/85 transition-colors inline-flex items-center justify-center gap-2"
      >
        Payer et réserver — {formatFCFA(price)}
      </button>
      <p className="mt-3 text-xs text-black/40 text-center">
        Paiement Mobile Money (Orange ou Moov). Tarif total débité à la
        réservation.
      </p>
    </motion.form>
  );
}

function Field({
  label,
  error,
  required,
  children,
}: {
  label: string;
  error?: string;
  required?: boolean;
  children: React.ReactNode;
}) {
  return (
    <label className="flex flex-col gap-1.5">
      <span className="text-sm font-medium text-black/80">
        {label}
        {required && <span className="text-[#FF6B35]"> *</span>}
      </span>
      {children}
      {error && <span className="text-xs text-red-600">{error}</span>}
    </label>
  );
}

function input(error?: string) {
  return cn(
    "w-full h-11 px-3 rounded-lg border bg-white text-[15px]",
    "focus:outline-none focus:ring-2 focus:ring-[#FF6B35]/40 focus:border-[#FF6B35]",
    "transition-colors",
    error ? "border-red-400" : "border-black/15"
  );
}
