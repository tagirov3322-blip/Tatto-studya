import React, { useEffect, useRef, ReactNode } from 'react';

interface GlowCardProps {
  children: ReactNode;
  className?: string;
  glowColor?: 'blue' | 'purple' | 'green' | 'red' | 'orange';
  size?: 'sm' | 'md' | 'lg';
  width?: string | number;
  height?: string | number;
  customSize?: boolean;
}

const glowColorMap = {
  blue: { hue: 220 },
  purple: { hue: 280 },
  green: { hue: 142 },
  red: { hue: 0 },
  orange: { hue: 30 },
};

const sizeMap = {
  sm: 'w-48 h-64',
  md: 'w-64 h-80',
  lg: 'w-80 h-96'
};

const GlowCard: React.FC<GlowCardProps> = ({
  children,
  className = '',
  glowColor = 'green',
  size = 'md',
  width,
  height,
  customSize = false
}) => {
  const cardRef = useRef<HTMLDivElement>(null);
  const innerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const card = cardRef.current;
    if (!card) return;

    const syncPointer = (e: PointerEvent) => {
      const rect = card.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      card.style.setProperty('--x', x.toFixed(2));
      card.style.setProperty('--y', y.toFixed(2));
      card.style.setProperty('--active', '1');
    };

    const handleLeave = () => {
      card.style.setProperty('--active', '0');
    };

    card.addEventListener('pointermove', syncPointer);
    card.addEventListener('pointerleave', handleLeave);
    return () => {
      card.removeEventListener('pointermove', syncPointer);
      card.removeEventListener('pointerleave', handleLeave);
    };
  }, []);

  const { hue } = glowColorMap[glowColor];

  const getSizeClasses = () => {
    if (customSize) return '';
    return sizeMap[size];
  };

  const inlineStyles: React.CSSProperties & Record<string, string | number> = {
    '--glow-hue': hue,
    '--active': '0',
    '--x': '0',
    '--y': '0',
    position: 'relative',
    touchAction: 'none',
  } as React.CSSProperties & Record<string, string | number>;

  if (width !== undefined) inlineStyles.width = typeof width === 'number' ? `${width}px` : width;
  if (height !== undefined) inlineStyles.height = typeof height === 'number' ? `${height}px` : height;

  const glowStyles = `
    [data-glow-card] {
      --spotlight: 250px;
      --border-radius: 14px;
      border: 1px solid hsl(var(--glow-hue) 50% 30% / calc(var(--active) * 0.5 + 0.1));
      background: hsl(0 0% 6%);
      transition: border-color 0.3s ease;
    }

    /* Внутреннее свечение за курсором */
    [data-glow-card]::before {
      content: "";
      pointer-events: none;
      position: absolute;
      inset: 0;
      border-radius: var(--border-radius);
      background: radial-gradient(
        var(--spotlight) var(--spotlight) at calc(var(--x) * 1px) calc(var(--y) * 1px),
        hsl(var(--glow-hue) 80% 50% / calc(var(--active) * 0.12)),
        transparent
      );
      z-index: 1;
      transition: opacity 0.3s ease;
    }

    /* Свечение окантовки — бордер следует за курсором */
    [data-glow-card]::after {
      content: "";
      pointer-events: none;
      position: absolute;
      inset: -1.5px;
      border-radius: calc(var(--border-radius) + 1.5px);
      background: radial-gradient(
        200px 200px at calc(var(--x) * 1px) calc(var(--y) * 1px),
        hsl(var(--glow-hue) 85% 55% / calc(var(--active) * 0.9)),
        hsl(var(--glow-hue) 80% 45% / calc(var(--active) * 0.3)) 40%,
        transparent 70%
      );
      z-index: -1;
      mask: linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0);
      mask-composite: exclude;
      padding: 1.5px;
      transition: opacity 0.3s ease;
    }
  `;

  return (
    <>
      <style dangerouslySetInnerHTML={{ __html: glowStyles }} />
      <div
        ref={cardRef}
        data-glow-card
        style={inlineStyles}
        className={`
          ${getSizeClasses()}
          ${!customSize ? 'aspect-[3/4]' : ''}
          rounded-2xl
          relative
          grid
          grid-rows-[1fr_auto]
          shadow-[0_1rem_2rem_-1rem_black]
          p-4
          gap-4
          ${className}
        `}
      >
        <div ref={innerRef} />
        {children}
      </div>
    </>
  );
};

export { GlowCard };
