import Logo from "@/assets/K-simple.png";
import Image from "next/image";
import Link from "next/link";

type HeaderProp = {
  onJoin?: () => void;
  onWhy?: () => void;
  onPricing?: () => void;
  onTestimonials?: () => void;
};
export const Header: React.FC<HeaderProp> = ({
  onJoin,
  onWhy,
  onPricing,
  onTestimonials,
}) => {
  return (
    <header className="sticky top-0 backdrop-blur-sm z-20">
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
      <div className="py-5">
        <div className="container">
          <div className="flex items-center justify-between">
            <Link href="/">
              <Image
                src={Logo}
                alt="Kazedra logo"
                height={60}
                width={60}
                className="h-14 w-14"
              />
            </Link>
            <nav className="hidden md:flex gap-6 text-black/60 items-center">
              {onWhy ? (
                <>
                  <a
                    className="hover:cursor-pointer hover:text-black transition-colors"
                    onClick={() =>
                      window.scrollTo({ top: 0, behavior: "smooth" })
                    }
                  >
                    Accueil
                  </a>
                  <a
                    className="hover:cursor-pointer hover:text-black transition-colors"
                    onClick={onWhy}
                  >
                    Services
                  </a>
                  <a
                    className="hover:cursor-pointer hover:text-black transition-colors"
                    onClick={onPricing}
                  >
                    Roogo
                  </a>
                  <a
                    className="hover:cursor-pointer hover:text-black transition-colors"
                    onClick={onTestimonials}
                  >
                    Équipe
                  </a>
                </>
              ) : (
                <>
                  <Link
                    href="/"
                    className="hover:text-black transition-colors"
                  >
                    Accueil
                  </Link>
                  <Link
                    href="/#why"
                    className="hover:text-black transition-colors"
                  >
                    Services
                  </Link>
                  <Link
                    href="/#pricing"
                    className="hover:text-black transition-colors"
                  >
                    Roogo
                  </Link>
                  <Link
                    href="/#team"
                    className="hover:text-black transition-colors"
                  >
                    Équipe
                  </Link>
                </>
              )}
              <Link
                href="/realisations"
                className="hover:text-black transition-colors"
              >
                Réalisations
              </Link>
            </nav>
            {onJoin ? (
              <button
                onClick={onJoin}
                className="bg-black text-white px-4 py-2 rounded-lg font-medium inline-flex items-center tracking-tight hover:bg-black/80 transition-colors"
              >
                Contact
              </button>
            ) : (
              <Link
                href="/#contact"
                className="bg-black text-white px-4 py-2 rounded-lg font-medium inline-flex items-center tracking-tight hover:bg-black/80 transition-colors"
              >
                Contact
              </Link>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};
