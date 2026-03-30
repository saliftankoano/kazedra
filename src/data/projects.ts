export type Project = {
  title: string;
  href: string;
  dates: string;
  category: string;
  description: string;
  technologies: string[];
  image: string;
};

export const CATEGORIES = [
  "Tout",
  "Sites Web",
  "Produits & Startups",
  "IA & Données",
  "Email & Marketing",
] as const;

export const projects: Project[] = [
  {
    title: "Golden Bond Events",
    href: "https://goldenbond.vercel.app/",
    dates: "Juin 2025",
    category: "Sites Web",
    description:
      "Site vitrine pour une agence événementielle : présentation des forfaits, galerie photos et formulaire de contact pour capter des prospects.",
    technologies: ["Next.js", "TypeScript", "TailwindCSS"],
    image: "/projects/golden-bond-events.gif",
  },
  {
    title: "Golden Bond Shopify",
    href: "https://goldenbondjewelry.com/",
    dates: "Août 2025",
    category: "Sites Web",
    description:
      "Boutique e-commerce Shopify pour une bijouterie avec personnalisation complète du thème et intégration des paiements en ligne.",
    technologies: ["Shopify", "Liquid", "JavaScript"],
    image: "/projects/gb-shopify.gif",
  },
  {
    title: "Glen Studio",
    href: "https://glen-studio.com/",
    dates: "Janvier 2025",
    category: "Sites Web",
    description:
      "Site WordPress pour un studio de photographie avec galeries de portfolios et système de réservation en ligne.",
    technologies: ["WordPress", "PHP", "SEO"],
    image: "/projects/glen-studio.gif",
  },
  {
    title: "Davoli & Associates",
    href: "https://law-wine-two.vercel.app/",
    dates: "Avril 2025",
    category: "Sites Web",
    description:
      "Site pour un cabinet d'avocats spécialisé en préjudice corporel : présentation des domaines de pratique, témoignages clients et prise de rendez-vous.",
    technologies: ["Next.js", "TypeScript", "TailwindCSS"],
    image: "/projects/law.gif",
  },
  {
    title: "Agora's Little Gems",
    href: "https://daycare-nine.vercel.app/",
    dates: "Mai 2025",
    category: "Sites Web",
    description:
      "Site bilingue pour une crèche : présentation des programmes, FAQ et formulaire de capture de leads pour améliorer les conversions.",
    technologies: ["Next.js", "TypeScript", "TailwindCSS"],
    image: "/projects/childcare.gif",
  },
  {
    title: "Honestus",
    href: "https://www.honestus.world/",
    dates: "Avril 2025",
    category: "Sites Web",
    description:
      "Refonte d'une plateforme de storytelling pour un blogueur : interface moderne pour partager des histoires via interviews, ateliers et kits narratifs.",
    technologies: ["Next.js", "Payload CMS", "TypeScript", "TailwindCSS"],
    image: "/projects/honestus.png",
  },
  {
    title: "Aplus Prep",
    href: "https://aplus-prep.com/",
    dates: "Août 2025",
    category: "Produits & Startups",
    description:
      "Landing page produit pour une application de préparation aux examens, conçue pour collecter les premiers utilisateurs.",
    technologies: ["Next.js", "TypeScript", "TailwindCSS"],
    image: "/projects/aplus-prep.gif",
  },
  {
    title: "AnimeGen",
    href: "https://www.animegen.io/",
    dates: "Mars 2025",
    category: "Produits & Startups",
    description:
      "Générateur d'images IA lancé sur ProductHunt (27e rang), avec 200+ images générées la première semaine et paiements intégrés via Polar.",
    technologies: [
      "Stable Diffusion",
      "TypeScript",
      "Polar.sh",
      "IA/ML",
    ],
    image: "/projects/animegen.png",
  },
  {
    title: "Hive Reports",
    href: "https://hivereports.com/",
    dates: "Octobre 2024",
    category: "Produits & Startups",
    description:
      "Éditeur de rapports par glisser-déposer avec export PDF, permettant de générer des rapports 3x plus vite que les méthodes traditionnelles.",
    technologies: [
      "Next.js",
      "React DnD",
      "TypeScript",
      "TailwindCSS",
    ],
    image: "/projects/hivereports.gif",
  },
  {
    title: "Alex — Assistante IA Vocale",
    href: "https://github.com/saliftankoano/aven",
    dates: "Juillet 2025",
    category: "IA & Données",
    description:
      "Agent vocal IA pour la fintech Aven gérant les demandes de carte de crédit et la prise de rendez-vous, avec RAG et base vectorielle Pinecone.",
    technologies: [
      "VAPI",
      "Pinecone",
      "RAG",
      "TypeScript",
    ],
    image: "/projects/aven.gif",
  },
  {
    title: "Genos Bank : Prédiction du Churn",
    href: "https://churn-render.onrender.com/",
    dates: "Novembre 2024",
    category: "IA & Données",
    description:
      "Plateforme de machine learning pour prédire l'attrition des clients bancaires et proposer des stratégies de rétention personnalisées.",
    technologies: ["Python", "Scikit-learn", "Streamlit", "Machine Learning"],
    image: "/projects/churn.png",
  },
  {
    title: "ESG for Good",
    href: "https://www.esgforgood.com/",
    dates: "Février 2025",
    category: "IA & Données",
    description:
      "Plateforme d'information sur les énergies renouvelables à New York, destinée aux fondateurs et investisseurs.",
    technologies: ["Next.js", "TypeScript", "TailwindCSS"],
    image: "/projects/esg-for-good.gif",
  },
  {
    title: "Email Promotionnel — Crunchyroll",
    href: "https://saliftankoano.github.io/crunchyroll/",
    dates: "Décembre 2024",
    category: "Email & Marketing",
    description:
      "Email promotionnel responsive conçu avec HTML sémantique et styles inline pour une délivrabilité optimale.",
    technologies: ["HTML", "CSS", "Email"],
    image: "/projects/crunchyroll-email.png",
  },
  {
    title: "Email de Confirmation — Canva",
    href: "https://saliftankoano.github.io/canva-order/",
    dates: "Septembre 2024",
    category: "Email & Marketing",
    description:
      "Template d'email transactionnel optimisé pour la clarté, l'accessibilité et la lecture mobile.",
    technologies: ["HTML", "CSS", "Email"],
    image: "/projects/canva-email.png",
  },
  {
    title: "Newsletter — Alice",
    href: "https://saliftankoano.github.io/alice/",
    dates: "Octobre 2024",
    category: "Email & Marketing",
    description:
      "Mise en page de newsletter axée sur la hiérarchie typographique, le rythme visuel et l'ergonomie des liens.",
    technologies: ["HTML", "CSS", "Email"],
    image: "/projects/alice-email.png",
  },
];
