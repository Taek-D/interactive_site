'use client';

import { useEffect, useRef, useState } from 'react';

/**
 * CursorTrail — desktop-only custom cursor.
 * - Disabled on touch devices (pointer: coarse) and reduced-motion users.
 * - Smoothly follows pointer with a lightweight rAF lerp.
 * - Expands/morphs when hovering interactive elements (buttons, a, [data-cursor="hover"]).
 */
export function CursorTrail() {
  const dotRef = useRef<HTMLDivElement | null>(null);
  const ringRef = useRef<HTMLDivElement | null>(null);
  const [enabled, setEnabled] = useState(false);
  const [hover, setHover] = useState(false);

  useEffect(() => {
    const fine = window.matchMedia('(pointer: fine)').matches;
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    setEnabled(fine && !reduce);
  }, []);

  useEffect(() => {
    if (!enabled) return;
    const dot = dotRef.current;
    const ring = ringRef.current;
    if (!dot || !ring) return;

    const pos = { x: -100, y: -100 };
    const ringPos = { x: -100, y: -100 };
    let rafId = 0;

    const onMove = (e: PointerEvent) => {
      pos.x = e.clientX;
      pos.y = e.clientY;
    };

    const onOver = (e: Event) => {
      const target = e.target as HTMLElement | null;
      if (!target) return;
      const interactive =
        target.closest('a, button, [role="button"], input, textarea, select, [data-cursor="hover"]');
      setHover(Boolean(interactive));
    };

    const tick = () => {
      ringPos.x += (pos.x - ringPos.x) * 0.18;
      ringPos.y += (pos.y - ringPos.y) * 0.18;
      dot.style.transform = `translate3d(${pos.x - 3}px, ${pos.y - 3}px, 0)`;
      ring.style.transform = `translate3d(${ringPos.x - 16}px, ${ringPos.y - 16}px, 0)`;
      rafId = requestAnimationFrame(tick);
    };

    window.addEventListener('pointermove', onMove, { passive: true });
    window.addEventListener('pointerover', onOver, { passive: true });
    rafId = requestAnimationFrame(tick);

    return () => {
      window.removeEventListener('pointermove', onMove);
      window.removeEventListener('pointerover', onOver);
      cancelAnimationFrame(rafId);
    };
  }, [enabled]);

  if (!enabled) return null;

  return (
    <div className="pointer-events-none fixed inset-0 z-[60] mix-blend-difference" aria-hidden="true">
      <div
        ref={dotRef}
        className="absolute h-[6px] w-[6px] rounded-full bg-white will-change-transform"
      />
      <div
        ref={ringRef}
        className={[
          'absolute rounded-full border border-white/70 transition-[width,height,border-color,opacity] duration-300 will-change-transform',
          hover ? 'h-16 w-16 border-white' : 'h-8 w-8',
        ].join(' ')}
      />
    </div>
  );
}
