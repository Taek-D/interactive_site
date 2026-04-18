'use client';

import { useEffect, useRef, useState } from 'react';
import Lenis from 'lenis';

/**
 * LenisProvider — global smooth-scroll engine.
 * Wires Lenis ticks into requestAnimationFrame so that GSAP ScrollTrigger
 * can use `lenis.scrollTo` / `lenis.on('scroll', ScrollTrigger.update)` downstream.
 * Respects prefers-reduced-motion automatically.
 */
export function LenisProvider({ children }: { children: React.ReactNode }) {
  const rafIdRef = useRef<number | null>(null);
  const [reducedMotion, setReducedMotion] = useState(false);

  useEffect(() => {
    const media = window.matchMedia('(prefers-reduced-motion: reduce)');
    setReducedMotion(media.matches);
    const onChange = (e: MediaQueryListEvent) => setReducedMotion(e.matches);
    media.addEventListener('change', onChange);
    return () => media.removeEventListener('change', onChange);
  }, []);

  useEffect(() => {
    if (reducedMotion) return;

    const lenis = new Lenis({
      duration: 1.2,
      easing: (t: number) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      orientation: 'vertical',
      gestureOrientation: 'vertical',
      smoothWheel: true,
      wheelMultiplier: 1,
      touchMultiplier: 1.4,
      infinite: false,
    });

    // Expose the instance for ScrollTrigger integration elsewhere.
    (window as unknown as { __lenis?: Lenis }).__lenis = lenis;

    const raf = (time: number) => {
      lenis.raf(time);
      rafIdRef.current = requestAnimationFrame(raf);
    };
    rafIdRef.current = requestAnimationFrame(raf);

    return () => {
      if (rafIdRef.current) cancelAnimationFrame(rafIdRef.current);
      lenis.destroy();
      delete (window as unknown as { __lenis?: Lenis }).__lenis;
    };
  }, [reducedMotion]);

  return <>{children}</>;
}
