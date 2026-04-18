"use client";

import { motion, useReducedMotion } from "framer-motion";
import { ArrowRight, Check } from "lucide-react";
import { PRICE_SCAN_ONLY, PRICE_SCAN_WITH_ROOGO } from "@/lib/time-slots";

const standardFeatures = [
  "Scan 3D complet du bien",
  "Lien de visite partageable",
  "Accès illimité, hébergé sur Kuula",
  "Livraison sous 72 h",
];

const roogoFeatures = [
  "Tout le contenu du forfait standard",
  "Publication de votre annonce sur Roogo",
  "Mise en avant de la visite 3D",
  "Assistance pour la rédaction de l'annonce",
  "Économie de 20 000 FCFA",
];

function scrollToBooking(withRoogo: boolean) {
  try {
    window.dispatchEvent(
      new CustomEvent("kazedra:select-formule", {
        detail: { withRoogo },
      }),
    );
  } catch {
    // noop
  }
  const el = document.getElementById("booking");
  if (el) {
    const y = el.getBoundingClientRect().top + window.scrollY + 160;
    window.scrollTo({ top: y, behavior: "smooth" });
  }
}

export function VisitesPricing() {
  const reduce = useReducedMotion();

  return (
    <section className="py-24 bg-[#EAEEFE]">
      <div className="container">
        <div className="section-heading">
          <div className="flex justify-center">
            <div className="tag border-[#FF6B35] text-black">Tarifs clairs</div>
          </div>
          <h2 className="section-title mt-5">Simple et efficace.</h2>
          <p className="section-description mt-5">
            Sans abonnement, sans surprise. Zone desservie&nbsp;: Ouagadougou.
          </p>
        </div>

        <div className="mt-16 grid grid-cols-1 md:grid-cols-2 gap-6 max-w-4xl mx-auto">
          {/* Standard card */}
          <motion.button
            type="button"
            onClick={() => scrollToBooking(false)}
            initial={reduce ? { opacity: 0 } : { opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            whileHover={reduce ? {} : { y: -8 }}
            whileTap={reduce ? {} : { scale: 0.98 }}
            viewport={{ once: true, amount: 0.3 }}
            transition={{ duration: 0.9, ease: [0.16, 1, 0.3, 1] }}
            className="group text-left rounded-3xl bg-white border border-black/10 p-8 md:p-10 shadow-[0_7px_14px_#EAEAEA] hover:shadow-2xl hover:border-[#FF6B35]/20 transition-shadow focus:outline-none focus-visible:ring-2 focus-visible:ring-[#FF6B35]"
          >
            <div className="tag border-black/15 text-black/60">Standard</div>
            <h3 className="text-2xl font-bold mt-4 group-hover:text-[#FF6B35] transition-colors duration-200">
              Scan 3D
            </h3>
            <p className="text-black/60 mt-1">Idéal pour les agences</p>
            <div className="mt-6">
              <span className="text-5xl font-bold tracking-tight whitespace-nowrap">
                {PRICE_SCAN_ONLY.toLocaleString("fr-FR")}
              </span>
              <span className="text-2xl font-bold tracking-tight ml-1.5 text-black/80">
                FCFA
              </span>
              <span className="text-black/50 ml-2">/ bien</span>
            </div>
            <ul className="mt-8 space-y-3">
              {standardFeatures.map((f) => (
                <li key={f} className="flex items-start gap-3 text-black/80">
                  <Check className="h-5 w-5 text-[#FF6B35] mt-0.5 shrink-0" />
                  <span>{f}</span>
                </li>
              ))}
            </ul>
            <span className="mt-8 inline-flex w-full justify-center items-center gap-2 px-5 py-3 rounded-xl border border-black text-black font-medium group-hover:bg-black group-hover:text-white transition-colors duration-200">
              Réserver ce forfait
              <ArrowRight className="h-4 w-4 opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-200" />
            </span>
          </motion.button>

          {/* Popular card */}
          <motion.button
            type="button"
            onClick={() => scrollToBooking(true)}
            initial={reduce ? { opacity: 0 } : { opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            whileHover={reduce ? {} : { y: -8 }}
            whileTap={reduce ? {} : { scale: 0.98 }}
            viewport={{ once: true, amount: 0.3 }}
            transition={{ duration: 0.9, delay: 0.18, ease: [0.16, 1, 0.3, 1] }}
            className="group text-left relative rounded-3xl bg-black text-white p-8 md:p-10 shadow-2xl overflow-hidden hover:shadow-[0_24px_64px_rgba(255,107,53,0.35)] focus:outline-none focus-visible:ring-2 focus-visible:ring-[#FF6B35]"
          >
            {/* glow orb — expands on hover */}
            <div className="absolute -top-16 -right-16 w-56 h-56 bg-[#FF6B35] rounded-full opacity-30 blur-3xl transition-all duration-500 group-hover:opacity-50 group-hover:scale-125" />
            <div className="relative">
              <div className="inline-flex items-center gap-2">
                <span className="tag bg-[#FF6B35] text-white border-transparent">
                  Populaire
                </span>
                <span className="text-white/60 text-sm">
                  Économisez 20 000 FCFA
                </span>
              </div>
              <h3 className="text-2xl font-bold mt-4 group-hover:text-[#FF6B35] transition-colors duration-200">
                Scan 3D + Roogo
              </h3>
              <p className="text-white/65 mt-1">
                Le scan + publication sur Roogo
              </p>
              <div className="mt-6">
                <span className="text-5xl font-bold tracking-tight whitespace-nowrap">
                  {PRICE_SCAN_WITH_ROOGO.toLocaleString("fr-FR")}
                </span>
                <span className="text-2xl font-bold tracking-tight ml-1.5 text-white/80">
                  FCFA
                </span>
                <span className="text-white/50 ml-2">/ bien</span>
              </div>
              <ul className="mt-8 space-y-3">
                {roogoFeatures.map((f) => (
                  <li key={f} className="flex items-start gap-3">
                    <Check className="h-5 w-5 text-[#FF6B35] mt-0.5 shrink-0" />
                    <span>{f}</span>
                  </li>
                ))}
              </ul>
              <span className="mt-8 inline-flex w-full justify-center items-center gap-2 px-5 py-3 rounded-xl bg-[#FF6B35] text-white font-medium group-hover:bg-[#FF6B35]/90 transition-colors duration-200">
                Réserver avec Roogo
                <ArrowRight className="h-4 w-4 opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-200" />
              </span>
            </div>
          </motion.button>
        </div>
      </div>
    </section>
  );
}
