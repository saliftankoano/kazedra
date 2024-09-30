"use client";
import Image from "next/image";
import productImage from "@/assets/outfit2.png";
import pyramid from "@/assets/pyramid.png";
import tube from "@/assets/tube.png";
import { motion, useScroll, useTransform } from "framer-motion";
import { useRef } from "react";
type refProp = {
  refProp: React.RefObject<HTMLDivElement>;
};
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
            <div className="tag border-[#5D3FD3] text-black">
              Making your life easier
            </div>
          </div>
          <h2 className="section-title mt-5">
            Why should you struggle to dress up?
          </h2>
          <p className="section-description mt-5">
            Plan outfits and get dressed faster to avoid adding unecessary
            stress to your day.
          </p>
        </div>
        <div className="relative">
          <Image
            className="mt-10 mx-auto"
            width={500}
            height={600}
            src={productImage}
            alt="product image"
          />
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
