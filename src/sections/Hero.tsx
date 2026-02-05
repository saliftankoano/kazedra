"use client";
import ArrowIcon from "@/assets/arrow-right.svg";
import Cog from "@/assets/cog.png";
import Image from "next/image";
import Cylinder from "@/assets/cylinder.png";

import Noodle from "@/assets/noodle.png";
import { motion, useScroll, useTransform } from "framer-motion";
import { useRef, useState, useEffect } from "react";

type HeroProp = {
  onJoin: () => void;
};
export const Hero: React.FC<HeroProp> = ({ onJoin }) => {
  const [isMounted, setIsMounted] = useState(false);
  useEffect(() => {
    setIsMounted(true);
  }, []);
  const heroRef = useRef(null);
  const { scrollYProgress } = useScroll({
    target: heroRef,
    offset: ["start end", "end start"],
  });
  const translateY = useTransform(scrollYProgress, [0, 1], [150, -150]);

  return (
    <section
      ref={heroRef}
      className="pt-24 pb-16 md:pt-32 md:pb-24 bg-white overflow-x-clip"
    >
      <div className="container">
        <div className="md:flex items-center">
          <div className="md:w-[500px]">
            <div className="tag text-black border-black/10">
              Entreprise 100% Burkinabè
            </div>
            <h1 className="text-4xl md:text-6xl font-bold tracking-tighter text-black mt-6">
              Construire l&apos;avenir numérique du Burkina Faso
            </h1>
            <p className="text-lg text-[#010D3E] tracking-tight mt-6">
              Kazedra Technologies crée des solutions logicielles innovantes
              pour améliorer la vie quotidienne des Burkinabè. Passion,
              Simplicité et Courage guident chacune de nos créations.
            </p>
            <div className="flex gap-1 items-center mt-[30px]">
              <button onClick={onJoin} className="btn-primary">
                Nous contacter
              </button>
              <button className="btn btn-text gap-1">
                <span>En savoir plus</span>
                <span>&rarr;</span>
              </button>
            </div>
          </div>
          <div className="mt-20 md:mt-0 md:h-[500px] md:flex-1 relative">
            <motion.img
              src={Cog.src}
              alt="Cog image"
              className="md:absolute md:h-full md:w-auto md:max-w-none md:-left-6 lg:left-0"
              animate={{
                translateY: [-30, 30],
              }}
              transition={{
                repeat: Infinity,
                repeatType: "mirror",
                duration: 3,
                ease: "easeInOut",
              }}
            />
            <motion.img
              src={Cylinder.src}
              width={220}
              height={220}
              alt="Cylinder image"
              className="hidden md:block -top-8 -left-8 absolute"
              style={{
                translateY: isMounted ? translateY : 0,
              }}
            />
            <motion.img
              src={Noodle.src}
              width={220}
              alt="Noodle image"
              className="hidden lg:block absolute top-[380px] left-[448px] rotate-[30deg]"
              style={{
                rotate: 30,
                translateY: isMounted ? translateY : 0,
              }}
            />
          </div>
        </div>
      </div>
    </section>
  );
};
