'use client';

import { useRef } from 'react';
import { motion, useInView } from 'framer-motion';
import { AudioWaveform } from '@/components/canvas/AudioWaveform';

type Service = {
  id: string;
  index: string;
  title: string;
  lead: string;
  points: string[];
};

const SERVICES: Service[] = [
  {
    id: 'sound',
    index: '01',
    title: 'Sound Production',
    lead: 'Original scores, adaptive game audio, and cinematic mixes — engineered for every listening surface from mobile bud to home theatre.',
    points: [
      'Original score & adaptive music',
      'Sound design & Foley',
      'Implementation for Wwise / FMOD',
      'Atmos & immersive audio mastering',
    ],
  },
  {
    id: 'localization',
    index: '02',
    title: 'Localization',
    lead: 'Voice-over production across 36 languages with the same performance integrity as the source — casting, direction, recording, mixing, and QA under one roof.',
    points: [
      'Casting & talent direction',
      'Studio recording in 14 cities',
      'Lip-sync & performance matching',
      'LQA / audio QA at ship scale',
    ],
  },
  {
    id: 'artist',
    index: '03',
    title: 'Artist Management',
    lead: 'Representation for the composers, voice actors, and sound designers who are shaping the next decade of interactive storytelling.',
    points: [
      'Creative representation',
      'Commercial negotiation',
      'Long-form project strategy',
      'Press, awards, and publicity',
    ],
  },
];

export function Services() {
  return (
    <section
      id="services"
      className="relative bg-[color:var(--color-ink-black)] py-[96px] lg:py-[192px]"
      aria-label="Services"
    >
      <div className="mx-auto max-w-[1440px] px-5 lg:px-10">
        <header className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <div className="font-mono-code text-[color:var(--color-text-whisper)] mb-6">03 · SERVICES</div>
            <h2 className="font-section-heading text-white max-w-[18ch]">
              Three disciplines.
              <br />
              One signal chain.
            </h2>
          </div>
          <p className="font-body-standard max-w-[42ch] text-[color:var(--color-text-secondary)]">
            Every service is built on the same principle: the fewest possible
            hands between the artist and the audience, and no compromise on
            fidelity.
          </p>
        </header>

        <ol className="mt-20 flex flex-col divide-y divide-[color:var(--color-border-subtle)] border-y border-[color:var(--color-border-subtle)]">
          {SERVICES.map((service, i) => (
            <ServiceRow key={service.id} service={service} index={i} />
          ))}
        </ol>
      </div>
    </section>
  );
}

function ServiceRow({ service, index }: { service: Service; index: number }) {
  const ref = useRef<HTMLLIElement | null>(null);
  const inView = useInView(ref, { once: true, margin: '-20% 0px' });

  return (
    <motion.li
      ref={ref}
      initial={{ opacity: 0, y: 32 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.9, ease: [0.33, 1, 0.68, 1], delay: index * 0.08 }}
      className="group relative grid grid-cols-1 lg:grid-cols-12 items-start gap-6 py-10 lg:py-16"
    >
      <div className="lg:col-span-1 font-mono-code text-[color:var(--color-text-muted)]">
        {service.index}
      </div>

      <div className="lg:col-span-4">
        <h3 className="font-display-hero text-white leading-[1.02] tracking-[-0.02em]">
          {service.title}
        </h3>
      </div>

      <div className="lg:col-span-5 flex flex-col gap-6">
        <p className="font-body max-w-[48ch] text-[color:var(--color-text-secondary)]">
          {service.lead}
        </p>
        <ul className="flex flex-col gap-2 font-body-standard text-[color:var(--color-text-muted)]">
          {service.points.map((p) => (
            <li key={p} className="flex items-center gap-3">
              <span className="h-px w-6 bg-white/40" />
              <span>{p}</span>
            </li>
          ))}
        </ul>
      </div>

      <div className="lg:col-span-2 mt-6 lg:mt-2 self-start">
        <AudioWaveform
          bars={40}
          height={56}
          intensity={0.55}
          className="w-full opacity-70"
        />
      </div>
    </motion.li>
  );
}
