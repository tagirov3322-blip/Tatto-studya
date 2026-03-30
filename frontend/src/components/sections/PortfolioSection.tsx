"use client";

import React, { useState, useEffect } from "react";
import { BGPattern } from "@/components/ui/bg-pattern";
import { ScrollReveal } from "@/components/animations/ScrollReveal";
import { TextReveal } from "@/components/animations/TextReveal";
import { getPortfolio } from "@/lib/api";

export function PortfolioSection() {
  const [hovered, setHovered] = useState<number | null>(null);
  const [portfolioItems, setPortfolioItems] = useState<{ img: string }[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getPortfolio()
      .then((data) => {
        if (data && data.length > 0) {
          setPortfolioItems(data.map((item: any) => ({ img: item.imageUrl })));
        }
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  const row1 = portfolioItems.slice(0, 3);
  const row2 = portfolioItems.slice(3, 6);

  const hoveredRow = hovered !== null ? (hovered < 3 ? 0 : 1) : null;

  function getRowHeight(rowIndex: number) {
    if (hovered === null) return "20rem";
    return hoveredRow === rowIndex ? "26rem" : "14rem";
  }

  function getFlex(i: number) {
    if (hovered === null) return 1;
    if (hovered === i) return 1.8;
    return 0.85;
  }

  return (
    <section id="portfolio" className="relative bg-black py-24 px-4 overflow-hidden">
      <BGPattern variant="dots" mask="fade-center" fill="rgba(255,255,255,0.12)" size={16} />
      <div className="max-w-6xl mx-auto relative z-10">
        <div className="text-center mb-14">
          <TextReveal>
            <h2 className="text-4xl md:text-5xl font-bold text-white tracking-tight">Портфолио</h2>
          </TextReveal>
          <ScrollReveal delay={0.2}>
            <p className="text-green-400 mt-4 max-w-2xl mx-auto text-base">
              Работаем в любых направлениях — от минималистичных линий до масштабных проектов.
            </p>
          </ScrollReveal>
        </div>

        {loading ? (
          <div className="text-center text-gray-500 py-20">Загрузка...</div>
        ) : portfolioItems.length === 0 ? (
          <div className="text-center text-gray-500 py-20">Нет работ в портфолио</div>
        ) : (
          <div
            className="flex flex-col gap-3"
            onMouseLeave={() => setHovered(null)}
          >
            {/* Ряд 1 */}
            <div
              className="flex gap-3 transition-[height] duration-500 ease-[cubic-bezier(0.22,1,0.36,1)]"
              style={{ height: getRowHeight(0) }}
            >
              {row1.map((item, i) => (
                <Card
                  key={i}
                  img={item.img}
                  flex={getFlex(i)}
                  isActive={hovered === i}
                  isDimmed={hovered !== null && hovered !== i}
                  onHover={() => setHovered(i)}
                />
              ))}
            </div>

            {/* Ряд 2 */}
            {row2.length > 0 && (
              <div
                className="flex gap-3 transition-[height] duration-500 ease-[cubic-bezier(0.22,1,0.36,1)]"
                style={{ height: getRowHeight(1) }}
              >
                {row2.map((item, i) => (
                  <Card
                    key={i + 3}
                    img={item.img}
                    flex={getFlex(i + 3)}
                    isActive={hovered === i + 3}
                    isDimmed={hovered !== null && hovered !== i + 3}
                    onHover={() => setHovered(i + 3)}
                  />
                ))}
              </div>
            )}
          </div>
        )}
      </div>
    </section>
  );
}

function Card({
  img,
  flex,
  isActive,
  isDimmed,
  onHover,
}: {
  img: string;
  flex: number;
  isActive: boolean;
  isDimmed: boolean;
  onHover: () => void;
}) {
  const cardRef = React.useRef<HTMLDivElement>(null);
  const [mouse, setMouse] = React.useState({ x: 0.5, y: 0.5 });

  const handleMouseMove = (e: React.MouseEvent) => {
    const rect = cardRef.current?.getBoundingClientRect();
    if (!rect) return;
    setMouse({
      x: (e.clientX - rect.left) / rect.width,
      y: (e.clientY - rect.top) / rect.height,
    });
  };

  const borderGradient = isActive
    ? `radial-gradient(circle at ${mouse.x * 100}% ${mouse.y * 100}%, rgba(34,197,94,1) 0%, rgba(34,197,94,0.3) 45%, rgba(34,197,94,0.05) 100%)`
    : "none";

  return (
    <div
      ref={cardRef}
      className="portfolio-card relative rounded-xl cursor-pointer transition-[flex] duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] p-[2px]"
      style={{
        flex,
        background: isActive ? borderGradient : "rgba(34,197,94,0.1)",
      }}
      onMouseEnter={onHover}
      onMouseMove={handleMouseMove}
    >
      <div className="relative overflow-hidden rounded-[10px] w-full h-full">
        <img
          src={img}
          alt=""
          className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 ease-[cubic-bezier(0.22,1,0.36,1)]"
          style={{ transform: isActive ? "scale(1.06)" : "scale(1)" }}
        />
        <div
          className="absolute inset-0 transition-colors duration-500"
          style={{
            backgroundColor: isDimmed ? "rgba(0,0,0,0.65)" : isActive ? "rgba(0,0,0,0)" : "rgba(0,0,0,0.1)",
          }}
        />
      </div>
    </div>
  );
}
