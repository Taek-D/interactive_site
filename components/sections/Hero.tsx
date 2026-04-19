'use client';

import dynamic from 'next/dynamic';
import Link from 'next/link';
import Image from 'next/image';
import { motion, useReducedMotion } from 'framer-motion';
import { useEffect, useRef, useState } from 'react';
import gsap from 'gsap';
import { useGSAP } from '@gsap/react';
import { SplitText } from 'gsap/SplitText';
import { AudioWaveform } from '@/components/canvas/AudioWaveform';
import { ParticleFieldFallback } from '@/components/canvas/ParticleFieldFallback';
import { readScrollVelocity } from '@/components/canvas/useScrollVelocity';

const ParticleField = dynamic(() => import('@/components/canvas/ParticleField'), {
  ssr: false,
  loading: () => <ParticleFieldFallback className="absolute inset-0 h-full w-full" />,
});

if (typeof window !== 'undefined') {
  gsap.registerPlugin(SplitText);
}

// Unsplash Ken-Burns still is the production default. To enable a looping
// cinematic background, drop any .mp4 into `public/video/hero.mp4` and
// set `HERO_VIDEO_SRC = '/video/hero.mp4'`. External CDN hotlinks
// (Pexels / Coverr / Mixkit) routinely 403 on referrer, so the video
// path is opt-in once a trusted source is wired in.
const HERO_POSTER =
  'https://images.unsplash.com/photo-1520170350707-b2da59970118?auto=format&fit=crop&w=2400&q=80';
const HERO_VIDEO_SRC = '';

export function Hero() {
  const [isDesktop, setIsDesktop] = useState<boolean | null>(null);
  const [videoAvailable, setVideoAvailable] = useState(true);
  const shouldReduceMotion = useReducedMotion();
  const headlineRef = useRef<HTMLHeadingElement | null>(null);

  useEffect(() => {
    const mq = window.matchMedia('(min-width: 768px) and (pointer: fine)');
    const update = () => setIsDesktop(mq.matches);
    update();
    mq.addEventListener('change', update);
    return () => mq.removeEventListener('change', update);
  }, []);

  // GSAP SplitText — character-level entrance stagger.
  // Runs once on mount; disabled entirely under reduced-motion so the
  // headline simply fades in via its CSS default.
  useGSAP(
    () => {
      const el = headlineRef.current;
      if (!el || shouldReduceMotion) return;
      const split = new SplitText(el, { type: 'chars,words', charsClass: 'split-char' });
      gsap.set(el, { perspective: 800 });
      gsap.set(split.chars, { yPercent: 110, rotateX: -55, opacity: 0 });
      gsap.to(split.chars, {
        yPercent: 0,
        rotateX: 0,
        opacity: 1,
        duration: 1.1,
        ease: 'power3.out',
        stagger: 0.022,
        delay: 0.15,
      });
      return () => split.revert();
    },
    { scope: headlineRef, dependencies: [shouldReduceMotion] },
  );

  // Velocity-reactive variable font weight. Inter is already variable —
  // we interpolate `wght` between 100 (resting) and 300 (fast-scroll) so
  // the headline visually "breathes" with scroll cadence.
  useEffect(() => {
    const el = headlineRef.current;
    if (!el || shouldReduceMotion) return;
    let rafId = 0;
    let smoothed = 0;
    const tick = () => {
      const v = Math.abs(readScrollVelocity());
      smoothed += (v - smoothed) * 0.14;
      const w = Math.max(100, Math.min(300, 100 + smoothed * 4.5));
      el.style.fontVariationSettings = `'wght' ${w.toFixed(0)}`;
      rafId = requestAnimationFrame(tick);
    };
    tick();
    return () => cancelAnimationFrame(rafId);
  }, [shouldReduceMotion]);

  return (
    <section
      id="hero"
      className="relative min-h-[100svh] w-full overflow-hidden bg-[color:var(--color-ink-black)]"
    >
      {/* Layer 1 — Cinematic still (Unsplash) as the always-present baseline,
          with an optional stock-video overlay that plays on top when the
          external CDN allows hotlinking. The video hides itself via onError
          if the source 403s, leaving the Ken-Burns image in place. */}
      <motion.div
        className="absolute inset-0 opacity-55"
        initial={shouldReduceMotion ? { scale: 1 } : { scale: 1.04 }}
        animate={shouldReduceMotion ? { scale: 1 } : { scale: 1.12 }}
        transition={{
          duration: 22,
          ease: 'linear',
          repeat: Infinity,
          repeatType: 'reverse',
        }}
      >
        <Image
          src={HERO_POSTER}
          alt=""
          fill
          priority
          className="object-cover"
          sizes="100vw"
        />
        {HERO_VIDEO_SRC && !shouldReduceMotion && videoAvailable ? (
          <video
            className="absolute inset-0 h-full w-full object-cover"
            autoPlay
            muted
            loop
            playsInline
            preload="auto"
            aria-hidden="true"
            onError={() => setVideoAvailable(false)}
          >
            <source src={HERO_VIDEO_SRC} type="video/mp4" />
          </video>
        ) : null}
      </motion.div>
      <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-black/30 to-black pointer-events-none" />
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(0,0,0,0)_0%,rgba(0,0,0,0.85)_85%)] pointer-events-none" />

      {/* Layer 2 — Particles (Three.js desktop, Canvas2D mobile) */}
      <div className="absolute inset-0 opacity-90 mix-blend-screen">
        {isDesktop && !shouldReduceMotion ? (
          <ParticleField className="absolute inset-0 h-full w-full" opacity={0.6} />
        ) : (
          <ParticleFieldFallback className="absolute inset-0 h-full w-full" />
        )}
      </div>

      {/* Layer 3 — Content */}
      <div className="relative z-10 mx-auto flex min-h-[100svh] max-w-[1440px] flex-col justify-between px-5 lg:px-10 pb-12 pt-[120px] lg:pt-[160px]">
        <div className="flex items-center gap-3 font-micro text-[color:var(--color-text-muted)]">
          <span className="h-[1px] w-10 bg-white/30" />
          <span>SEOUL · LOS ANGELES · TOKYO</span>
        </div>

        <div className="flex flex-col gap-10 lg:gap-14">
          <h1
            ref={headlineRef}
            className="font-display-mega text-white max-w-[18ch]"
            style={{ fontVariationSettings: "'wght' 100" }}
          >
            Sound that travels the world.
          </h1>

          <div className="flex flex-col-reverse lg:flex-row lg:items-end lg:justify-between gap-10">
            <motion.p
              initial={shouldReduceMotion ? { opacity: 0 } : { opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 1, ease: [0.33, 1, 0.68, 1], delay: 0.5 }}
              className="font-body max-w-[46ch] text-[color:var(--color-text-secondary)]"
            >
              We craft sound, localize performances, and represent the voices
              behind the worlds biggest games and entertainment brands —
              orchestrating every frequency between our artists and your
              audience.
            </motion.p>

            <motion.div
              initial={shouldReduceMotion ? { opacity: 0 } : { opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 1, ease: [0.33, 1, 0.68, 1], delay: 0.75 }}
              className="flex flex-wrap items-center gap-3"
            >
              <Link href="/work" className="btn-pill-warm">
                <span className="font-button-uppercase">Explore work</span>
                <svg width="14" height="14" viewBox="0 0 14 14" aria-hidden="true">
                  <path d="M2 7h9M7 3l4 4-4 4" stroke="currentColor" strokeWidth="1.3" fill="none" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </Link>
              <Link href="/#services" className="btn-pill-obsidian">
                <span>What we do</span>
              </Link>
            </motion.div>
          </div>
        </div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1.2, delay: 1.1 }}
          className="mt-16"
        >
          <AudioWaveform
            bars={120}
            height={88}
            color="#ffffff"
            intensity={0.7}
            className="w-full opacity-60"
          />
          <div className="mt-3 flex items-center justify-between font-mono-code text-[color:var(--color-text-whisper)] tabular-nums">
            <span>01 · HERO</span>
            <span className="hidden sm:inline">SCROLL TO LISTEN</span>
            <span>00:00 / ∞</span>
          </div>
        </motion.div>
      </div>

      {/* Bottom hairline */}
      <div className="absolute inset-x-0 bottom-0 h-px bg-[color:var(--color-border-subtle)] z-10" />
    </section>
  );
}
