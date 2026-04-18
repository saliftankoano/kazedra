"use client";

import {
  motion,
  useScroll,
  useSpring,
  useTransform,
  useReducedMotion,
} from "framer-motion";
import { useRef } from "react";
import { Calendar, Camera, Link as LinkIcon } from "lucide-react";

const steps = [
  {
    icon: Calendar,
    title: "1. Vous réservez",
    body:
      "Choisissez un créneau de 2 heures, 7j/7 entre 7h et 17h. En quelques clics, sans appel.",
  },
  {
    icon: Camera,
    title: "2. On scanne",
    body:
      "Notre équipe se déplace sur site avec l'équipement. Le scan complet prend environ 2 heures.",
  },
  {
    icon: LinkIcon,
    title: "3. Vous partagez",
    body:
      "Vous recevez un lien de visite sous 72h. Partagez-le à vos clients — ils visitent en 1 clic.",
  },
];

export function VisitesProcess() {
  const reduce = useReducedMotion();
  const ref = useRef<HTMLDivElement | null>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start 85%", "center 55%"],
  });
  const smooth = useSpring(scrollYProgress, { damping: 25, stiffness: 140 });
  const pathLength = useTransform(smooth, [0, 1], [0, 1]);

  return (
    <section className="py-24 bg-gradient-to-b from-white to-[#EAEEFE] overflow-x-clip">
      <div className="container">
        <div className="section-heading">
          <div className="flex justify-center">
            <div className="tag border-[#FF6B35] text-black">Processus</div>
          </div>
          <h2 className="section-title mt-5">Comment ça marche</h2>
          <p className="section-description mt-5">
            Trois étapes simples, de la réservation jusqu&apos;au lien
            partageable.
          </p>
        </div>

        <div ref={ref} className="relative mt-20 max-w-5xl mx-auto">
          {/* Desktop connecting line — spans from center of first circle to center of last */}
          <svg
            className="hidden md:block absolute top-10 left-[16.67%] h-2 w-[66.67%] pointer-events-none"
            viewBox="0 0 100 2"
            preserveAspectRatio="none"
          >
            <line
              x1="0"
              y1="1"
              x2="100"
              y2="1"
              stroke="#EAEAEA"
              strokeWidth="2"
            />
            <motion.line
              x1="0"
              y1="1"
              x2="100"
              y2="1"
              stroke="#FF6B35"
              strokeWidth="2"
              style={{ pathLength: reduce ? 1 : pathLength }}
            />
          </svg>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-10 md:gap-6">
            {steps.map(({ icon: Icon, title, body }, idx) => (
              <motion.div
                key={title}
                initial={reduce ? { opacity: 0 } : { opacity: 0, y: 28 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.5 }}
                transition={{ duration: 0.5, delay: idx * 0.12 }}
                className="flex flex-col items-center text-center"
              >
                <div className="h-20 w-20 rounded-full bg-white border-2 border-[#FF6B35] text-[#FF6B35] flex items-center justify-center shadow-[0_8px_20px_rgba(255,107,53,0.2)] mb-6 relative z-10">
                  <Icon className="h-9 w-9" strokeWidth={1.8} />
                </div>
                <h3 className="text-xl font-bold mb-2">{title}</h3>
                <p className="text-black/65 max-w-[280px]">{body}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
