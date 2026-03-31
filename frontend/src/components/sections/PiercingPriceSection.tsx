'use client';
import React from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { BGPattern } from '@/components/ui/bg-pattern';
import { GlowBorder } from '@/components/ui/glow-border';
import { CheckIcon } from 'lucide-react';
import { ScrollReveal } from '@/components/animations/ScrollReveal';
import { StaggerReveal } from '@/components/animations/StaggerReveal';
import { TextReveal } from '@/components/animations/TextReveal';

function FilledCheck() {
  return (<div className="bg-green-600 text-white rounded-full p-0.5 shrink-0"><CheckIcon className="size-3" strokeWidth={3} /></div>);
}

const piercingData = [
  { zone: "Уши", price: "от 1 800₽", items: ["Мочка", "Хеликс", "Трагус", "Индастриал", "Конч", "Дейс"] },
  { zone: "Лицо", price: "от 2 500₽", items: ["Нострил", "Септум", "Бридж", "Лабрет", "Монро", "Медуза"] },
  { zone: "Тело", price: "от 3 000₽", items: ["Пупок", "Микродермал", "Сосок", "Поверхностный пирсинг"] },
];

export function PiercingPriceSection() {
  return (
    <section id="piercing-price" className="relative bg-neutral-950 py-24 px-4 overflow-hidden">
      <BGPattern variant="dots" mask="fade-center" fill="rgba(255,255,255,0.1)" size={16} />
      <div className="mx-auto w-full max-w-6xl relative z-10">
        <div className="text-center mb-14">
          <ScrollReveal><span className="text-green-400 text-sm uppercase tracking-widest font-medium">Пирсинг</span></ScrollReveal>
          <TextReveal className="mt-3"><h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-white tracking-tight">Стоимость</h2></TextReveal>
          <ScrollReveal delay={0.2}><p className="text-neutral-400 mt-4 max-w-2xl mx-auto text-base">В цену входит работа мастера, базовое украшение из титана и антисептическая обработка.</p></ScrollReveal>
        </div>

        <StaggerReveal childSelector=".stagger-item" stagger={0.15}>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {piercingData.map((zone) => (
              <div key={zone.zone} className="stagger-item" style={{ visibility: "hidden" }}>
                <GlowBorder className="h-full">
                  <div className="p-4 sm:p-6 h-full flex flex-col">
                    <div className="flex items-center justify-between mb-4 sm:mb-6">
                      <Badge variant="secondary" className="bg-green-500/10 text-green-400 border-green-500/20 text-sm sm:text-base px-3 sm:px-4 py-1">{zone.zone}</Badge>
                      <span className="font-mono text-xl sm:text-2xl font-bold text-white">{zone.price}</span>
                    </div>
                    <ul className="text-neutral-400 space-y-3 text-sm mb-6">
                      {zone.items.map((item, i) => (<li key={i} className="flex items-center gap-3"><FilledCheck /><span>{item}</span></li>))}
                    </ul>
                    <div className="mt-auto">
                      <a href="#booking"><Button variant="outline" className="w-full border-green-500/30 text-green-400 hover:bg-green-600 hover:text-white hover:border-green-600 hover:shadow-[0_0_20px_rgba(34,197,94,0.3)] transition-all duration-300">Записаться</Button></a>
                    </div>
                  </div>
                </GlowBorder>
              </div>
            ))}
          </div>
        </StaggerReveal>

        <ScrollReveal delay={0.3} className="mt-8">
          <GlowBorder>
            <div className="p-5 text-center">
              <p className="text-neutral-500 text-sm">Украшения — титан ASTM F136 и сталь 316L. Подбор премиум-украшений — отдельно. <span className="text-green-400">Замена украшения — от 800₽</span></p>
            </div>
          </GlowBorder>
        </ScrollReveal>
      </div>
    </section>
  );
}
