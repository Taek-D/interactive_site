'use client';

import dynamic from 'next/dynamic';
import Link from 'next/link';
import Image from 'next/image';
import { motion, useReducedMotion } from 'framer-motion';
import { useEffect, useState } from 'react';
import { AudioWaveform } from '@/components/canvas/AudioWaveform';
import { ParticleFieldFallback } from '@/components/canvas/ParticleFieldFallback';

const ParticleField = dynamic(() => import('@/components/canvas/ParticleField'), {
  ssr: false,
  loading: () => <ParticleFieldFallback className="absolute inset-0 h-full w-full" />,
});

export function Hero() {
  const [isDesktop, setIsDesktop] = useState<boolean | null>(null);
  const shouldReduceMotion = useReducedMotion();

  useEffect(() => {
    const mq = window.matchMedia('(min-width: 768px) and (pointer: fine)');
    const update = () => setIsDesktop(mq.matches);
    update();
    mq.addEventListener('change', update);
    return () => mq.removeEventListener('change', update);
  }, []);

  return (
    <section
      id="hero"
      className="relative min-h-[100svh] w-full overflow-hidden bg-[color:var(--color-ink-black)]"
    >
      {/* Layer 1 — Cinematic still with a slow Ken Burns zoom (feels like a video) */}
      <motion.div
        className="absolute inset-0 opacity-55"
        initial={shouldReduceMotion ? { scale: 1 } : { scale: 1.08 }}
        animate={shouldReduceMotion ? { scale: 1 } : { scale: 1.18 }}
        transition={{
          duration: 22,
          ease: 'linear',
          repeat: Infinity,
          repeatType: 'reverse',
        }}
      >
        <Image
          src="https://images.unsplash.com/photo-1520170350707-b2da59970118?auto=format&fit=crop&w=2400&q=80"
          alt=""
          fill
          priority
          className="object-cover"
          sizes="100vw"
        />
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
          <motion.h1
            initial={shouldReduceMotion ? { opacity: 0 } : { opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1.2, ease: [0.33, 1, 0.68, 1], delay: 0.1 }}
            className="font-display-mega text-white max-w-[18ch]"
          >
            Sound that travels the world.
          </motion.h1>

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
