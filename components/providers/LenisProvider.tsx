'use client';

import { useEffect, useState } from 'react';
import Lenis from 'lenis';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

if (typeof window !== 'undefined') {
  gsap.registerPlugin(ScrollTrigger);
}

/**
 * LenisProvider — global smooth-scroll engine.
 * Integrates Lenis with GSAP's ticker so ScrollTrigger stays in lockstep
 * with the smooth-scroll position. This is the officially recommended
 * Lenis + GSAP integration pattern (not a manual rAF loop).
 * Respects prefers-reduced-motion automatically.
 */
export function LenisProvider({ children }: { children: React.ReactNode }) {
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

    // Expose instance for any section-level ScrollTrigger wiring.
    (window as unknown as { __lenis?: Lenis }).__lenis = lenis;

    // Sync Lenis scroll events into ScrollTrigger.
    const onScroll = () => ScrollTrigger.update();
    lenis.on('scroll', onScroll);

    // Drive Lenis from GSAP's ticker — single source of truth for all animation.
    const update = (time: number) => {
      lenis.raf(time * 1000);
    };
    gsap.ticker.add(update);
    gsap.ticker.lagSmoothing(0);

    // Recalculate ScrollTrigger positions after Lenis hooks in.
    ScrollTrigger.refresh();

    return () => {
      lenis.off('scroll', onScroll);
      gsap.ticker.remove(update);
      lenis.destroy();
      delete (window as unknown as { __lenis?: Lenis }).__lenis;
    };
  }, [reducedMotion]);

  return <>{children}</>;
}
