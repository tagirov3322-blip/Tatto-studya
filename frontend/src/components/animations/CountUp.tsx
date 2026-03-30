"use client";

import { useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";

gsap.registerPlugin(useGSAP, ScrollTrigger);

interface CountUpProps {
  end: number;
  duration?: number;
  suffix?: string;
  prefix?: string;
  className?: string;
  decimals?: number;
}

export function CountUp({
  end,
  duration = 2,
  suffix = "",
  prefix = "",
  className = "",
  decimals = 0,
}: CountUpProps) {
  const ref = useRef<HTMLSpanElement>(null);
  const counter = useRef({ value: 0 });

  useGSAP(() => {
    gsap.to(counter.current, {
      value: end,
      duration,
      ease: "power2.out",
      scrollTrigger: {
        trigger: ref.current,
        start: "top 85%",
        once: true,
      },
      onUpdate: () => {
        if (ref.current) {
          const val = decimals > 0
            ? counter.current.value.toFixed(decimals)
            : Math.round(counter.current.value).toLocaleString("ru");
          ref.current.textContent = `${prefix}${val}${suffix}`;
        }
      },
    });
  });

  return (
    <span ref={ref} className={className}>
      {prefix}0{suffix}
    </span>
  );
}
