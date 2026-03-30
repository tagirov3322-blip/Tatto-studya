'use client';
import React from 'react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { GlowBorder } from '@/components/ui/glow-border';
import { CheckIcon, SparklesIcon } from 'lucide-react';
import { ScrollReveal } from '@/components/animations/ScrollReveal';
import { StaggerReveal } from '@/components/animations/StaggerReveal';
import { TextReveal } from '@/components/animations/TextReveal';

function FilledCheck() {
  return (<div className="bg-green-600 text-white rounded-full p-0.5 shrink-0"><CheckIcon className="size-3" strokeWidth={3} /></div>);
}

function PricingCard({ titleBadge, priceLabel, priceSuffix = '', features, cta = 'Записаться', className }: { titleBadge: string; priceLabel: string; priceSuffix?: string; features: string[]; cta?: string; className?: string }) {
  return (
    <GlowBorder className={cn("h-full", className)}>
      <div className="p-5 h-full">
        <div className="flex items-center gap-3">
          <Badge variant="secondary" className="bg-green-500/10 text-green-400 border-green-500/20">{titleBadge}</Badge>
          <div className="ml-auto"><a href="#booking"><Button variant="outline" className="border-green-500/30 text-green-400 hover:bg-green-500/10">{cta}</Button></a></div>
        </div>
        <div className="flex items-end gap-2 mt-4">
          <span className="font-mono text-4xl font-bold tracking-tight text-white">{priceLabel}</span>
          {priceSuffix && <span className="text-neutral-500 text-sm">{priceSuffix}</span>}
        </div>
        <ul className="text-neutral-400 grid gap-3 mt-4 text-sm">
          {features.map((f, i) => (<li key={i} className="flex items-center gap-3"><FilledCheck /><span>{f}</span></li>))}
        </ul>
      </div>
    </GlowBorder>
  );
}

export function TattooPriceSection() {
  return (
    <section id="tattoo-price" className="relative bg-black py-24 px-4">
      <div className="mx-auto w-full max-w-6xl">
        <div className="text-center mb-14">
          <ScrollReveal><span className="text-green-400 text-sm uppercase tracking-widest font-medium">Тату</span></ScrollReveal>
          <TextReveal className="mt-3"><h2 className="text-4xl md:text-5xl font-bold text-white tracking-tight">Стоимость</h2></TextReveal>
          <ScrollReveal delay={0.2}><p className="text-neutral-400 mt-4 max-w-2xl mx-auto text-base">Финальная цена зависит от размера и сложности. Консультация — бесплатно.</p></ScrollReveal>
        </div>

        <StaggerReveal childSelector=".stagger-item" stagger={0.1}>
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-8">
            <div className="stagger-item lg:col-span-5" style={{ visibility: "hidden" }}>
              <GlowBorder className="h-full">
                <div className="p-5 h-full">
                  <div className="pointer-events-none absolute top-0 left-1/2 -mt-2 -ml-20 h-full w-full [mask-image:linear-gradient(white,transparent)]">
                    <div className="from-green-500/5 to-green-500/2 absolute inset-0 bg-gradient-to-r [mask-image:radial-gradient(farthest-side_at_top,white,transparent)]">
                      <div aria-hidden="true" className={cn('absolute inset-0 size-full mix-blend-overlay', 'bg-[linear-gradient(to_right,rgba(34,197,94,0.1)_1px,transparent_1px)]', 'bg-[size:24px]')} />
                    </div>
                  </div>
                  <div className="flex items-center gap-3 relative">
                    <Badge variant="secondary" className="bg-green-500/10 text-green-400 border-green-500/20">ИНДИВИДУАЛЬНЫЙ ПРОЕКТ</Badge>
                    <Badge variant="outline" className="hidden lg:flex text-green-400 border-green-500/30"><SparklesIcon className="me-1 size-3" /> Чаще всего выбирают</Badge>
                    <div className="ml-auto"><a href="#booking"><Button className="bg-green-600 text-white hover:bg-green-700">Записаться</Button></a></div>
                  </div>
                  <div className="flex flex-col mt-4 lg:flex-row relative">
                    <div className="pb-4 lg:w-[30%]">
                      <span className="font-mono text-4xl font-bold tracking-tight text-white">от 5000₽</span>
                      <span className="text-neutral-500 text-sm">/сеанс</span>
                    </div>
                    <ul className="text-neutral-400 grid gap-3 text-sm lg:w-[70%]">
                      {['Эскиз разрабатывается под вас', 'Любой стиль, размер и сложность', 'Пигменты и оборудование премиум-класса', 'Коррекция бесплатно в течение 30 дней'].map((f, i) => (
                        <li key={i} className="flex items-center gap-3"><FilledCheck /><span>{f}</span></li>
                      ))}
                    </ul>
                  </div>
                </div>
              </GlowBorder>
            </div>
            <div className="stagger-item lg:col-span-3" style={{ visibility: "hidden" }}><PricingCard titleBadge="МИНИ-ТАТУ" priceLabel="от 3 000₽" features={['Размер до 5 см', 'Надписи, символы, мини-арт', 'Один сеанс — 30–60 минут']} /></div>
            <div className="stagger-item lg:col-span-4" style={{ visibility: "hidden" }}><PricingCard titleBadge="ПЕРЕКРЫТИЕ" priceLabel="от 7 000₽" priceSuffix="/сеанс" features={['Перекрытие старых или неудачных тату', 'Обязательная консультация с мастером', 'Эскиз с учётом старой работы']} /></div>
            <div className="stagger-item lg:col-span-4" style={{ visibility: "hidden" }}><PricingCard titleBadge="МАСШТАБНЫЙ ПРОЕКТ" priceLabel="от 40 000₽" priceSuffix="/проект" features={['Рукав, спина, бедро и другие зоны', 'Разбивка на сеансы с графиком', 'Фиксированная цена за весь проект']} /></div>
          </div>
        </StaggerReveal>
      </div>
    </section>
  );
}
