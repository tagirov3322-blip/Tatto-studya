"use client";

import React, { useRef, useState, type ReactNode } from "react";

interface GlowBorderProps {
  children: ReactNode;
  className?: string;
  borderWidth?: number;
  hoverScale?: number;
  allowOverflow?: boolean;
}

export function GlowBorder({
  children,
  className = "",
  borderWidth = 2,
  hoverScale = 1.03,
  allowOverflow = false,
}: GlowBorderProps) {
  const ref = useRef<HTMLDivElement>(null);
  const [mouse, setMouse] = useState({ x: 50, y: 50 });
  const [active, setActive] = useState(false);

  const handleMouseMove = (e: React.MouseEvent) => {
    const rect = ref.current?.getBoundingClientRect();
    if (!rect) return;
    setMouse({
      x: ((e.clientX - rect.left) / rect.width) * 100,
      y: ((e.clientY - rect.top) / rect.height) * 100,
    });
  };

  return (
    <div
      ref={ref}
      className={`relative rounded-xl cursor-pointer ${className}`}
      style={{
        padding: `${borderWidth}px`,
        transform: active ? `scale(${hoverScale})` : "scale(1)",
        transition: "transform 0.4s cubic-bezier(0.22, 1, 0.36, 1)",
      }}
      onMouseMove={handleMouseMove}
      onMouseEnter={() => setActive(true)}
      onMouseLeave={() => setActive(false)}
    >
      {/* Неактивный бордер — всегда виден */}
      <div
        className="absolute inset-0 rounded-xl transition-opacity duration-500 ease-out"
        style={{
          background: "rgba(34,197,94,0.1)",
          opacity: active ? 0 : 1,
        }}
      />

      {/* Активный бордер — следует за курсором */}
      <div
        className="absolute inset-0 rounded-xl transition-opacity duration-500 ease-out"
        style={{
          background: `radial-gradient(circle at ${mouse.x}% ${mouse.y}%, rgba(34,197,94,1) 0%, rgba(34,197,94,0.3) 35%, rgba(34,197,94,0.05) 70%, transparent 100%)`,
          opacity: active ? 1 : 0,
        }}
      />

      {/* Контент */}
      <div className={`relative rounded-[10px] w-full h-full bg-neutral-950 z-10 ${allowOverflow ? "" : "overflow-hidden"}`}>
        {children}
      </div>
    </div>
  );
}
