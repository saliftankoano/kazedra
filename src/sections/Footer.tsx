import Logo from "@/assets/Kazedra-transparent-blanc.png";
import { Linkedin, Facebook, Instagram, Youtube } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

type FooterProp = {
  onJoin?: () => void;
  onWhy?: () => void;
  onPricing?: () => void;
  onTestimonials?: () => void;
};
export const Footer: React.FC<FooterProp> = ({
  onJoin,
  onWhy,
  onPricing,
  onTestimonials,
}) => {
  return (
    <footer className="bg-black text-[#BCBCBC] text-sm py-10 text-center">
      <div className="container">
        <div className="inline-flex relative">
          <Link href="/">
            <Image
              src={Logo}
              alt="Kazedra logo"
              height={160}
              width={160}
              className="relative h-40 w-40"
            />
          </Link>
        </div>
        <nav className="flex flex-col md:flex-row md:justify-center gap-6 mt-6">
          {onWhy ? (
            <>
              <a
                className="hover:cursor-pointer hover:text-white transition-colors"
                onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
              >
                Accueil
              </a>
              <a className="hover:cursor-pointer hover:text-white transition-colors" onClick={onWhy}>
                Services
              </a>
              <a className="hover:cursor-pointer hover:text-white transition-colors" onClick={onPricing}>
                Roogo
              </a>
              <a className="hover:cursor-pointer hover:text-white transition-colors" onClick={onTestimonials}>
                Équipe
              </a>
              <a className="hover:cursor-pointer hover:text-white transition-colors" onClick={onJoin}>
                Contact
              </a>
            </>
          ) : (
            <>
              <Link href="/" className="hover:text-white transition-colors">Accueil</Link>
              <Link href="/#why" className="hover:text-white transition-colors">Services</Link>
              <Link href="/#pricing" className="hover:text-white transition-colors">Roogo</Link>
              <Link href="/#team" className="hover:text-white transition-colors">Équipe</Link>
              <Link href="/#contact" className="hover:text-white transition-colors">Contact</Link>
            </>
          )}
          <Link href="/visites-3d" className="hover:text-white transition-colors">
            Visites 3D
          </Link>
          <Link href="/realisations" className="hover:text-white transition-colors">
            Réalisations
          </Link>
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
