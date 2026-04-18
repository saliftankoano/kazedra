"use client";
import { Waitlist } from "@/sections/Waitlist";
import { Footer } from "@/sections/Footer";
import { Header } from "@/sections/Header";
import { Hero } from "@/sections/Hero";
import { Pricing } from "@/sections/Pricing";
import { Testimonials } from "@/sections/Testimonials";
import { useRef } from "react";
import { Why } from "@/sections/Why";
import Link from "next/link";

export default function Home() {
  const pricingRef = useRef<HTMLDivElement | null>(null);
  const testimonialsRef = useRef<HTMLDivElement | null>(null);
  const waitlistRef = useRef<HTMLDivElement | null>(null);
  const whyRef = useRef<HTMLDivElement | null>(null);

  const scrollToWaitlist = () => {
    if (waitlistRef.current) {
      waitlistRef.current.scrollIntoView({
        behavior: "smooth",
        block: "center",
      });
    }
  };
  const scrollToWhy = () => {
    if (whyRef.current) {
      whyRef.current.scrollIntoView({
        behavior: "smooth",
        block: "center",
      });
    }
  };
  const scrollToPricing = () => {
    if (pricingRef.current) {
      pricingRef.current.scrollIntoView({
        behavior: "smooth",
        block: "start",
      });
    }
  };
  const scrollToTestimonials = () => {
    if (testimonialsRef.current) {
      testimonialsRef.current.scrollIntoView({
        behavior: "smooth",
        block: "center",
      });
    }
  };
  return (
    <>
      <Header
        onJoin={scrollToWaitlist}
        onWhy={scrollToWhy}
        onPricing={scrollToPricing}
        onTestimonials={scrollToTestimonials}
      />
      <Hero onJoin={scrollToWaitlist} />
      <Why refProp={whyRef} />
      <Pricing refProp={pricingRef} onJoin={scrollToWaitlist} />
      <section className="py-16 bg-[#EAEEFE]">
        <div className="container">
          <div className="relative overflow-hidden rounded-3xl bg-black text-white p-8 md:p-12 flex flex-col md:flex-row items-start md:items-center gap-6 justify-between shadow-2xl">
            <div className="absolute -top-12 -right-12 w-48 h-48 bg-[#FF6B35] rounded-full opacity-30 blur-3xl" />
            <div className="relative max-w-xl">
              <div className="tag bg-[#FF6B35] text-white border-transparent">
                Nouveau
              </div>
              <h3 className="text-2xl md:text-3xl font-bold mt-3">
                Visites virtuelles 3D pour votre bien
              </h3>
              <p className="text-white/70 mt-2">
                Nous scannons sur place, vous recevez un lien de visite immersif à partager à vos clients. À partir de 30 000 FCFA.
              </p>
            </div>
            <Link
              href="/visites-3d"
              className="relative inline-flex items-center gap-2 bg-[#FF6B35] hover:bg-[#FF6B35]/90 text-white px-5 py-3 rounded-xl font-medium transition-colors whitespace-nowrap"
            >
              Découvrir &rarr;
            </Link>
          </div>
        </div>
      </section>
      <Testimonials refProp={testimonialsRef} />
      <Waitlist refProp={waitlistRef} />
      <Footer
        onJoin={scrollToWaitlist}
        onWhy={scrollToWhy}
        onPricing={scrollToPricing}
        onTestimonials={scrollToTestimonials}
      />
    </>
  );
}
