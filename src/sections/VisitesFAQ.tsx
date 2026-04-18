"use client";

import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { Plus } from "lucide-react";
import { useState } from "react";

const faqs = [
  {
    q: "Combien de temps dure un scan sur place ?",
    a: "Environ 2 heures pour un bien de taille standard. Les grandes propriétés peuvent prendre un peu plus de temps — nous vous le confirmons au moment de la réservation.",
  },
  {
    q: "Dans quelle zone intervenez-vous ?",
    a: "Pour le moment, uniquement à Ouagadougou. Nous étendrons le service à d'autres villes dans les prochains mois.",
  },
  {
    q: "Quel matériel utilisez-vous ?",
    a: "Des caméras 360° professionnelles, calibrées pour un rendu net et fidèle. Nos équipes sont formées pour capturer chaque pièce sous le meilleur angle.",
  },
  {
    q: "Quand reçois-je le lien de la visite ?",
    a: "Sous 72h après le passage de notre équipe. Le lien est hébergé sur Kuula, accessible sur tous les appareils et partageable sans limite.",
  },
  {
    q: "Comment se passe le paiement ?",
    a: "Paiement par Mobile Money (Orange Money ou Moov Money) au moment de la réservation. Le créneau n'est bloqué qu'une fois le paiement confirmé — vous recevrez un SMS de confirmation.",
  },
  {
    q: "La visite 3D reste-t-elle en ligne combien de temps ?",
    a: "Sans limite de durée tant que votre annonce est active. Vous pouvez aussi nous demander de la retirer à tout moment.",
  },
  {
    q: "Puis-je annuler ou reporter ma réservation ?",
    a: "Oui. Contactez-nous au moins 24h avant le rendez-vous pour un report sans frais.",
  },
];

export function VisitesFAQ() {
  const reduce = useReducedMotion();
  const [open, setOpen] = useState<number | null>(0);

  return (
    <section className="py-24 bg-gradient-to-b from-[#EAEEFE] to-white">
      <div className="container">
        <div className="section-heading">
          <div className="flex justify-center">
            <div className="tag border-[#FF6B35] text-black">Questions</div>
          </div>
          <h2 className="section-title mt-5">Vos questions, nos réponses</h2>
        </div>

        <div className="mt-14 max-w-3xl mx-auto flex flex-col gap-3">
          {faqs.map((item, i) => {
            const isOpen = open === i;
            return (
              <div
                key={item.q}
                className="rounded-2xl border border-black/10 bg-white overflow-hidden shadow-[0_4px_10px_#EAEAEA]"
              >
                <button
                  type="button"
                  onClick={() => setOpen(isOpen ? null : i)}
                  aria-expanded={isOpen}
                  className="w-full flex items-center justify-between gap-4 px-5 py-4 text-left hover:bg-black/[0.02] transition-colors"
                >
                  <span className="font-medium text-black">{item.q}</span>
                  <motion.span
                    animate={{ rotate: isOpen ? 45 : 0 }}
                    transition={{ duration: 0.18 }}
                    className="h-8 w-8 rounded-full bg-[#FF6B35]/10 text-[#FF6B35] flex items-center justify-center shrink-0"
                  >
                    <Plus className="h-4 w-4" />
                  </motion.span>
                </button>
                <AnimatePresence initial={false}>
                  {isOpen && (
                    <motion.div
                      key="content"
                      initial={reduce ? { height: "auto" } : { height: 0 }}
                      animate={{ height: "auto" }}
                      exit={reduce ? { height: "auto" } : { height: 0 }}
                      transition={{ duration: 0.22, ease: "easeOut" }}
                      className="overflow-hidden"
                    >
                      <div className="px-5 pb-5 text-black/65 leading-relaxed">
                        {item.a}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
