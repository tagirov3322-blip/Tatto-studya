'use client';
import React from 'react';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { BGPattern } from '@/components/ui/bg-pattern';
import { WavePath } from '@/components/ui/wave-path';
import { Footer } from '@/components/ui/footer-section';
import { PhoneIcon, MailIcon, MapPinIcon, ClockIcon } from 'lucide-react';
import { GlowBorder } from '@/components/ui/glow-border';
import { ScrollReveal } from '@/components/animations/ScrollReveal';
import { StaggerReveal } from '@/components/animations/StaggerReveal';
import { TextReveal } from '@/components/animations/TextReveal';

const questions = [
  { id: 'item-1', title: 'Это больно?', content: 'Зависит от зоны и вашего болевого порога. По желанию используем анестетик — обсудите это с мастером на консультации.' },
  { id: 'item-2', title: 'Как подготовиться к сеансу?', content: 'Выспитесь, поешьте, откажитесь от алкоголя за сутки. Наденьте удобную одежду с доступом к зоне нанесения.' },
  { id: 'item-3', title: 'Сколько заживает тату?', content: '2–4 недели. Мастер даст памятку по уходу: заживляющий крем, без воды и солнца в первые дни.' },
  { id: 'item-4', title: 'Можно перекрыть старую тату?', content: 'Да. На бесплатной консультации мастер оценит старую работу и предложит варианты перекрытия.' },
  { id: 'item-5', title: 'Всё ли стерильно?', content: 'Иглы, колпачки и расходники — одноразовые. Оборудование проходит автоклавирование после каждого клиента.' },
  { id: 'item-6', title: 'Как записаться?', content: 'Напишите в Telegram или Instagram, позвоните или приходите в студию. Консультация бесплатная.' },
  { id: 'item-7', title: 'Есть ли ограничения по возрасту?', content: 'Работаем с 18 лет. С 16 лет — только с письменным согласием и присутствием родителя.' },
];

export function ContactsFaqSection() {
  return (
    <section id="faq" className="relative bg-neutral-950 overflow-hidden">
      <BGPattern
        variant="dots"
        mask="none"
        fill="rgba(255,255,255,0.12)"
        size={16}
        style={{
          maskImage: "radial-gradient(ellipse at center, transparent 30%, black 70%), linear-gradient(to bottom, black 60%, transparent 100%)",
          WebkitMaskImage: "radial-gradient(ellipse at center, transparent 30%, black 70%), linear-gradient(to bottom, black 60%, transparent 100%)",
          maskComposite: "intersect",
          WebkitMaskComposite: "source-in",
        }}
      />
      <div className="relative z-10 flex justify-center py-10">
        <WavePath className="text-green-500/40" />
      </div>

      <div className="mx-auto w-full max-w-6xl px-4 py-24 relative z-10">
        <div className="text-center mb-14">
          <ScrollReveal><span className="text-green-400 text-sm uppercase tracking-widest font-medium">FAQ</span></ScrollReveal>
          <TextReveal className="mt-3"><h2 className="text-4xl md:text-5xl font-bold text-white tracking-tight">Вопросы</h2></TextReveal>
          <ScrollReveal delay={0.2}><p className="text-neutral-400 mt-4 max-w-2xl mx-auto text-base">Ответы на то, что спрашивают чаще всего. Не нашли своё — напишите нам.</p></ScrollReveal>
        </div>

        <ScrollReveal>
          <div className="max-w-3xl mx-auto">
            <GlowBorder borderWidth={1}>
              <Accordion type="single" collapsible className="bg-neutral-900/50 w-full -space-y-px rounded-xl" defaultValue="item-1">
                {questions.map((item) => (
                  <AccordionItem value={item.id} key={item.id} className="relative border-x border-green-500/10 first:rounded-t-xl first:border-t last:rounded-b-xl last:border-b">
                    <AccordionTrigger className="px-5 py-4 text-[15px] leading-6 hover:no-underline text-white hover:text-green-400 transition-colors">{item.title}</AccordionTrigger>
                    <AccordionContent className="text-neutral-400 pb-4 px-5">{item.content}</AccordionContent>
                  </AccordionItem>
                ))}
              </Accordion>
            </GlowBorder>
          </div>
        </ScrollReveal>
      </div>

      <div id="contacts" className="mx-auto w-full max-w-6xl px-4 pb-24 relative z-10">
        <div className="text-center mb-14">
          <ScrollReveal><span className="text-green-400 text-sm uppercase tracking-widest font-medium">На связи</span></ScrollReveal>
          <TextReveal className="mt-3"><h2 className="text-4xl md:text-5xl font-bold text-white tracking-tight">Контакты</h2></TextReveal>
        </div>

        <StaggerReveal childSelector=".stagger-item" stagger={0.1}>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {[
              { icon: <PhoneIcon className="size-8 text-green-400 mx-auto mb-3" />, title: "Телефон", value: "+7 (900) 322-23-58", href: "tel:+79003222358" },
              { icon: <MailIcon className="size-8 text-green-400 mx-auto mb-3" />, title: "Почта", value: "tattoo_klaksa@gmail.com", href: "mailto:tattoo_klaksa@gmail.com" },
              { icon: <MapPinIcon className="size-8 text-green-400 mx-auto mb-3" />, title: "Студия", value: "пр. Сююмбике, 2/19" },
              { icon: <ClockIcon className="size-8 text-green-400 mx-auto mb-3" />, title: "Часы работы", value: "Ежедневно 10:00 — 19:00" },
            ].map((item) => (
              <div key={item.title} className="stagger-item" style={{ visibility: "hidden" }}>
                <GlowBorder className="h-full" hoverScale={1.05}>
                  {item.href ? (
                    <a href={item.href} className="p-6 text-center block">
                      {item.icon}<h3 className="text-white font-semibold mb-1">{item.title}</h3><p className="text-neutral-400 text-sm">{item.value}</p>
                    </a>
                  ) : (
                    <div className="p-6 text-center">
                      {item.icon}<h3 className="text-white font-semibold mb-1">{item.title}</h3><p className="text-neutral-400 text-sm">{item.value}</p>
                    </div>
                  )}
                </GlowBorder>
              </div>
            ))}
          </div>
        </StaggerReveal>
      </div>

      <Footer />
    </section>
  );
}
