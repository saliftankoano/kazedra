"use client";
import pyramid from "@/assets/pyramid.png";
import tube from "@/assets/tube.png";
import { motion, useScroll, useTransform } from "framer-motion";
import { useRef } from "react";
import { DeviceMobile, Laptop, ChartBar } from "@phosphor-icons/react";

type refProp = {
  refProp: React.RefObject<HTMLDivElement>;
};

const services = [
  {
    icon: <DeviceMobile size={40} className="text-[#FF6B35]" />,
    title: "Développement d'Applications",
    description:
      "Conception et réalisation d'applications mobiles performantes sur iOS et Android pour toucher vos utilisateurs partout.",
  },
  {
    icon: <Laptop size={40} className="text-[#FF6B35]" />,
    title: "Solutions Logiciels B2B",
    description:
      "Des outils sur mesure pour optimiser les processus internes de votre entreprise et booster votre productivité.",
  },
  {
    icon: <ChartBar size={40} className="text-[#FF6B35]" />,
    title: "Conseil & Stratégie",
    description:
      "Accompagnement technique pour définir votre feuille de route numérique et choisir les meilleures technologies.",
  },
];

export const Why: React.FC<refProp> = ({ refProp }) => {
  const sectionRef = useRef(null);
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start end", "end start"],
  });

  const translateY = useTransform(scrollYProgress, [0, 1], [150, -150]);
  return (
    <section
      ref={refProp}
      className="bg-gradient-to-b from-[#fff] to-[#D2DCFF] py-24 overflow-x-clip"
    >
      <div ref={sectionRef} className="container">
        <div className="section-heading">
          <div className="flex justify-center">
            <div className="tag border-[#FF6B35] text-black">Nos Services</div>
          </div>
          <h2 className="section-title mt-5">
            Des solutions technologiques sur mesure
          </h2>
          <p className="section-description mt-5">
            Nous transformons vos idées en produits numériques concrets et
            impactants pour le marché burkinabè.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-16 relative">
          {services.map((service, index) => (
            <div
              key={index}
              className="card bg-white/50 backdrop-blur-sm border-white/20 hover:shadow-xl transition-shadow flex flex-col items-center text-center"
            >
              <div className="mb-6">{service.icon}</div>
              <h3 className="text-xl font-bold mb-4">{service.title}</h3>
              <p className="text-black/70">{service.description}</p>
            </div>
          ))}

          <motion.img
            className="absolute -right-36 -top-32 hidden md:block"
            height={262}
            width={262}
            src={pyramid.src}
            alt="Pyramid image"
            style={{ translateY }}
          />
          <motion.img
            className="absolute bottom-24 -left-36 hidden md:block"
            height={248}
            width={248}
            src={tube.src}
            alt="Tube image"
            style={{ translateY }}
          />
        </div>
      </div>
    </section>
  );
};
