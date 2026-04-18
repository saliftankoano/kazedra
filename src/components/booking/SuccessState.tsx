"use client";

import { motion, useReducedMotion } from "framer-motion";
import { format, parseISO } from "date-fns";
import { fr } from "date-fns/locale";
import Link from "next/link";

type Props = {
  date: string;
  slot: string;
};

export function SuccessState({ date, slot }: Props) {
  const reduce = useReducedMotion();

  return (
    <motion.div
      initial={reduce ? false : { opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35 }}
      className="rounded-2xl border border-black/10 bg-white p-10 text-center shadow-[0_7px_14px_#EAEAEA]"
    >
      <motion.svg
        viewBox="0 0 64 64"
        width={80}
        height={80}
        className="mx-auto mb-6"
      >
        <motion.circle
          cx="32"
          cy="32"
          r="28"
          fill="none"
          stroke="#FF6B35"
          strokeWidth={3}
          initial={reduce ? { pathLength: 1 } : { pathLength: 0 }}
          animate={{ pathLength: 1 }}
          transition={{ duration: 0.6, ease: "easeOut" }}
        />
        <motion.path
          d="M20 33 L29 42 L46 24"
          fill="none"
          stroke="#FF6B35"
          strokeWidth={4}
          strokeLinecap="round"
          strokeLinejoin="round"
          initial={reduce ? { pathLength: 1 } : { pathLength: 0 }}
          animate={{ pathLength: 1 }}
          transition={{ duration: 0.5, delay: 0.45, ease: "easeOut" }}
        />
      </motion.svg>

      <h3 className="text-2xl font-bold mb-2">Votre créneau est réservé</h3>
      <p className="text-black/60 max-w-md mx-auto">
        Visite programmée le{" "}
        <span className="font-medium">
          {format(parseISO(date), "EEEE d MMMM yyyy", { locale: fr })}
        </span>{" "}
        de <span className="font-medium">{slot.replace("-", " à ")}</span>. Vous
        allez recevoir un SMS de confirmation sur votre téléphone. Nous vous
        appellerons la veille pour finaliser l&apos;accès au bien.
      </p>

      <div className="mt-8 flex flex-col sm:flex-row gap-3 justify-center">
        <Link
          href="/"
          className="inline-flex justify-center items-center px-5 py-2.5 rounded-lg border border-black/15 hover:bg-black/5 transition-colors"
        >
          Retour à l&apos;accueil
        </Link>
        <a
          href="https://wa.me/22667006116"
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex justify-center items-center px-5 py-2.5 rounded-lg bg-black text-white hover:bg-black/85 transition-colors"
        >
          Nous écrire sur WhatsApp
        </a>
      </div>
    </motion.div>
  );
}
