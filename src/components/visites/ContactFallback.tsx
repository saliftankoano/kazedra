"use client";

import Image, { type StaticImageData } from "next/image";
import { motion, useReducedMotion } from "framer-motion";
import { MessageCircle, PhoneCall } from "lucide-react";
import moovLogo from "@/assets/moov-money.png";
import orangeLogo from "@/assets/orange-money.png";

type Line = {
  carrier: string;
  logo: StaticImageData;
  logoBg: string;
  display: string;
  tel: string;
  wa: string;
};

const LINES: Line[] = [
  {
    carrier: "Moov",
    logo: moovLogo,
    logoBg: "bg-white",
    display: "+226 53 11 11 19",
    tel: "tel:+22653111119",
    wa: "https://wa.me/22653111119",
  },
  {
    carrier: "Orange",
    logo: orangeLogo,
    logoBg: "bg-[#FF6600]",
    display: "+226 67 00 61 16",
    tel: "tel:+22667006116",
    wa: "https://wa.me/22667006116",
  },
];

export function ContactFallback() {
  const reduce = useReducedMotion();

  return (
    <section className="py-12 bg-white border-y border-black/5">
      <div className="container">
        <motion.div
          initial={reduce ? { opacity: 0 } : { opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.5 }}
          transition={{ duration: 0.3 }}
          className="max-w-3xl mx-auto text-center"
        >
          <p className="text-sm tracking-wider text-[#FF6B35] font-semibold uppercase">
            Besoin d&apos;un conseil ?
          </p>
          <h3 className="mt-2 text-2xl md:text-3xl font-bold tracking-tight">
            Pas sûr ? Parlez à un conseiller.
          </h3>
          <p className="mt-2 text-sm text-black/60 max-w-xl mx-auto">
            Deux lignes, une par réseau — appelez celle de votre opérateur pour
            éviter les frais inter-réseaux. WhatsApp fonctionne sur les deux.
          </p>

          <div className="mt-7 grid grid-cols-1 sm:grid-cols-2 gap-3 max-w-xl mx-auto">
            {LINES.map(({ carrier, logo, logoBg, display, tel, wa }) => (
              <div
                key={display}
                className="rounded-2xl border border-black/10 bg-white p-5 text-left"
              >
                <div className="flex items-center gap-3">
                  <div
                    className={`h-11 w-11 rounded-xl ${logoBg} border border-black/5 flex items-center justify-center overflow-hidden shrink-0`}
                  >
                    <Image
                      src={logo}
                      alt={`${carrier} Money`}
                      width={44}
                      height={44}
                      className="h-full w-full object-contain"
                    />
                  </div>
                  <div>
                    <p className="text-xs font-semibold tracking-wider text-black/50 uppercase">
                      Réseau {carrier}
                    </p>
                    <p className="text-base font-bold">{display}</p>
                  </div>
                </div>
                <div className="mt-4 flex gap-2">
                  <a
                    href={tel}
                    className="flex-1 inline-flex items-center justify-center gap-1.5 rounded-lg border border-black/10 px-3 py-2 text-sm font-medium hover:border-[#FF6B35] hover:bg-[#FF6B35]/5 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#FF6B35]"
                  >
                    <PhoneCall className="h-3.5 w-3.5 text-[#FF6B35]" />
                    Appeler
                  </a>
                  <a
                    href={wa}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex-1 inline-flex items-center justify-center gap-1.5 rounded-lg border border-black/10 px-3 py-2 text-sm font-medium hover:border-[#25D366] hover:bg-[#25D366]/5 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#25D366]"
                  >
                    <MessageCircle className="h-3.5 w-3.5 text-[#25D366]" />
                    WhatsApp
                  </a>
                </div>
              </div>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  );
}
