"use client";

import { useRef, type ReactNode } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";

gsap.registerPlugin(useGSAP, ScrollTrigger);

interface StaggerRevealProps {
  children: ReactNode;
  className?: string;
  childSelector?: string;
  stagger?: number;
  y?: number;
}

export function StaggerReveal({
  children,
  className = "",
  childSelector = ".stagger-item",
  stagger = 0.12,
  y = 50,
}: StaggerRevealProps) {
  const ref = useRef<HTMLDivElement>(null);

  useGSAP(() => {
    const items = ref.current?.querySelectorAll(childSelector);
    if (!items?.length) return;

    gsap.from(items, {
      y,
      autoAlpha: 0,
      duration: 0.7,
      stagger,
      ease: "power3.out",
      scrollTrigger: {
        trigger: ref.current,
        start: "top 80%",
        once: true,
      },
    });
  }, { scope: ref });

  return (
    <div ref={ref} className={className}>
      {children}
    </div>
  );
}
