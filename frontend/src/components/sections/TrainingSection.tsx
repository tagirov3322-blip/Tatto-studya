'use client';
import React from 'react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { BGPattern } from '@/components/ui/bg-pattern';
import { GlowBorder } from '@/components/ui/glow-border';
import { CheckIcon, SparklesIcon, ArrowRightIcon } from 'lucide-react';
import { CallToAction } from '@/components/ui/cta-3';
import { ScrollReveal } from '@/components/animations/ScrollReveal';
import { StaggerReveal } from '@/components/animations/StaggerReveal';
import { TextReveal } from '@/components/animations/TextReveal';

function FilledCheck() {
  return (<div className="bg-green-600 text-white rounded-full p-0.5 shrink-0"><CheckIcon className="size-3" strokeWidth={3} /></div>);
}

const tariffs = [
  { name: "БАЗА", price: "15 000₽", duration: "2 недели · 6 занятий", popular: false, features: ["Гигиена, стерилизация, кожа", "Сборка и настройка машинки", "Практика на латексе", "Основы линий и теней", "Сертификат"], cta: "Записаться" },
  { name: "ИНТЕНСИВ", price: "40 000₽", duration: "1 месяц · 12 занятий", popular: true, features: ["Всё из «Базы»", "Работа в разных стилях", "Практика на живых моделях", "Сборка портфолио — 5 работ", "Разбор ошибок с наставником", "Доступ в чат выпускников"], cta: "Записаться" },
  { name: "НАСТАВНИК", price: "70 000₽", duration: "2 месяца · индивидуально", popular: false, features: ["Всё из «Интенсива»", "Личная программа под ваш стиль", "Стажировка в студии Клякса", "Помощь с первыми клиентами", "Скидка 30% на оборудование", "Поддержка после выпуска"], cta: "Записаться" },
];

export function TrainingSection() {
  return (
    <section id="training" className="relative bg-black py-24 px-4 overflow-hidden">
      {/* no bg pattern */}
      <div className="mx-auto w-full max-w-6xl relative z-10">
        <div className="text-center mb-14">
          <ScrollReveal><span className="text-green-400 text-sm uppercase tracking-widest font-medium">Обучение</span></ScrollReveal>
          <TextReveal className="mt-3"><h2 className="text-4xl md:text-5xl font-bold text-white tracking-tight">Курсы</h2></TextReveal>
          <ScrollReveal delay={0.2}><p className="text-neutral-400 mt-4 max-w-2xl mx-auto text-base">От нуля до первого клиента. Учим на практике, а не на лекциях.</p></ScrollReveal>
        </div>

        <StaggerReveal childSelector=".stagger-item" stagger={0.15}>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-16">
            {tariffs.map((tariff) => (
              <div key={tariff.name} className="stagger-item" style={{ visibility: "hidden" }}>
                <GlowBorder className="h-full">
                  <div className="relative p-6 h-full flex flex-col">
                    {tariff.popular && (
                      <div className="pointer-events-none absolute top-0 left-1/2 -mt-2 -ml-20 h-full w-full [mask-image:linear-gradient(white,transparent)]">
                        <div className="from-green-500/5 to-green-500/2 absolute inset-0 bg-gradient-to-r [mask-image:radial-gradient(farthest-side_at_top,white,transparent)]" />
                      </div>
                    )}
                    <div className="flex items-center gap-2 mb-6 relative">
                      <Badge variant="secondary" className="bg-green-500/10 text-green-400 border-green-500/20">{tariff.name}</Badge>
                      {tariff.popular && <Badge variant="outline" className="text-green-400 border-green-500/30"><SparklesIcon className="me-1 size-3" /> Популярный</Badge>}
                    </div>
                    <div className="mb-1 relative"><span className="font-mono text-4xl font-bold text-white">{tariff.price}</span></div>
                    <p className="text-neutral-500 text-sm mb-6 relative">{tariff.duration}</p>
                    <ul className="text-neutral-400 space-y-3 text-sm mb-8 relative">
                      {tariff.features.map((f, i) => (<li key={i} className="flex items-center gap-3"><FilledCheck /><span>{f}</span></li>))}
                    </ul>
                    <div className="mt-auto relative">
                      <Button className="w-full border-green-500/30 text-green-400 hover:bg-green-600 hover:text-white hover:border-green-600 hover:shadow-[0_0_20px_rgba(34,197,94,0.3)] transition-all duration-300" variant="outline">
                        {tariff.cta} <ArrowRightIcon className="size-4 ml-1" />
                      </Button>
                    </div>
                  </div>
                </GlowBorder>
              </div>
            ))}
          </div>
        </StaggerReveal>

        <ScrollReveal>
          <CallToAction />
        </ScrollReveal>
      </div>
    </section>
  );
}
