'use client';

import { useEffect, useRef, useState } from 'react';

type Props = {
  /** Number of bars in the waveform. Mobile uses fewer. */
  bars?: number;
  /** Height of the component in px. */
  height?: number;
  /** Color of the bars (CSS color). */
  color?: string;
  /** If true, bars are animated continuously; if false, render a static snapshot. */
  animated?: boolean;
  /** Amplitude multiplier (0–1). */
  intensity?: number;
  /** Optional aria-label; defaults to decorative. */
  ariaLabel?: string;
  className?: string;
};

/**
 * AudioWaveform — SVG-driven animated waveform ornament.
 * Purely visual (no audio playback) per project requirement.
 * Respects prefers-reduced-motion: renders a static snapshot when set.
 */
export function AudioWaveform({
  bars = 96,
  height = 96,
  color = '#ffffff',
  animated = true,
  intensity = 1,
  ariaLabel,
  className,
}: Props) {
  const rafIdRef = useRef<number | null>(null);
  const pathRef = useRef<SVGPathElement | null>(null);
  const seedRef = useRef<number[]>([]);
  const [reduced, setReduced] = useState(false);
  const [viewportW, setViewportW] = useState(1200);

  useEffect(() => {
    const mq = window.matchMedia('(prefers-reduced-motion: reduce)');
    setReduced(mq.matches);
    const onChange = (e: MediaQueryListEvent) => setReduced(e.matches);
    mq.addEventListener('change', onChange);
    const onResize = () => setViewportW(window.innerWidth);
    onResize();
    window.addEventListener('resize', onResize, { passive: true });
    return () => {
      mq.removeEventListener('change', onChange);
      window.removeEventListener('resize', onResize);
    };
  }, []);

  useEffect(() => {
    // Seed deterministic phase offsets for each bar.
    seedRef.current = Array.from({ length: bars }, (_, i) => (i * 137.508) % 360);
  }, [bars]);

  useEffect(() => {
    if (!animated || reduced) return;
    const path = pathRef.current;
    if (!path) return;

    const start = performance.now();
    const W = 1000;
    const H = height;
    const midY = H / 2;
    const maxAmp = midY * 0.92 * intensity;
    const step = W / bars;

    const frame = (now: number) => {
      const t = (now - start) / 1000;
      let d = '';
      for (let i = 0; i < bars; i++) {
        const x = i * step + step / 2;
        const phase = (seedRef.current[i] ?? 0) + t * (0.8 + (i % 7) * 0.05);
        const envelope = Math.sin((i / bars) * Math.PI) ** 1.5; // taper at edges
        const amp =
          (Math.sin(phase * 1.3) * 0.55 + Math.sin(phase * 0.6 + i) * 0.35 + Math.sin(phase * 2.2) * 0.1) *
          maxAmp *
          envelope;
        const y1 = midY - Math.abs(amp);
        const y2 = midY + Math.abs(amp);
        d += `M${x.toFixed(2)} ${y1.toFixed(2)} L${x.toFixed(2)} ${y2.toFixed(2)} `;
      }
      path.setAttribute('d', d);
      rafIdRef.current = requestAnimationFrame(frame);
    };
    rafIdRef.current = requestAnimationFrame(frame);
    return () => {
      if (rafIdRef.current) cancelAnimationFrame(rafIdRef.current);
    };
  }, [animated, bars, height, intensity, reduced]);

  // Static snapshot when reduced-motion or not animated
  const staticPath = (() => {
    if (animated && !reduced) return undefined;
    const W = 1000;
    const midY = height / 2;
    const maxAmp = midY * 0.8 * intensity;
    const step = W / bars;
    let d = '';
    for (let i = 0; i < bars; i++) {
      const x = i * step + step / 2;
      const envelope = Math.sin((i / bars) * Math.PI) ** 1.5;
      const amp =
        (Math.sin(i * 0.42) * 0.6 + Math.sin(i * 0.18) * 0.3 + Math.sin(i * 0.9) * 0.1) * maxAmp * envelope;
      d += `M${x.toFixed(2)} ${(midY - Math.abs(amp)).toFixed(2)} L${x.toFixed(2)} ${(midY + Math.abs(amp)).toFixed(2)} `;
    }
    return d;
  })();

  // Mobile: fewer bars for perf (handled by prop, but we also thin stroke)
  const strokeWidth = viewportW < 768 ? 1.25 : 1.5;

  return (
    <svg
      viewBox={`0 0 1000 ${height}`}
      width="100%"
      height={height}
      className={className}
      preserveAspectRatio="none"
      role={ariaLabel ? 'img' : 'presentation'}
      aria-label={ariaLabel}
      aria-hidden={ariaLabel ? undefined : true}
    >
      <path
        ref={pathRef}
        d={staticPath}
        stroke={color}
        strokeWidth={strokeWidth}
        strokeLinecap="round"
        fill="none"
        opacity={0.72}
      />
    </svg>
  );
}
