"use client";

import Link from "next/link";
import { motion, useReducedMotion } from "framer-motion";
import { ArrowUpRight, Hand, MapPin, Maximize2 } from "lucide-react";

type Stat = { value: string; label: string };

type Realisation = {
  name: string;
  type: string;
  city: string;
  kuulaEmbedUrl: string;
  kuulaShareUrl: string;
  mapsUrl: string;
  stats: Stat[];
};

const realisations: Realisation[] = [
  {
    name: "Restaurant Italien Rosa Dei Venti",
    type: "Restaurant",
    city: "Ouagadougou",
    kuulaEmbedUrl:
      "https://kuula.co/share/collection/7M2C4?logo=1&info=0&logosize=160&fs=1&vr=1&zoom=1&sd=1&thumbs=1&margin=20&inst=fr",
    kuulaShareUrl: "https://kuula.co/share/collection/7M2C4",
    mapsUrl: "https://maps.app.goo.gl/4Zdg2Hpk7n2ohSni8",
    stats: [
      { value: "5", label: "Espaces capturés" },
      { value: "28", label: "Angles à explorer" },
      { value: "72h", label: "De la capture à la livraison" },
    ],
  },
];

const chapter = (i: number) => `Chapitre ${String(i + 1).padStart(2, "0")}`;

export function VisitesRealisations() {
  const reduce = useReducedMotion();

  return (
    <section className="bg-white">
      {/* Editorial intro */}
      <div className="container pt-20 md:pt-28 pb-10 md:pb-14">
        <motion.div
          initial={reduce ? { opacity: 0 } : { opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.4 }}
          transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
          className="flex flex-col items-center text-center"
        >
          <div className="tag border-[#FF6B35] text-black">Réalisations</div>
          <h2 className="section-title mt-5 max-w-3xl">
            Chaque espace mérite son film.
          </h2>
          <p className="section-description mt-5 max-w-2xl">
            Voici ce que nous livrons. Pas une photo, pas une vidéo —
            <em> une visite complète</em>, scrollable et partageable. Faites
            défiler pour entrer.
          </p>
        </motion.div>
      </div>

      {realisations.map((r, idx) => (
        <article key={r.name}>
          {/* Chapter header */}
          <div className="container pt-8 md:pt-12 pb-8 md:pb-10">
            <motion.div
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, amount: 0.3 }}
              variants={{
                hidden: {},
                visible: {
                  transition: { delayChildren: 0.05, staggerChildren: 0.08 },
                },
              }}
            >
              <motion.div
                variants={{
                  hidden: reduce ? { opacity: 0 } : { opacity: 0, y: 14 },
                  visible: { opacity: 1, y: 0 },
                }}
                transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
                className="flex items-center gap-3 text-[11px] md:text-xs font-bold uppercase tracking-[0.22em] text-[#FF6B35]"
              >
                <span className="h-px w-8 bg-[#FF6B35]" />
                {chapter(idx)}
              </motion.div>

              <motion.h3
                variants={{
                  hidden: reduce ? { opacity: 0 } : { opacity: 0, y: 24 },
                  visible: { opacity: 1, y: 0 },
                }}
                transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
                className="mt-4 text-4xl md:text-6xl lg:text-7xl font-black tracking-[-0.035em] leading-[0.95] text-black max-w-5xl"
              >
                {r.name}
              </motion.h3>

              <motion.div
                variants={{
                  hidden: reduce ? { opacity: 0 } : { opacity: 0, y: 14 },
                  visible: { opacity: 1, y: 0 },
                }}
                transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
                className="mt-4 text-base md:text-lg text-black/60"
              >
                {r.type} · {r.city}
              </motion.div>

              {/* Stats row */}
              <motion.div
                variants={{
                  hidden: {},
                  visible: { transition: { staggerChildren: 0.08 } },
                }}
                className="mt-10 grid grid-cols-3 gap-4 md:flex md:flex-wrap md:items-end md:gap-12 lg:gap-16 border-t border-black/10 pt-8"
              >
                {r.stats.map((s) => (
                  <motion.div
                    key={s.label}
                    variants={{
                      hidden: reduce ? { opacity: 0 } : { opacity: 0, y: 14 },
                      visible: { opacity: 1, y: 0 },
                    }}
                    transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
                  >
                    <div className="text-3xl md:text-5xl font-black tracking-tighter text-black leading-none">
                      {s.value}
                    </div>
                    <div className="mt-2 text-[11px] md:text-xs font-semibold text-black/55 uppercase tracking-wider">
                      {s.label}
                    </div>
                  </motion.div>
                ))}
              </motion.div>
            </motion.div>
          </div>

          {/* Full-bleed immersive panel */}
          <motion.div
            initial={reduce ? { opacity: 0 } : { opacity: 0, scale: 0.96 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true, amount: 0.15 }}
            transition={{ duration: 0.9, ease: [0.16, 1, 0.3, 1] }}
            className="relative bg-black h-[100svh] min-h-[600px] max-h-[920px] overflow-hidden"
          >
            {/* Brand accent line at top */}
            <div className="absolute inset-x-0 top-0 h-[3px] bg-gradient-to-r from-transparent via-[#FF6B35] to-transparent z-20" />

            <iframe
              src={r.kuulaEmbedUrl}
              title={`Visite 3D — ${r.name}`}
              className="absolute inset-0 h-full w-full"
              allow="fullscreen; accelerometer; gyroscope; magnetometer; vr; xr-spatial-tracking"
              allowFullScreen
              loading="lazy"
            />

            {/* Top + bottom scrims for UI legibility */}
            <div className="pointer-events-none absolute inset-x-0 top-0 h-32 bg-gradient-to-b from-black/40 to-transparent z-10" />
            <div className="pointer-events-none absolute inset-x-0 bottom-0 h-40 bg-gradient-to-t from-black/35 to-transparent z-10" />

            {/* Drag hint — top right */}
            <motion.div
              initial={reduce ? { opacity: 0 } : { opacity: 0, y: -6 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 1.2, ease: "easeOut" }}
              className="pointer-events-none hidden md:flex absolute top-6 right-6 z-20 items-center gap-2 bg-[#FF6B35] rounded-full px-4 py-2 text-white text-[11px] font-bold uppercase tracking-wider shadow-[0_4px_14px_rgba(255,107,53,0.45)] ring-1 ring-white/20"
            >
              <motion.span
                animate={
                  reduce
                    ? {}
                    : { x: [0, 4, 0, -4, 0], rotate: [0, 8, 0, -8, 0] }
                }
                transition={{
                  duration: 2.4,
                  repeat: Infinity,
                  ease: "easeInOut",
                }}
              >
                <Hand className="h-3.5 w-3.5" />
              </motion.span>
              <span>Glissez pour explorer</span>
            </motion.div>

            {/* Action bar — bottom right */}
            <motion.div
              initial={reduce ? { opacity: 0 } : { opacity: 0, y: 14 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.5, ease: [0.16, 1, 0.3, 1] }}
              className="absolute bottom-6 md:bottom-8 right-4 md:right-8 z-20 flex items-center gap-2 md:gap-3"
            >
              <Link
                href={r.mapsUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 bg-[#FF6B35] hover:bg-[#FF6B35]/90 text-white text-xs md:text-sm font-semibold px-3 md:px-4 py-2 md:py-2.5 rounded-full transition-colors shadow-[0_4px_14px_rgba(255,107,53,0.4)]"
              >
                <MapPin className="h-3.5 w-3.5 md:h-4 md:w-4" />
                <span className="hidden sm:inline">Localisation</span>
              </Link>
              <Link
                href={r.kuulaShareUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 bg-white text-black hover:bg-[#FF6B35] hover:text-white text-xs md:text-sm font-semibold px-4 md:px-5 py-2 md:py-2.5 rounded-full transition-colors"
              >
                <Maximize2 className="h-3.5 w-3.5 md:h-4 md:w-4" />
                <span>Plein écran</span>
              </Link>
            </motion.div>
          </motion.div>
        </article>
      ))}

      {/* Closing CTA */}
      <div className="container py-20 md:py-28">
        <motion.div
          initial={reduce ? { opacity: 0 } : { opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.3 }}
          transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
          className="relative overflow-hidden rounded-3xl bg-black text-white p-10 md:p-16"
        >
          {/* Subtle radial accent */}
          <div
            className="pointer-events-none absolute -top-32 -right-32 h-96 w-96 rounded-full opacity-40"
            style={{
              background:
                "radial-gradient(closest-side, rgba(255,107,53,0.55), transparent)",
            }}
          />
          <div
            className="pointer-events-none absolute -bottom-24 -left-24 h-72 w-72 rounded-full opacity-30"
            style={{
              background:
                "radial-gradient(closest-side, rgba(255,107,53,0.45), transparent)",
            }}
          />

          <div className="relative flex flex-col md:flex-row md:items-end md:justify-between gap-8">
            <div className="max-w-2xl">
              <div className="text-[11px] md:text-xs font-bold uppercase tracking-[0.22em] text-[#FF6B35]">
                Le prochain chapitre
              </div>
              <h3 className="mt-5 text-4xl md:text-5xl lg:text-6xl font-black tracking-[-0.035em] leading-[0.95]">
                Et si c&apos;était votre espace,
                <br />
                la prochaine fois&nbsp;?
              </h3>
              <p className="mt-5 text-base md:text-lg text-white/70 leading-relaxed">
                Restaurant, hôtel, bureau, salle d&apos;événement, maison —
                n&apos;importe quel espace que vos clients méritent de voir
                avant de venir. On scanne sur place. Vous recevez le lien sous
                72h.
              </p>
            </div>
            <Link
              href="#booking"
              className="group inline-flex items-center gap-2 bg-[#FF6B35] hover:bg-white hover:text-black text-white font-semibold px-7 py-4 rounded-full transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#FF6B35] focus-visible:ring-offset-2 focus-visible:ring-offset-black self-start md:self-auto whitespace-nowrap text-base"
            >
              Réserver mon scan
              <ArrowUpRight className="h-5 w-5 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
            </Link>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
