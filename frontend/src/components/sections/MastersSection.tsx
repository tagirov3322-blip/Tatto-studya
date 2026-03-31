"use client";

import React, { useState, useEffect } from "react";
import { ChevronLeftIcon, ChevronRightIcon } from "lucide-react";
import { GlowBorder } from "@/components/ui/glow-border";
import { ScrollReveal } from "@/components/animations/ScrollReveal";
import { TextReveal } from "@/components/animations/TextReveal";
import { getArtists } from "@/lib/api";

const TABS = ["tattoo", "piercing"] as const;
type Tab = (typeof TABS)[number];
const TAB_LABELS: Record<Tab, string> = { tattoo: "Мастера тату", piercing: "Мастера пирсинга" };

export function MastersSection() {
  const [allMasters, setAllMasters] = useState<any[]>([]);
  const [tab, setTab] = useState<Tab>("tattoo");

  useEffect(() => {
    getArtists()
      .then((data) => {
        if (data && data.length > 0) setAllMasters(data);
      })
      .catch(() => {});
  }, []);

  const filtered = allMasters.filter((m) => {
    if (tab === "tattoo") return m.specialty === "tattoo" || m.specialty === "both" || !m.specialty;
    return m.specialty === "piercing" || m.specialty === "both";
  });

  const switchTab = (dir: 1 | -1) => {
    const idx = TABS.indexOf(tab);
    const next = (idx + dir + TABS.length) % TABS.length;
    setTab(TABS[next]);
  };

  return (
    <section id="masters" className="relative bg-black py-24 px-4 overflow-hidden border-y border-green-500/30">
      <div className="max-w-6xl mx-auto relative z-10">
        <div className="text-center mb-14">
          <ScrollReveal><span className="text-green-400 text-sm uppercase tracking-widest font-medium">Команда</span></ScrollReveal>
          <TextReveal className="mt-3"><h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-white tracking-tight">Мастера</h2></TextReveal>
          <ScrollReveal delay={0.2}><p className="text-neutral-400 mt-4 max-w-2xl mx-auto text-base">Каждый специализируется на своём направлении. Подберём мастера под ваш стиль.</p></ScrollReveal>
        </div>

        {/* Tab switcher */}
        <ScrollReveal delay={0.3}>
          <div className="flex items-center justify-center gap-4 mb-10">
            <button
              onClick={() => switchTab(-1)}
              className="p-2 rounded-full border border-green-500/20 text-neutral-400 hover:text-green-400 hover:border-green-500/50 hover:bg-green-500/5 transition-all duration-300"
            >
              <ChevronLeftIcon className="size-5" />
            </button>

            <div className="relative w-52 h-10 flex items-center justify-center overflow-hidden">
              <span
                key={tab}
                className="text-lg font-semibold text-white animate-[fadeSlide_0.3s_ease-out]"
              >
                {TAB_LABELS[tab]}
              </span>
            </div>

            <button
              onClick={() => switchTab(1)}
              className="p-2 rounded-full border border-green-500/20 text-neutral-400 hover:text-green-400 hover:border-green-500/50 hover:bg-green-500/5 transition-all duration-300"
            >
              <ChevronRightIcon className="size-5" />
            </button>
          </div>

        </ScrollReveal>

        {/* Cards */}
        <div
          key={tab}
          className={`grid grid-cols-2 gap-3 sm:gap-4 animate-[fadeSlide_0.4s_ease-out] ${
            filtered.length >= 4 ? "lg:grid-cols-4" : filtered.length === 3 ? "lg:grid-cols-3" : "lg:grid-cols-2 max-w-3xl mx-auto"
          }`}
        >
          {filtered.length === 0 ? (
            <div className="col-span-full text-center py-16 text-neutral-500">
              Мастеров в этой категории пока нет
            </div>
          ) : (
            filtered.map((master, i) => (
              <div key={master.id || master.name}>
                <GlowBorder className="h-full" hoverScale={1.05}>
                  <div className="p-3 sm:p-4 flex flex-col h-full group">
                    <div className="w-full aspect-[3/4] overflow-hidden rounded-lg sm:rounded-xl mb-3 sm:mb-4 bg-neutral-900">
                      {master.photoUrl ? (
                        <img src={master.photoUrl} alt={master.name} className="w-full h-full object-cover object-top group-hover:scale-110 transition-transform duration-700 ease-[cubic-bezier(0.22,1,0.36,1)]" />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-neutral-600 text-4xl font-bold">
                          {master.name?.charAt(0)}
                        </div>
                      )}
                    </div>
                    <h3 className="text-white font-bold text-sm sm:text-lg">{master.name}</h3>
                    <p className="text-green-400 text-xs sm:text-sm mt-1">{master.styles?.join(", ") || ""}</p>
                    <p className="text-neutral-500 text-[0.65rem] sm:text-xs mt-1 hidden sm:block">{master.bio || ""}</p>
                    <a
                      href="#booking"
                      onClick={() => {
                        if (master.id) window.dispatchEvent(new CustomEvent("select-artist", { detail: master.id }));
                      }}
                      className="mt-3 sm:mt-4 w-full py-2 sm:py-2.5 rounded-full border border-green-500/30 text-green-400 text-xs sm:text-sm hover:bg-green-600 hover:text-white hover:border-green-600 hover:shadow-[0_0_20px_rgba(34,197,94,0.3)] transition-all duration-300 text-center block"
                    >Записаться</a>
                  </div>
                </GlowBorder>
              </div>
            ))
          )}
        </div>
      </div>
    </section>
  );
}
