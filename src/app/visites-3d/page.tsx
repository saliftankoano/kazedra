import type { Metadata } from "next";
import { Header } from "@/sections/Header";
import { Footer } from "@/sections/Footer";
import { VisitesHero } from "@/sections/VisitesHero";
import { VisitesBenefits } from "@/sections/VisitesBenefits";
import { VisitesProcess } from "@/sections/VisitesProcess";
import { VisitesPricing } from "@/sections/VisitesPricing";
import { VisitesBooking } from "@/sections/VisitesBooking";
import { VisitesFAQ } from "@/sections/VisitesFAQ";
import { ContactFallback } from "@/components/visites/ContactFallback";

export const metadata: Metadata = {
  title: "Visites virtuelles 3D à Ouagadougou | Kazedra",
  description:
    "Faites scanner vos biens en 3D et partagez une visite immersive à vos clients. Service Kazedra à Ouagadougou — à partir de 30 000 FCFA. Réservez votre créneau en ligne.",
  keywords: [
    "visite 3D Burkina Faso",
    "visite virtuelle Ouagadougou",
    "scan 3D immobilier",
    "Kuula Burkina",
    "Kazedra visite 3D",
    "Roogo visite virtuelle",
  ],
  openGraph: {
    type: "website",
    url: "https://www.kazedra.com/visites-3d",
    title: "Visites virtuelles 3D à Ouagadougou | Kazedra",
    description:
      "Offrez à vos clients une visite immersive 24h/24. Scan sur site, lien partageable, à partir de 30 000 FCFA.",
    images: [
      {
        url: "https://www.kazedra.com/images/og-image.jpg",
        alt: "Kazedra — Visites 3D",
      },
    ],
  },
  alternates: {
    canonical: "https://www.kazedra.com/visites-3d",
  },
};

export default function Visites3DPage() {
  return (
    <>
      <Header transparent />
      <main>
        <VisitesHero />
        <VisitesBenefits />
        <VisitesProcess />
        <VisitesPricing />
        <ContactFallback />
        <VisitesBooking />
        <VisitesFAQ />
      </main>
      <Footer />
    </>
  );
}
