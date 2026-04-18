import Logo from "@/assets/K-simple.png";
import Image from "next/image";
import Link from "next/link";
import { cn } from "@/lib/utils";

type HeaderProp = {
  onJoin?: () => void;
  onWhy?: () => void;
  onPricing?: () => void;
  onTestimonials?: () => void;
  transparent?: boolean;
};
export const Header: React.FC<HeaderProp> = ({
  onJoin,
  onWhy,
  onPricing,
  onTestimonials,
  transparent = false,
}) => {
  const navLinkClass = transparent
    ? "hover:cursor-pointer text-white/80 hover:text-white transition-colors [text-shadow:0_1px_2px_rgba(0,0,0,0.3)]"
    : "hover:cursor-pointer hover:text-black transition-colors";

  const contactBtnClass = transparent
    ? "bg-white/15 backdrop-blur-md border border-white/25 text-white px-4 py-2 rounded-lg font-medium inline-flex items-center tracking-tight hover:bg-white/25 transition-colors"
    : "bg-black text-white px-4 py-2 rounded-lg font-medium inline-flex items-center tracking-tight hover:bg-black/80 transition-colors";

  return (
    <header
      className={cn(
        "top-0 z-30",
        transparent ? "absolute inset-x-0" : "sticky backdrop-blur-sm"
      )}
    >
      {!transparent && (
        <div className="flex justify-center items-center py-3 bg-black text-white text-sm gap-3">
          <p className="text-white/60 hidden md:block">
            Passion, Simplicité, Courage
          </p>
          <div className="inline-flex gap-1 items-center">
            {onJoin ? (
              <p onClick={onJoin} className="hover:cursor-pointer">
                Contactez-nous &rarr;
              </p>
            ) : (
              <Link href="/#contact" className="hover:cursor-pointer">
                Contactez-nous &rarr;
              </Link>
            )}
          </div>
        </div>
      )}
      <div className={cn("relative py-5", transparent && "pt-6")}>
        {transparent && (
          <div className="pointer-events-none absolute inset-x-0 top-0 h-32 bg-gradient-to-b from-black/35 to-transparent" />
        )}
        <div className="container relative">
          <div className="flex items-center justify-between">
            <Link href="/" className={transparent ? "drop-shadow-md" : ""}>
              <Image
                src={Logo}
                alt="Kazedra logo"
                height={60}
                width={60}
                className="h-14 w-14"
              />
            </Link>
            <nav
              className={cn(
                "hidden md:flex gap-6 items-center",
                transparent ? "" : "text-black/60"
              )}
            >
              {onWhy ? (
                <>
                  <a
                    className={navLinkClass}
                    onClick={() =>
                      window.scrollTo({ top: 0, behavior: "smooth" })
                    }
                  >
                    Accueil
                  </a>
                  <a className={navLinkClass} onClick={onWhy}>
                    Services
                  </a>
                  <a className={navLinkClass} onClick={onPricing}>
                    Roogo
                  </a>
                  <a className={navLinkClass} onClick={onTestimonials}>
                    Équipe
                  </a>
                </>
              ) : (
                <>
                  <Link href="/" className={navLinkClass}>
                    Accueil
                  </Link>
                  <Link href="/#why" className={navLinkClass}>
                    Services
                  </Link>
                  <Link href="/#pricing" className={navLinkClass}>
                    Roogo
                  </Link>
                  <Link href="/#team" className={navLinkClass}>
                    Équipe
                  </Link>
                </>
              )}
              <Link href="/visites-3d" className={navLinkClass}>
                Visites 3D
              </Link>
              <Link href="/realisations" className={navLinkClass}>
                Réalisations
              </Link>
            </nav>
            {onJoin ? (
              <button onClick={onJoin} className={contactBtnClass}>
                Contact
              </button>
            ) : (
              <Link href="/#contact" className={contactBtnClass}>
                Contact
              </Link>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};
