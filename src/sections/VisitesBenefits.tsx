"use client";

import { motion, useReducedMotion } from "framer-motion";

const benefits = [
  {
    n: "01",
    title: "Moins de visites physiques ratées.",
    body: "Vos clients trient depuis leur canapé. Seuls les vrais intéressés se déplacent — votre équipe ne perd plus ses samedis.",
  },
  {
    n: "02",
    title: "Plus de partages spontanés.",
    body: "Une annonce 3D se remarque dans un fil WhatsApp. Le lien circule tout seul, chez les amis, chez la famille, à l'étranger.",
  },
  {
    n: "03",
    title: (
      <>
        Vendez ou
        <br />
        louez plus vite.
      </>
    ),
    body: "La diaspora visite depuis Paris, Abidjan, Dakar. Pas besoin d'attendre le prochain voyage pour prendre une décision.",
  },
];

export function VisitesBenefits() {
  const reduce = useReducedMotion();

  return (
    <section className="py-24 bg-white overflow-x-clip">
      <div className="container">
        <div className="section-heading">
          <div className="flex justify-center">
            <div className="tag border-[#FF6B35] text-black">
              Pourquoi une visite 3D&nbsp;?
            </div>
          </div>
          <h2 className="section-title mt-5">
            Un avantage concret pour vos ventes
          </h2>
          <p className="section-description mt-5">
            Ce que les agences qui sont passées à la visite 3D gagnent,
            concrètement.
          </p>
        </div>

        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.2 }}
          variants={{
            hidden: {},
            visible: {
              transition: { delayChildren: 0.1, staggerChildren: 0.08 },
            },
          }}
          className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-16"
        >
          {benefits.map(({ n, title, body }) => (
            <motion.div
              key={n}
              variants={{
                hidden: reduce ? { opacity: 0 } : { opacity: 0, y: 24 },
                visible: { opacity: 1, y: 0 },
              }}
              transition={{ duration: 0.3, ease: "easeOut" }}
              className="rounded-3xl border border-black/10 bg-white p-8 md:p-10 shadow-[0_7px_14px_#EAEAEA] hover:shadow-xl hover:-translate-y-1 transition-all"
            >
              <div className="text-6xl md:text-7xl font-black text-[#FF6B35] tracking-tighter leading-none">
                {n}
              </div>
              <h3 className="text-xl md:text-2xl font-bold mt-6 mb-3 tracking-tight leading-tight">
                {title}
              </h3>
              <p className="text-black/65 leading-relaxed">{body}</p>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
