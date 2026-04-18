"use client";

import Link from "next/link";
import { motion, useReducedMotion } from "framer-motion";
import { ChevronDown } from "lucide-react";

const KUULA_URL =
  "https://kuula.co/share/collection/7MDZD?logo=0&info=0&fs=1&vr=0&thumbs=1&inst=fr";

const stats = [
  { value: "~2 h", label: "sur place" },
  { value: "72 h", label: "de livraison" },
  { value: "7j/7", label: "entre 7h et 17h" },
];

export function VisitesHero() {
  const reduce = useReducedMotion();

  return (
    <>
      <section className="relative bg-black overflow-hidden h-[100svh] min-h-[600px] max-h-[960px]">
        <motion.iframe
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.7, ease: "easeOut" }}
          src={KUULA_URL}
          title="Visite 3D — exemple Kazedra"
          className="absolute inset-0 h-full w-full"
          allow="fullscreen; accelerometer; gyroscope; magnetometer; vr; xr-spatial-tracking"
          allowFullScreen
        />

        {/* Soft top scrim — only for header legibility, doesn't reach the card */}
        <div className="pointer-events-none absolute inset-x-0 top-0 h-32 bg-gradient-to-b from-black/30 to-transparent" />

        {/* Floating pitch card — aligned to container padding */}
        <div className="pointer-events-none absolute inset-x-0 bottom-0">
          <div className="container pb-8 md:pb-14">
            <motion.div
              initial={reduce ? { opacity: 0 } : { opacity: 0, y: 28 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.4, ease: [0.16, 1, 0.3, 1] }}
              className="pointer-events-auto max-w-md bg-white/95 backdrop-blur-2xl backdrop-saturate-150 rounded-3xl p-6 md:p-7 shadow-[0_25px_70px_-10px_rgba(0,0,0,0.55)] border border-white/70 ring-1 ring-black/5"
            >
              <div className="inline-flex border border-[#FF6B35] text-black rounded-full px-3 py-1 text-[11px] font-semibold tracking-wide uppercase">
                Ouagadougou · Visite en direct
              </div>
              <h1 className="mt-4 text-3xl md:text-4xl lg:text-5xl font-black tracking-[-0.035em] leading-[0.95] text-black">
                Voici ce que reçoivent vos clients.
              </h1>
              <p className="mt-3 text-[15px] md:text-base text-black/70 leading-relaxed">
                Scan 3D sur place, lien de visite sous 72h. Partageable sans
                limite, visitable depuis n&apos;importe quel téléphone.
              </p>
              <div className="mt-5">
                <Link
                  href="#booking"
                  className="inline-flex items-center gap-2 bg-[#FF6B35] hover:bg-[#FF6B35]/90 text-white font-semibold px-5 py-3 rounded-xl transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#FF6B35] focus-visible:ring-offset-2"
                >
                  Réserver un scan
                </Link>
              </div>
            </motion.div>
          </div>
        </div>

        {/* Scroll cue — bottom center */}
        <motion.div
          initial={reduce ? { opacity: 0 } : { opacity: 0, y: -6 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 1.4, ease: "easeOut" }}
          className="pointer-events-none hidden md:flex absolute bottom-6 left-1/2 -translate-x-1/2 items-center gap-2 bg-black/35 backdrop-blur-md rounded-full px-3 py-1.5 text-white text-[11px] font-semibold uppercase tracking-wider"
        >
          <span>Découvrir</span>
          <motion.span
            animate={reduce ? {} : { y: [0, 4, 0] }}
            transition={{ duration: 1.6, repeat: Infinity, ease: "easeInOut" }}
          >
            <ChevronDown className="h-4 w-4" />
          </motion.span>
        </motion.div>
      </section>

      {/* Stat strip */}
      <div className="border-b border-black/10 bg-white">
        <div className="container">
          <motion.div
            initial={reduce ? "visible" : "hidden"}
            whileInView="visible"
            viewport={{ once: true, amount: 0.4 }}
            variants={{
              hidden: {},
              visible: { transition: { staggerChildren: 0.1 } },
            }}
            className="grid grid-cols-3 divide-x divide-black/10"
          >
            {stats.map(({ value, label }) => (
              <motion.div
                key={label}
                variants={{
                  hidden: reduce ? { opacity: 0 } : { opacity: 0, y: 14 },
                  visible: {
                    opacity: 1,
                    y: 0,
                    transition: { duration: 0.5, ease: [0.16, 1, 0.3, 1] },
                  },
                }}
                className="py-8 md:py-10 px-3 text-center"
              >
                <div className="text-3xl md:text-5xl font-black tracking-tight text-black">
                  {value}
                </div>
                <div className="mt-2 text-xs md:text-sm font-medium text-black/55">
                  {label}
                </div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </div>
    </>
  );
}
