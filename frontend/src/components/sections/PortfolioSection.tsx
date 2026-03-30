"use client";

import React, { useState, useEffect, useRef, useCallback } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";
import { BGPattern } from "@/components/ui/bg-pattern";
import { ScrollReveal } from "@/components/animations/ScrollReveal";
import { TextReveal } from "@/components/animations/TextReveal";
import { getPortfolio } from "@/lib/api";

gsap.registerPlugin(useGSAP, ScrollTrigger);

function preloadImages(urls: string[]): Promise<void> {
  return Promise.all(
    urls.map(
      (src) =>
        new Promise<void>((resolve) => {
          const img = new Image();
          img.onload = () => resolve();
          img.onerror = () => resolve();
          img.src = src;
        })
    )
  ).then(() => {});
}

export function PortfolioSection() {
  const [hovered, setHovered] = useState<number | null>(null);
  const [portfolioItems, setPortfolioItems] = useState<{ img: string }[]>([]);
  const [ready, setReady] = useState(false);
  const gridRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    getPortfolio()
      .then(async (data) => {
        if (data && data.length > 0) {
          const items = data.map((item: any) => ({ img: item.imageUrl }));
          await preloadImages(items.map((i: { img: string }) => i.img));
          setPortfolioItems(items);
        }
      })
      .catch(() => {})
      .finally(() => setReady(true));
  }, []);

  useGSAP(() => {
    if (!ready || portfolioItems.length === 0) return;

    const cards = gridRef.current?.querySelectorAll(".portfolio-card");
    if (!cards?.length) return;

    gsap.set(cards, { autoAlpha: 0, y: 40 });

    gsap.to(cards, {
      autoAlpha: 1,
      y: 0,
      duration: 0.8,
      stagger: 0.1,
      ease: "power3.out",
      scrollTrigger: {
        trigger: gridRef.current,
        start: "top 80%",
        once: true,
      },
    });
  }, { scope: gridRef, dependencies: [ready, portfolioItems] });

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

        {!ready ? (
          <div className="text-center text-neutral-600 py-20">Загрузка...</div>
        ) : portfolioItems.length === 0 ? (
          <div className="text-center text-neutral-600 py-20">Нет работ в портфолио</div>
        ) : (
          <div
            ref={gridRef}
            className="flex flex-col gap-3"
            onMouseLeave={() => setHovered(null)}
          >
            <div
              className="flex gap-3"
              style={{
                height: getRowHeight(0),
                transition: "height 0.6s cubic-bezier(0.22, 1, 0.36, 1)",
              }}
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

            {row2.length > 0 && (
              <div
                className="flex gap-3"
                style={{
                  height: getRowHeight(1),
                  transition: "height 0.6s cubic-bezier(0.22, 1, 0.36, 1)",
                }}
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
      className="portfolio-card relative rounded-xl cursor-pointer p-[2px]"
      style={{
        flex,
        background: isActive ? borderGradient : "rgba(34,197,94,0.1)",
        visibility: "hidden",
        transition: "flex 0.6s cubic-bezier(0.22, 1, 0.36, 1), background 0.4s ease",
      }}
      onMouseEnter={onHover}
      onMouseMove={handleMouseMove}
    >
      <div className="relative overflow-hidden rounded-[10px] w-full h-full">
        <img
          src={img}
          alt=""
          className="absolute inset-0 w-full h-full object-cover"
          style={{
            transform: isActive ? "scale(1.06)" : "scale(1)",
            transition: "transform 0.7s cubic-bezier(0.22, 1, 0.36, 1)",
          }}
        />
        <div
          className="absolute inset-0"
          style={{
            backgroundColor: isDimmed ? "rgba(0,0,0,0.65)" : isActive ? "rgba(0,0,0,0)" : "rgba(0,0,0,0.1)",
            transition: "background-color 0.5s cubic-bezier(0.22, 1, 0.36, 1)",
          }}
        />
      </div>
    </div>
  );
}
