"use client";

import { CountUp } from "@/components/animations/CountUp";
import { ScrollReveal } from "@/components/animations/ScrollReveal";
import { BGPattern } from "@/components/ui/bg-pattern";

const stats = [
  { value: 500, suffix: "+", label: "Довольных клиентов" },
  { value: 10, suffix: "+", label: "Лет на рынке" },
  { value: 4, suffix: "", label: "Мастера в команде" },
  { value: 98, suffix: "%", label: "Рекомендуют нас" },
];

export function StatsSection() {
  return (
    <section className="relative bg-black py-20 px-4 border-y border-green-500/10 overflow-hidden">
      {/* no bg pattern */}
      <div className="max-w-6xl mx-auto relative z-10">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
          {stats.map((stat, i) => (
            <ScrollReveal key={stat.label} delay={i * 0.1} className="text-center">
              <div className="font-mono text-4xl md:text-5xl font-bold text-green-400">
                <CountUp end={stat.value} suffix={stat.suffix} duration={2.5} />
              </div>
              <p className="text-neutral-500 text-sm mt-2 uppercase tracking-wider">{stat.label}</p>
            </ScrollReveal>
          ))}
        </div>
      </div>
    </section>
  );
}
