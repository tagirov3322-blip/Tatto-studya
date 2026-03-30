"use client";

import { useEffect, useRef, useState } from "react";

interface Particle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  life: number;
  maxLife: number;
  size: number;
}

export function CustomCursor() {
  const dotRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const mouse = useRef({ x: -100, y: -100 });
  const prevMouse = useRef({ x: -100, y: -100 });
  const particles = useRef<Particle[]>([]);
  const [onGreen, setOnGreen] = useState(false);
  const [hidden, setHidden] = useState(false);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const resize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    resize();
    window.addEventListener("resize", resize);

    const isGreenElement = (el: HTMLElement): boolean => {
      const bg = window.getComputedStyle(el).backgroundColor;
      if (!bg || bg === "transparent" || bg === "rgba(0, 0, 0, 0)") return false;
      const match = bg.match(/\d+/g);
      if (!match) return false;
      const [r, g, b] = match.map(Number);
      return g > 120 && g > r * 1.5 && g > b * 1.5;
    };

    const handleMove = (e: MouseEvent) => {
      // Hide cursor when near the right scrollbar
      const nearScrollbar = e.clientX >= window.innerWidth - 16;
      setHidden(nearScrollbar);
      prevMouse.current = { ...mouse.current };
      mouse.current = { x: e.clientX, y: e.clientY };

      if (dotRef.current) {
        dotRef.current.style.transform = `translate(${e.clientX - 5}px, ${e.clientY - 5}px)`;
      }

      const dx = mouse.current.x - prevMouse.current.x;
      const dy = mouse.current.y - prevMouse.current.y;
      const speed = Math.sqrt(dx * dx + dy * dy);
      const count = Math.min(Math.floor(speed * 0.3), 4);

      for (let i = 0; i < count; i++) {
        particles.current.push({
          x: mouse.current.x + (Math.random() - 0.5) * 8,
          y: mouse.current.y + (Math.random() - 0.5) * 8,
          vx: (Math.random() - 0.5) * 1.5 - dx * 0.05,
          vy: (Math.random() - 0.5) * 1.5 - dy * 0.05,
          life: 1,
          maxLife: 0.6 + Math.random() * 0.5,
          size: 1.5 + Math.random() * 2.5,
        });
      }
    };

    const handleOver = (e: MouseEvent) => {
      const el = e.target as HTMLElement;
      const greenEl = el.closest("a, button, [role='button']") as HTMLElement | null;
      if (greenEl && isGreenElement(greenEl)) {
        setOnGreen(true);
      } else {
        setOnGreen(false);
      }
    };

    let rafId: number;
    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      for (let i = particles.current.length - 1; i >= 0; i--) {
        const p = particles.current[i];
        p.x += p.vx;
        p.y += p.vy;
        p.vx *= 0.97;
        p.vy *= 0.97;
        p.life -= 0.02;

        if (p.life <= 0) {
          particles.current.splice(i, 1);
          continue;
        }

        const alpha = (p.life / p.maxLife) * 0.6;
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size * (p.life / p.maxLife), 0, Math.PI * 2);
        ctx.fillStyle = `rgba(34, 197, 94, ${alpha})`;
        ctx.fill();
      }

      rafId = requestAnimationFrame(animate);
    };

    document.addEventListener("mousemove", handleMove);
    document.addEventListener("mouseover", handleOver);
    rafId = requestAnimationFrame(animate);

    return () => {
      document.removeEventListener("mousemove", handleMove);
      document.removeEventListener("mouseover", handleOver);
      window.removeEventListener("resize", resize);
      cancelAnimationFrame(rafId);
    };
  }, []);

  return (
    <>
      <style>{`
        @media (pointer: fine) {
          * { cursor: none !important; }
          ::-webkit-scrollbar { cursor: default !important; }
        }
        @media (pointer: coarse) {
          .custom-cursor-dot, .custom-cursor-canvas { display: none; }
        }
      `}</style>

      <canvas
        ref={canvasRef}
        className="custom-cursor-canvas pointer-events-none fixed inset-0 z-[999999]"
        style={{ opacity: hidden ? 0 : 1, transition: "opacity 200ms" }}
      />

      <div
        ref={dotRef}
        className="custom-cursor-dot pointer-events-none fixed top-0 left-0 z-[999999]"
        style={{
          width: onGreen ? 12 : 9,
          height: onGreen ? 12 : 9,
          marginLeft: onGreen ? -1 : 0,
          marginTop: onGreen ? -1 : 0,
          borderRadius: "50%",
          backgroundColor: "rgba(255,255,255,0.95)",
          border: "3px solid rgba(0,0,0,0.9)",
          boxShadow: "0 0 0 1.5px rgba(255,255,255,0.9), 0 0 6px rgba(0,0,0,0.4)",
          opacity: hidden ? 0 : 1,
          transition: "background-color 200ms, width 200ms, height 200ms, opacity 200ms",
        }}
      />
    </>
  );
}
