import type { Metadata } from "next";
import { DM_Sans } from "next/font/google";
import "./globals.css";
import clsx from "clsx";
import { Analytics } from "@vercel/analytics/react";

const dmSans = DM_Sans({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Join Our Weather-Based Outfit Recommendation App Waitlist",
  description:
    "Be one of the first to experience personalized weather-based outfit suggestions. Join our waitlist today!",
  keywords: [
    "weather-based outfit app",
    "outfit recommendations",
    "fashion app",
    "personalized style",
    "clothing suggestions",
  ],
  openGraph: {
    type: "website",
    url: "https://www.kazedra.com/",
    title: "Join Our Weather-Based Outfit Recommendation App Waitlist",
    description:
      "Be among the first to try our app that provides personalized outfit suggestions based on the weather. Sign up now!",
    images: [
      {
        url: "https://yourwebsite.com/images/waitlist-banner.jpg",
        alt: "Waitlist banner",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Join Our Weather-Based Outfit Recommendation App Waitlist",
    description:
      "Sign up for our waitlist to get personalized outfit suggestions that match the weather. Don't miss out!",
    images: [
      {
        url: "https://yourwebsite.com/images/waitlist-banner.jpg",
        alt: "Waitlist banner",
      },
    ],
  },
  icons: {
    icon: "./kazedra.png",
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
    <html lang="en" className="relative">
      <body className={clsx(dmSans.className, "antialiased bg-[#EAEEFE]")}>
        {children}
        <Analytics />
      </body>
    </html>
  );
}
