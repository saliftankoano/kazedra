"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { Header } from "@/sections/Header";
import { Footer } from "@/sections/Footer";
import { projects, CATEGORIES } from "@/data/projects";
import type { Project } from "@/data/projects";
import starImage from "@/assets/star.png";

function ProjectCard({ project }: { project: Project }) {
  return (
    <div className="flex flex-col rounded-3xl border border-[#222222]/10 shadow-[0_7px_14px_#EAEAEA] overflow-hidden bg-white">
      <div className="relative aspect-video w-full overflow-hidden">
        <Image
          src={project.image}
          alt={project.title}
          fill
          className="object-cover"
          unoptimized
        />
      </div>
      <div className="flex flex-col flex-1 p-6 gap-3">
        <div className="flex items-start justify-between gap-2">
          <h3 className="font-bold text-lg text-[#010D3E] leading-tight">
            {project.title}
          </h3>
          <span className="text-xs text-black/40 shrink-0 mt-1">
            {project.dates}
          </span>
        </div>
        <p className="text-sm text-[#010D3E]/80 leading-relaxed flex-1">
          {project.description}
        </p>
        <div className="flex flex-wrap gap-2 mt-1">
          {project.technologies.map((tech) => (
            <span
              key={tech}
              className="text-xs border border-[#222222]/20 rounded-full px-2 py-0.5 text-black/60"
            >
              {tech}
            </span>
          ))}
        </div>
        <a
          href={project.href}
          target="_blank"
          rel="noopener noreferrer"
          className="mt-2 inline-flex items-center gap-1 text-sm font-medium bg-black text-white px-4 py-2 rounded-lg hover:bg-black/80 transition-colors w-fit"
        >
          Voir le projet &rarr;
        </a>
      </div>
    </div>
  );
}

export default function RealisationsPage() {
  const [activeCategory, setActiveCategory] = useState<string>("Tout");

  const filtered =
    activeCategory === "Tout"
      ? projects
      : projects.filter((p) => p.category === activeCategory);

  return (
    <div className="bg-[#EAEEFE] min-h-screen">
      <Header />

      {/* Hero */}
      <section className="py-20 overflow-hidden">
        <div className="container">
          <div className="section-heading">
            <div className="flex justify-center">
              <div className="tag">Nos Réalisations</div>
            </div>
            <h1 className="section-title mt-5">
              Ce que nous avons accompli
            </h1>
            <p className="section-description mt-5">
              Des solutions concrètes pour des entreprises qui avancent —
              sites web, applications, IA et bien plus.
            </p>
          </div>
        </div>
      </section>

      {/* Filter + Grid */}
      <section className="pb-24">
        <div className="container">
          {/* Filter tabs */}
          <div className="flex flex-wrap justify-center gap-3 mb-12">
            {CATEGORIES.map((cat) => (
              <button
                key={cat}
                onClick={() => setActiveCategory(cat)}
                className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                  activeCategory === cat
                    ? "bg-black text-white"
                    : "border border-[#222222]/30 text-black/70 hover:border-black hover:text-black"
                }`}
              >
                {cat}
              </button>
            ))}
          </div>

          {/* Cards grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filtered.map((project) => (
              <ProjectCard key={project.title} project={project} />
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-24 bg-black text-white text-center">
        <div className="container">
          <div className="flex justify-center mb-6">
            <Image
              src={starImage}
              alt=""
              width={48}
              height={48}
              className="opacity-60"
            />
          </div>
          <h2 className="text-3xl md:text-[42px] font-bold mb-4 leading-tight">
            Prêt à lancer votre projet&nbsp;?
          </h2>
          <p className="text-white/60 text-lg max-w-[480px] mx-auto mb-8">
            Nous construisons des solutions numériques sur mesure pour les
            entreprises du Burkina Faso et d&apos;Afrique de l&apos;Ouest.
          </p>
          <Link
            href="/#contact"
            className="bg-white text-black px-6 py-3 rounded-lg font-medium hover:bg-white/90 transition-colors inline-flex items-center gap-2"
          >
            Contactez-nous &rarr;
          </Link>
        </div>
      </section>

      <Footer />
    </div>
  );
}
