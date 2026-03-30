# Design System: Tatto Studya

## 1. Visual Theme & Atmosphere

A dark, cinematic interface inspired by yuga.com — pure black canvas with
sharp white typography and a single electric green accent. The atmosphere is
raw, confident, and heavy — like a high-end creative agency meets underground
tattoo culture. Massive type, extreme whitespace, deliberate brutalist tension.

- **Density:** 3 (Art Gallery Airy — massive whitespace, sections breathe heavily)
- **Variance:** 8 (Asymmetric — split screens, offset grids, bold layouts)
- **Motion:** 6 (Fluid CSS — spring physics, staggered reveals, scroll entries)

## 2. Color Palette & Roles

- **Void Black** (#000000) — Primary canvas/background
- **Pure White** (rgba(255,255,255,1)) — Primary text, headlines
- **Muted White** (rgba(255,255,255,0.5)) — Secondary text, descriptions
- **Subtle White** (rgba(255,255,255,0.2)) — Tertiary, disabled states
- **Electric Green** (#00FF47) — Single accent: CTAs, highlights, active states
- **Green Hover** (#00CC39) — Accent hover/pressed state
- **Green Muted** (rgba(0,255,71,0.15)) — Accent background tint
- **Ghost Border** (rgba(255,255,255,0.08)) — Structural lines, dividers
- **Surface** (rgba(255,255,255,0.04)) — Card/container fill
- **Surface Hover** (rgba(255,255,255,0.08)) — Interactive surface hover

No gradients. No purple. No blue neon. No warm tones.
Pure monochrome + one accent.

## 3. Typography Rules

- **Display/Headlines:** Space Grotesk (600-700) — tracking-tighter, leading-none
  Massive scale: text-5xl to text-8xl. Uppercase for impact headers.
- **Body:** Space Grotesk (400) — text-base, leading-relaxed, max-w-[55ch]
  Color: foreground-muted (50% white)
- **Mono/Meta:** Space Mono — prices, dates, labels, navigation metadata
  Uppercase, wide tracking (0.1-0.2em), text-xs to text-sm
- **Banned:** Inter, Roboto, Arial, Open Sans, serif fonts

## 4. Component Stylings

- **Buttons:** Ghost/outline on dark (border white/10, text white).
  Hover: accent green fill with black text. Active: scale(0.98).
  Rounded-none to rounded-sm (sharp, not pill). No outer glows.
- **Cards:** border white/8, bg white/4, no border-radius or minimal.
  Hover: border white/15 transition. No shadows — depth through opacity.
- **Navigation:** Minimal top bar, logo left, links right. Clean uppercase
  mono labels. Active state: accent green text. Mobile: full-screen overlay
  with staggered reveals.
- **Footer:** Border-top white/8 divider. Sparse grid. Mono typography.
- **Dividers:** Single 1px lines at rgba(255,255,255,0.08). Heavy use of
  horizontal rules for section separation.

## 5. Layout Principles

- CSS Grid for all major layouts
- Contain: max-w-[1400px] mx-auto
- Full-height: min-h-[100dvh] (never h-screen)
- Asymmetric Hero: left-aligned massive type, right content/image
- Section padding: py-24 to py-40 (let it breathe)
- Mobile: single column, w-full, px-5 below 768px
- 3-column equal cards BANNED — use asymmetric or masonry

## 6. Motion & Interaction

- Spring physics: stiffness 100, damping 20
- Scroll entry: translateY(20px) + opacity(0), resolve over 700ms
  cubic-bezier(0.16, 1, 0.3, 1)
- Staggered reveals: cascade delay calc(index * 80ms)
- GPU-safe: animate only transform and opacity
- Framer Motion for client components (isolated leaves)
- No window.addEventListener('scroll')

## 7. Anti-Patterns (Banned)

- No emojis
- No Inter / Roboto / Arial
- No warm colors or earth tones
- No gradients on text
- No neon glows or outer shadows
- No 3-column equal card layouts
- No centered Hero (use left-aligned or split)
- No generic names
- No AI cliches
- No h-screen
- No linear easing
- No rounded-full on large containers
- No Unsplash (use picsum.photos or solid color blocks)
