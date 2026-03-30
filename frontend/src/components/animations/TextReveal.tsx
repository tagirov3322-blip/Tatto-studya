"use client";

import { useRef, type ReactNode } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";

gsap.registerPlugin(useGSAP, ScrollTrigger);

interface TextRevealProps {
  children: ReactNode;
  className?: string;
  as?: "h1" | "h2" | "h3" | "p" | "span" | "div";
}

export function TextReveal({
  children,
  className = "",
  as: Tag = "div",
}: TextRevealProps) {
  const ref = useRef<HTMLDivElement>(null);

  useGSAP(() => {
    gsap.from(ref.current, {
      y: 80,
      autoAlpha: 0,
      duration: 1,
      ease: "power4.out",
      scrollTrigger: {
        trigger: ref.current,
        start: "top 88%",
        once: true,
      },
    });
  }, { scope: ref });

  return (
    <div ref={ref} className={className} style={{ visibility: "hidden" }}>
      <Tag>{children}</Tag>
    </div>
  );
}
