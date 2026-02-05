import Logo from "@/assets/Kazedra-transparent-blanc.png";
import SocialX from "@/assets/social-x.svg";
import SocialInsta from "@/assets/social-insta.svg";
import SocialLinkedin from "@/assets/social-linkedin.svg";
import SocialYoutube from "@/assets/social-youtube.svg";
import { Linkedin, Facebook, Instagram, Youtube } from "lucide-react";

import Image from "next/image";
type HeaderProp = {
  onJoin: () => void;
  onWhy: () => void;
  onPricing: () => void;
  onTestimonials: () => void;
};
export const Footer: React.FC<HeaderProp> = ({
  onJoin,
  onWhy,
  onPricing,
  onTestimonials,
}) => {
  return (
    <footer className="bg-black text-[#BCBCBC] text-sm py-10 text-center">
      <div className="container">
        <div className="inline-flex relative">
          <Image
            src={Logo}
            alt="Kazedra logo"
            height={160}
            width={160}
            className="relative h-40 w-40"
          />
        </div>
        <nav className="flex flex-col md:flex-row md:justify-center gap-6 mt-6">
          <a
            className="hover:cursor-pointer"
            onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
          >
            Accueil
          </a>
          <a className="hover:cursor-pointer" onClick={onWhy}>
            Services
          </a>
          <a className="hover:cursor-pointer" onClick={onPricing}>
            Roogo
          </a>
          <a className="hover:cursor-pointer" onClick={onTestimonials}>
            Équipe
          </a>
          <a className="hover:cursor-pointer" onClick={onJoin}>
            Contact
          </a>
        </nav>
        <div className="socials flex justify-center gap-6 mt-6">
          <a
            href="https://www.linkedin.com/company/kazedra/"
            target="_blank"
            rel="noopener noreferrer"
            className="hover:scale-125 hover:cursor-pointer text-white/60 hover:text-white transition-colors"
          >
            <Linkedin className="h-6 w-6" />
          </a>
          <a
            href="https://www.facebook.com"
            target="_blank"
            rel="noopener noreferrer"
            className="hover:scale-125 hover:cursor-pointer text-white/60 hover:text-white transition-colors"
          >
            <Facebook className="h-6 w-6" />
          </a>
          <a
            href="https://www.instagram.com"
            target="_blank"
            rel="noopener noreferrer"
            className="hover:scale-125 hover:cursor-pointer text-white/60 hover:text-white transition-colors"
          >
            <Instagram className="h-6 w-6" />
          </a>
          <a
            href="https://www.youtube.com"
            target="_blank"
            rel="noopener noreferrer"
            className="hover:scale-125 hover:cursor-pointer text-white/60 hover:text-white transition-colors"
          >
            <Youtube className="h-6 w-6" />
          </a>
        </div>
        <p className="mt-6">
          &copy; 2024-2026 Kazedra Technologies SARL. Tous droits réservés.
        </p>
        <p className="mt-2 text-white/40 italic">
          Passion, Simplicité, Courage
        </p>
      </div>
    </footer>
  );
};
