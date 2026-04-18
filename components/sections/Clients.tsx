'use client';

import { useRef } from 'react';
import { motion, useInView, useReducedMotion } from 'framer-motion';

const CLIENTS = [
  'NORTHSTAR STUDIOS',
  'TIDEPOOL GAMES',
  'LUMEN ENTERTAINMENT',
  'FOLDCRAFT',
  'MOTH & MOON',
  'ARCLINE AUDIO',
  'HALCYON',
  'OBLIQUE MEDIA',
  'PARAGON INTERACTIVE',
  'CRESCENT STUDIO',
  'BLUESHIFT GAMES',
  'KOI COLLECTIVE',
];

const METRICS = [
  { n: '412', label: 'Titles shipped' },
  { n: '36', label: 'Languages' },
  { n: '14', label: 'Studio cities' },
  { n: '180+', label: 'Represented artists' },
];

export function Clients() {
  const ref = useRef<HTMLDivElement | null>(null);
  const inView = useInView(ref, { once: true, margin: '-10% 0px' });
  const shouldReduceMotion = useReducedMotion();

  return (
    <section
      id="clients"
      className="relative bg-[color:var(--color-ink-warm)] py-[96px] lg:py-[160px]"
      aria-label="Clients and metrics"
    >
      <div className="mx-auto max-w-[1440px] px-5 lg:px-10">
        <motion.div
          ref={ref}
          initial={shouldReduceMotion ? { opacity: 0 } : { opacity: 0, y: 24 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.9, ease: [0.33, 1, 0.68, 1] }}
          className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between"
        >
          <div>
            <div className="font-mono-code text-[color:var(--color-text-whisper)] mb-6">05 · CLIENTS</div>
            <h2 className="font-section-heading text-white max-w-[20ch]">
              Trusted from tentpole releases
              <br />
              to new worlds in closed beta.
            </h2>
          </div>
          <p className="font-body-standard max-w-[40ch] text-[color:var(--color-text-secondary)]">
            A partial list, stripped of colour — our clients&apos; work speaks
            loudly enough without ours amplifying it.
          </p>
        </motion.div>

        <div className="mt-14 grid grid-cols-2 gap-px overflow-hidden rounded-[var(--radius-section)] border border-[color:var(--color-border-subtle)] sm:grid-cols-3 lg:grid-cols-4">
          {CLIENTS.map((name, i) => (
            <motion.div
              key={name}
              initial={{ opacity: 0 }}
              animate={inView ? { opacity: 1 } : {}}
              transition={{ duration: 0.7, delay: 0.05 * i }}
              className="flex aspect-[2/1] items-center justify-center bg-[color:var(--color-ink-black)] px-4 py-10 font-button-uppercase text-[11px] tracking-[0.22em] text-[color:var(--color-text-secondary)] hover:text-white transition-colors select-none"
            >
              {name}
            </motion.div>
          ))}
        </div>

        <div className="mt-16 grid grid-cols-2 gap-4 lg:mt-24 lg:grid-cols-4 lg:gap-8">
          {METRICS.map((m, i) => (
            <motion.div
              key={m.label}
              initial={shouldReduceMotion ? { opacity: 0 } : { opacity: 0, y: 20 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.8, delay: 0.1 * i, ease: [0.33, 1, 0.68, 1] }}
              className="flex flex-col gap-2 border-t border-[color:var(--color-border-light)] pt-5"
            >
              <span className="font-display-hero text-white tracking-[-0.02em] tabular-nums">{m.n}</span>
              <span className="font-caption text-[color:var(--color-text-muted)]">{m.label}</span>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
