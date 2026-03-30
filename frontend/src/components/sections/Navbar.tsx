"use client";

import React, { useState, useEffect } from "react";
import { cn } from "@/lib/utils";
import { MenuIcon, XIcon } from "lucide-react";

const navLinks = [
  { label: "Главная", href: "#hero" },
  { label: "Портфолио", href: "#portfolio" },
  { label: "Мастера", href: "#masters" },
  { label: "Тату", href: "#tattoo-price" },
  { label: "Пирсинг", href: "#piercing-price" },
  { label: "Обучение", href: "#training" },
  { label: "Контакты", href: "#contacts" },
];

export function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <nav
      className={cn(
        "fixed top-0 left-0 right-0 z-[100] transition-all duration-300",
        scrolled
          ? "bg-black/90 backdrop-blur-lg border-b border-green-500/10"
          : "bg-black border-b border-green-500/10"
      )}
    >
      <div className="max-w-6xl mx-auto px-4 flex items-center justify-between h-16">
        <a href="#hero" className="text-2xl font-bold text-green-400 tracking-tight">
          КЛЯКСА
        </a>

        {/* Desktop */}
        <div className="hidden md:flex items-center gap-6">
          {navLinks.map((link) => (
            <a
              key={link.href}
              href={link.href}
              className="text-sm text-neutral-400 hover:text-green-400 transition-colors"
            >
              {link.label}
            </a>
          ))}
          <a
            href="#booking"
            className="text-sm bg-green-600 text-white rounded-full px-5 py-2 hover:bg-green-700 transition-colors font-medium"
          >
            Записаться
          </a>
        </div>

        {/* Mobile toggle */}
        <button
          className="md:hidden text-white"
          onClick={() => setMobileOpen(!mobileOpen)}
        >
          {mobileOpen ? <XIcon className="size-6" /> : <MenuIcon className="size-6" />}
        </button>
      </div>

      {/* Mobile menu */}
      {mobileOpen && (
        <div className="md:hidden bg-black/95 backdrop-blur-lg border-b border-green-500/10 px-4 pb-4">
          {navLinks.map((link) => (
            <a
              key={link.href}
              href={link.href}
              className="block py-3 text-neutral-400 hover:text-green-400 transition-colors border-b border-neutral-800 last:border-0"
              onClick={() => setMobileOpen(false)}
            >
              {link.label}
            </a>
          ))}
        </div>
      )}
    </nav>
  );
}
