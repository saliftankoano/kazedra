"use client";
import ArrowIcon from "@/assets/arrow-right.svg";
import Cog from "@/assets/cog.png";
import Image from "next/image";
import Cylinder from "@/assets/cylinder.png";

import Noodle from "@/assets/noodle.png";
import { motion, useScroll, useTransform } from "framer-motion";
import { useRef } from "react";

type HeroProp = {
  onJoin: () => void;
};
export const Hero: React.FC<HeroProp> = ({ onJoin }) => {
  const heroRef = useRef(null);
  const { scrollYProgress } = useScroll({
    target: heroRef,
    offset: ["start end", "end start"],
  });
  const translateY = useTransform(scrollYProgress, [0, 1], [150, -150]);

  return (
    <section
      ref={heroRef}
      className="-mt-[7%] pb-20 md:pt-5 md:pb-10 bg-no-repeat bg-center bg-cover bg-[url('../assets/hero.jpg')] overflow-x-clip"
    >
      <div className="container">
        <div className="md:flex items-center">
          <div className="md:w-[478px]">
            <div className="tag text-white border-black">Version 1.0</div>
            <h1 className="text-5xl md:text-7xl font-bold tracking-tighter text-white/85 bg-clip-text mt-6">
              Effortless Outfit choices are here
            </h1>

            <div className="flex gap-1 items-center mt-[30px]">
              <button onClick={onJoin} className="btn-primary">
                Join the waitlist
              </button>
              <button className="btn btn-text gap-1">
                <a
                  href="https://forms.gle/g16MaKmKtFJGJJjA7" // Replace with actual social media URL
                  target="_blank"
                  rel="noopener noreferrer"
                  className=" hover:cursor-pointer inline-flex items-center gap-1"
                >
                  <span className="text-white">Survey</span>
                  <ArrowIcon className=" h-5 w-5" />
                </a>
              </button>
            </div>
          </div>
          <div className="mt-20 md:mt-0 md:h-[648px] md:flex-1 relative"></div>
        </div>
      </div>
    </section>
  );
};
