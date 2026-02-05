"use client";
import { twMerge } from "tailwind-merge";
import { motion } from "framer-motion";
import Image from "next/image";

import roogoPreview from "@/assets/home-roogo.png";

const roogoFeatures = [
  "Annonces 100% vérifiées",
  "Élimination des faux démarcheurs",
  "Interface simple et intuitive",
  "Support local dédié",
  "Paiement sécurisé mobile money",
  "Visites virtuelles HD",
];

type refProp = {
  refProp: React.RefObject<HTMLDivElement>;
  onJoin: () => void;
};

export const Pricing: React.FC<refProp> = ({ refProp, onJoin }) => {
  return (
    <section ref={refProp} className="py-24 bg-white">
      <div className="container">
        <div className="section-heading">
          <div className="flex justify-center">
            <div className="tag border-[#FF6B35] text-black">
              Notre Produit Phare
            </div>
          </div>
          <h2 className="section-title mt-5">Roogo Burkina</h2>
          <p className="section-description mt-5">
            La plateforme immobilière nouvelle génération conçue pour éliminer
            la fraude et simplifier la vie des Burkinabè.
          </p>
        </div>

        <div className="mt-16 flex flex-col lg:flex-row gap-12 items-center">
          <div className="lg:w-1/2">
            <div className="card border-black bg-black text-white p-12 w-full max-w-none">
              <h3 className="text-3xl font-bold mb-6">Pourquoi Roogo ?</h3>
              <p className="text-white/70 mb-8 text-lg">
                Roogo est né d&apos;une volonté de protéger les citoyens contre
                les mauvaises expériences et les arnaques des intermédiaires
                indélicats dans le secteur immobilier.
              </p>
              <ul className="flex flex-col gap-5">
                {roogoFeatures.map((feature, key) => (
                  <li key={key} className="text-lg flex items-center gap-4">
                    <span className="text-[#FF6B35]">✓</span>
                    <span>{feature}</span>
                  </li>
                ))}
              </ul>
              <button
                onClick={onJoin}
                className="btn bg-[#FF6B35] text-white justify-center w-full mt-10 text-lg py-4"
              >
                Découvrir Roogo
              </button>
            </div>
          </div>

          <div className="lg:w-1/2 relative flex justify-center items-center">
            <div className="relative rounded-[3rem] overflow-hidden shadow-2xl border-8 border-white w-full max-w-[320px] aspect-[9/19.5]">
              <Image
                src={roogoPreview}
                alt="Roogo App Preview"
                fill
                className="object-cover"
              />
            </div>

            {/* Decorative elements */}
            <div className="absolute -bottom-6 -right-6 w-32 h-32 bg-[#FF6B35] rounded-full -z-10 blur-3xl opacity-20"></div>
            <div className="absolute -top-6 -left-6 w-32 h-32 bg-[#FF6B35] rounded-full -z-10 blur-3xl opacity-10"></div>
          </div>
        </div>
      </div>
    </section>
  );
};
