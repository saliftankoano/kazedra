"use client";
import Star from "@/assets/star.png";
import Spring from "@/assets/spring.png";
import { motion, useScroll, useTransform } from "framer-motion";
import { FormEvent, useRef, useState, useEffect } from "react";
import { twMerge } from "tailwind-merge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Check, Mail, Phone, MapPin } from "lucide-react";

type refProp = {
  refProp: React.RefObject<HTMLDivElement>;
};

export const Waitlist: React.FC<refProp> = ({ refProp }) => {
  const [email, setEmail] = useState<string>("");
  const [isSuccessful, setIsSuccessful] = useState<boolean>(false);
  const [error, setError] = useState<string>("");
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  const validateEmail = (email: string): boolean => {
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return regex.test(email);
  };

  const handleSubmit = (e: FormEvent): void => {
    e.preventDefault();
    if (validateEmail(email)) {
      setError("");
      // Placeholder for subscription logic
      setIsSuccessful(true);
    } else {
      setError("Veuillez entrer une adresse email valide");
    }
  };

  const sectionRef = useRef(null);
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start end", "end start"],
  });
  const translateY = useTransform(scrollYProgress, [0, 1], [150, -150]);

  return (
    <section
      ref={refProp}
      className="bg-gradient-to-b from-white to-[#D2DCFF] py-24 overflow-x-clip"
    >
      <div ref={sectionRef} className="container">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <div className="relative">
            <div className="section-heading text-left mx-0 max-w-none">
              <h2 className="section-title text-left">Contactez-nous</h2>
              <p className="section-description text-left mt-5">
                Vous avez un projet ou souhaitez en savoir plus sur nos
                solutions ? Notre équipe est à votre écoute.
              </p>
            </div>

            <div className="mt-10 space-y-6">
              <div className="flex items-center gap-4">
                <div className="bg-[#FF6B35] p-3 rounded-full text-white">
                  <MapPin className="h-6 w-6" />
                </div>
                <div>
                  <p className="font-bold">Siège Social</p>
                  <p className="text-black/70">
                    Ouagadougou, BP 01 BP 6594 OUAGA CNT 10020
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-4">
                <div className="bg-[#FF6B35] p-3 rounded-full text-white">
                  <Phone className="h-6 w-6" />
                </div>
                <div>
                  <p className="font-bold">Téléphone</p>
                  <p className="text-black/70">+226 53 11 11 19 / 67 00 61 16</p>
                </div>
              </div>

              <div className="flex items-center gap-4">
                <div className="bg-[#FF6B35] p-3 rounded-full text-white">
                  <Mail className="h-6 w-6" />
                </div>
                <div>
                  <p className="font-bold">Email</p>
                  <p className="text-black/70">contact@kazedra.com</p>
                </div>
              </div>
            </div>

            <motion.img
              src={Star.src}
              alt="star image"
              width={360}
              className="absolute -left-[350px] -top-[137px] opacity-20"
              style={{ translateY: isMounted ? translateY : 0 }}
            />
          </div>

          <div className="card bg-white p-10 shadow-2xl max-w-none">
            <h3 className="text-2xl font-bold mb-6 text-center">
              Restez informé
            </h3>
            <p className="text-center text-black/60 mb-8">
              Inscrivez-vous à notre newsletter pour suivre l&apos;actualité de
              Kazedra et le lancement de nos nouveaux produits.
            </p>

            {isSuccessful ? (
              <div className="flex flex-col items-center justify-center py-10 space-y-4">
                <div className="bg-green-100 p-4 rounded-full">
                  <Check className="h-10 w-10 text-green-600" />
                </div>
                <p className="text-xl font-bold text-center">
                  Merci, vous êtes inscrit !
                </p>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <Input
                    type="email"
                    placeholder="Votre adresse email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className={twMerge(
                      "h-14 text-lg",
                      error ? "border-red-500" : ""
                    )}
                  />
                  {error && (
                    <p className="text-red-500 mt-2 text-sm">{error}</p>
                  )}
                </div>
                <Button
                  type="submit"
                  className="w-full h-14 text-lg bg-black hover:bg-black/80"
                >
                  S&apos;inscrire à la newsletter
                </Button>
              </form>
            )}
          </div>
        </div>
      </div>
    </section>
  );
};
