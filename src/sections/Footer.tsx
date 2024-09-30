import Logo from "@/assets/kazedra.png";
import SocialX from "@/assets/social-x.svg";
import SocialInsta from "@/assets/social-insta.svg";
import SocialLinkedin from "@/assets/social-linkedin.svg";
import SocialPin from "@/assets/social-pin.svg";
import SocialYoutube from "@/assets/social-youtube.svg";

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
        <div className="inline-flex relative before:content-[''] before:top-2 before:bottom-0 before:blur before:w-full before:bg-[linear-gradient(to_right,#F87BFF,#FB92CF,#FFDD9B,#C2F0B1,#2FD8FE)] before:absolute">
          <Image src={Logo} alt="saas logo" height={40} className="relative" />
        </div>
        <nav className="flex flex-col md:flex-row md:justify-center gap-6 mt-6">
          <a className="hover:cursor-pointer" onClick={onWhy}>
            Why
          </a>
          <a className="hover:cursor-pointer" onClick={onPricing}>
            Pricing
          </a>
          <a className="hover:cursor-pointer" onClick={onTestimonials}>
            Testimonials
          </a>
          <a className="hover:cursor-pointer" onClick={onJoin}>
            Join
          </a>
        </nav>
        <div className="socials flex justify-center gap-6 mt-6">
          <a
            href="https://www.facebook.com"
            target="_blank"
            rel="noopener noreferrer"
            className="hover:scale-125 hover:cursor-pointer"
          >
            <SocialX />
          </a>
          <a
            href="https://www.instagram.com"
            target="_blank"
            rel="noopener noreferrer"
            className="hover:scale-125 hover:cursor-pointer"
          >
            <SocialInsta />
          </a>
          <a
            href="https://www.linkedin.com/company/kazedra/"
            target="_blank"
            rel="noopener noreferrer"
            className="hover:scale-125 hover:cursor-pointer"
          >
            <SocialLinkedin />
          </a>
          <a
            href="https://www.pinterest.com"
            target="_blank"
            rel="noopener noreferrer"
            className="hover:scale-125 hover:cursor-pointer"
          >
            <SocialPin />
          </a>
          <a
            href="https://www.youtube.com"
            target="_blank"
            rel="noopener noreferrer"
            className="hover:scale-125 hover:cursor-pointer"
          >
            <SocialYoutube />
          </a>
        </div>
        <p className="mt-6">&copy; 2024 Kazedra Inc. All rights reserved</p>
      </div>
    </footer>
  );
};
