"use client";
import avatar1 from "@/assets/Salif.jpg";
import Image from "next/image";
import { twMerge } from "tailwind-merge";
import { motion } from "framer-motion";
import { Fragment } from "react";
import { User } from "lucide-react";

const team = [
  {
    role: "PDG & Fondateur",
    imageSrc: avatar1.src,
    name: "Salif Tankoano",
    description:
      "Visionnaire et passionné par l'impact de la technologie sur le quotidien des Burkinabè.",
  },
  {
    role: "Directeur Communication",
    imageSrc: null,
    name: "Ablassé Zagre",
    description:
      "Expert en communication stratégique, il porte la voix et les valeurs de Kazedra.",
  },
  {
    role: "Directeur des Ventes",
    imageSrc: null,
    name: "Aroun Zerbo",
    description:
      "Responsable du développement commercial et de la satisfaction de nos partenaires.",
  },
];

type refProp = {
  refProp: React.RefObject<HTMLDivElement>;
};

export const Testimonials: React.FC<refProp> = ({ refProp }) => {
  return (
    <section ref={refProp} className="bg-white py-24">
      <div className="container">
        <div className="section-heading">
          <div className="flex justify-center">
            <div className="tag border-[#FF6B35] text-black">Notre Équipe</div>
          </div>
          <h2 className="section-title mt-5">
            Des Burkinabè au service du Burkina
          </h2>
          <p className="section-description mt-5">
            Une équipe 100% locale, unie par la passion, la simplicité et le
            courage de bâtir des solutions durables.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-16">
          {team.map(({ role, imageSrc, name, description }, index) => (
            <div
              key={index}
              className="card bg-white hover:shadow-xl transition-all border-neutral-100 p-8 flex flex-col items-center text-center"
            >
              <div className="relative mb-6">
                <div className="w-32 h-32 rounded-full overflow-hidden border-4 border-[#FF6B35]/20 flex items-center justify-center bg-neutral-100">
                  {imageSrc ? (
                    <Image
                      src={imageSrc}
                      alt={name}
                      width={128}
                      height={128}
                      className="object-cover h-full w-full"
                    />
                  ) : (
                    <User className="h-16 w-16 text-neutral-400" />
                  )}
                </div>
                <div className="absolute -bottom-2 -right-2 bg-[#FF6B35] text-white text-xs font-bold px-3 py-1 rounded-full">
                  Kazedra
                </div>
              </div>
              <h3 className="text-2xl font-bold text-black">{name}</h3>
              <p className="text-[#FF6B35] font-semibold mb-4 uppercase tracking-wider text-sm">
                {role}
              </p>
              <p className="text-black/60 leading-relaxed italic">
                &quot;{description}&quot;
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
