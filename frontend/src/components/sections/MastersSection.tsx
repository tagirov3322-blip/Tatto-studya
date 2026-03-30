"use client";

import React, { useState, useEffect } from "react";
import { GlowBorder } from "@/components/ui/glow-border";
import { ScrollReveal } from "@/components/animations/ScrollReveal";
import { TextReveal } from "@/components/animations/TextReveal";
import { getArtists } from "@/lib/api";

// Fallback если API недоступен
const fallbackMasters = [
  { name: "Ника Вэй", styles: ["Реализм", "нео-традишнл"], bio: "Тату-мастер · 5 лет", photoUrl: "/mastera/1.jpg" },
  { name: "Максим Сергеев", styles: ["Графика", "дотворк"], bio: "Тату-мастер · 7 лет", photoUrl: "/mastera/2.jpg" },
  { name: "Регина Менина", styles: ["Блэкворк", "геометрия"], bio: "Тату-мастер · 9 лет", photoUrl: "/mastera/3.jpg" },
  { name: "Алина Мори", styles: ["Леттеринг", "минимализм"], bio: "Пирсинг-мастер · 5 лет", photoUrl: "/mastera/4.jpg" },
];

export function MastersSection() {
  const [masters, setMasters] = useState<any[]>(fallbackMasters);

  useEffect(() => {
    getArtists()
      .then((data) => {
        if (data && data.length > 0) setMasters(data);
      })
      .catch(() => {});
  }, []);

  return (
    <section id="masters" className="relative bg-black py-24 px-4 overflow-hidden border-y border-green-500/30">
      <div className="max-w-6xl mx-auto relative z-10">
        <div className="text-center mb-14">
          <ScrollReveal><span className="text-green-400 text-sm uppercase tracking-widest font-medium">Команда</span></ScrollReveal>
          <TextReveal className="mt-3"><h2 className="text-4xl md:text-5xl font-bold text-white tracking-tight">Мастера</h2></TextReveal>
          <ScrollReveal delay={0.2}><p className="text-neutral-400 mt-4 max-w-2xl mx-auto text-base">Каждый специализируется на своём направлении. Подберём мастера под ваш стиль.</p></ScrollReveal>
        </div>

          <div className={`grid grid-cols-1 sm:grid-cols-2 gap-4 ${masters.length >= 4 ? "lg:grid-cols-4" : masters.length === 3 ? "lg:grid-cols-3" : "lg:grid-cols-2 max-w-3xl mx-auto"}`}>
            {masters.map((master, i) => (
              <ScrollReveal key={master.id || master.name} delay={i * 0.12}>
                <GlowBorder className="h-full" hoverScale={1.05}>
                  <div className="p-4 flex flex-col h-full group">
                    <div className="w-full aspect-[3/4] overflow-hidden rounded-xl mb-4 bg-neutral-900">
                      {master.photoUrl ? (
                        <img src={master.photoUrl} alt={master.name} className="w-full h-full object-cover object-top group-hover:scale-110 transition-transform duration-700 ease-[cubic-bezier(0.22,1,0.36,1)]" />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-neutral-600 text-4xl font-bold">
                          {master.name?.charAt(0)}
                        </div>
                      )}
                    </div>
                    <h3 className="text-white font-bold text-lg">{master.name}</h3>
                    <p className="text-green-400 text-sm mt-1">{master.styles?.join(", ") || ""}</p>
                    <p className="text-neutral-500 text-xs mt-1">{master.bio || ""}</p>
                    <a
                      href={`#booking`}
                      onClick={() => {
                        if (master.id) window.dispatchEvent(new CustomEvent("select-artist", { detail: master.id }));
                      }}
                      className="mt-4 w-full py-2.5 rounded-full border border-green-500/30 text-green-400 text-sm hover:bg-green-600 hover:text-white hover:border-green-600 hover:shadow-[0_0_20px_rgba(34,197,94,0.3)] transition-all duration-300 text-center block"
                    >Записаться</a>
                  </div>
                </GlowBorder>
              </ScrollReveal>
            ))}
          </div>
      </div>
    </section>
  );
}
