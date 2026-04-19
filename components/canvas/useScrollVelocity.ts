'use client';

import { useEffect, useRef } from 'react';

type LenisLike = { velocity?: number };

/**
 * Reads the current Lenis scroll velocity (pixels / frame) that
 * LenisProvider publishes on `window.__lenis`. Returns 0 when Lenis
 * is disabled (prefers-reduced-motion, SSR, or before mount).
 */
export function readScrollVelocity(): number {
  if (typeof window === 'undefined') return 0;
  const lenis = (window as unknown as { __lenis?: LenisLike }).__lenis;
  return lenis?.velocity ?? 0;
}

/**
 * useScrollVelocityRef — a mutable ref that tracks Lenis scroll velocity
 * on every animation frame. Use inside components that already have a
 * rAF / GSAP ticker loop and need to sample velocity without re-rendering.
 */
export function useScrollVelocityRef() {
  const ref = useRef(0);
  useEffect(() => {
    let rafId = 0;
    const tick = () => {
      ref.current = readScrollVelocity();
      rafId = requestAnimationFrame(tick);
    };
    tick();
    return () => cancelAnimationFrame(rafId);
  }, []);
  return ref;
}
