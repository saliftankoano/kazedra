import type { Metadata } from "next";
import { DM_Sans } from "next/font/google";
import "./globals.css";
import clsx from "clsx";
import { Analytics } from "@vercel/analytics/react";

const dmSans = DM_Sans({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Kazedra Technologies | Solutions Logicielles au Burkina Faso",
  description:
    "Kazedra Technologies crée des solutions logicielles innovantes pour améliorer la vie quotidienne des Burkinabè. Découvrez nos services de développement d'applications et notre produit phare Roogo Burkina.",
  keywords: [
    "Kazedra Technologies",
    "développement logiciel Burkina Faso",
    "applications mobiles Ouagadougou",
    "Roogo Burkina",
    "immobilier Burkina Faso",
    "solutions B2B",
  ],
  openGraph: {
    type: "website",
    url: "https://www.kazedra.com/",
    title: "Kazedra Technologies | Solutions Logicielles au Burkina Faso",
    description:
      "Kazedra Technologies crée des solutions logicielles innovantes pour améliorer la vie quotidienne des Burkinabè.",
    images: [
      {
        url: "https://www.kazedra.com/images/og-image.jpg",
        alt: "Kazedra Technologies",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Kazedra Technologies | Solutions Logicielles au Burkina Faso",
    description:
      "Kazedra Technologies crée des solutions logicielles innovantes pour améliorer la vie quotidienne des Burkinabè.",
    images: [
      {
        url: "https://www.kazedra.com/images/og-image.jpg",
        alt: "Kazedra Technologies",
      },
    ],
  },
  icons: {
    icon: "./K-simple.png",
  },
  robots: {
    index: true,
    follow: true,
  },
  alternates: {
    canonical: "https://www.kazedra.com/",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="fr" className="relative">
      <body className={clsx(dmSans.className, "antialiased bg-[#EAEEFE]")}>
        {children}
        <Analytics />
      </body>
    </html>
  );
}
