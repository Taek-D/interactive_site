'use client';

import { useRef } from 'react';
import Link from 'next/link';
import { motion, useInView } from 'framer-motion';
import { AudioWaveform } from '@/components/canvas/AudioWaveform';

const CONTACT_ROWS = [
  { label: 'General', value: 'hello@soundstage.studio', href: 'mailto:hello@soundstage.studio' },
  { label: 'New business', value: 'projects@soundstage.studio', href: 'mailto:projects@soundstage.studio' },
  { label: 'Artist representation', value: 'artists@soundstage.studio', href: 'mailto:artists@soundstage.studio' },
  { label: 'Press', value: 'press@soundstage.studio', href: 'mailto:press@soundstage.studio' },
];

const OFFICES = [
  { city: 'Seoul', line: 'Seongdong-gu, Sound District 12' },
  { city: 'Los Angeles', line: 'Burbank Media Row 221' },
  { city: 'Tokyo', line: 'Shibuya Stage Lane 7' },
  { city: 'Berlin', line: 'Kreuzberg Wellenhaus' },
];

export function Contact() {
  const ref = useRef<HTMLDivElement | null>(null);
  const inView = useInView(ref, { once: true, margin: '-10% 0px' });

  return (
    <section
      id="contact"
      className="relative bg-[color:var(--color-ink-black)] py-[96px] lg:py-[192px]"
      aria-label="Contact"
    >
      <div className="mx-auto max-w-[1440px] px-5 lg:px-10">
        <motion.div
          ref={ref}
          initial={{ opacity: 0, y: 30 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 1, ease: [0.33, 1, 0.68, 1] }}
          className="flex flex-col gap-10 lg:gap-14"
        >
          <div className="flex items-center gap-4 font-mono-code text-[color:var(--color-text-whisper)]">
            <span className="h-[1px] w-10 bg-white/30" />
            <span>06 · CONTACT</span>
          </div>

          <h2 className="font-display-hero text-white max-w-[22ch]">
            Let&apos;s shape the next track that people will remember.
          </h2>

          <AudioWaveform
            bars={140}
            height={72}
            intensity={0.8}
            className="w-full opacity-60"
          />
        </motion.div>

        <div className="mt-16 grid grid-cols-1 gap-10 lg:mt-24 lg:grid-cols-12 lg:gap-16">
          <div className="lg:col-span-7">
            <ul className="divide-y divide-[color:var(--color-border-subtle)] border-y border-[color:var(--color-border-subtle)]">
              {CONTACT_ROWS.map((row) => (
                <li key={row.label}>
                  <Link
                    href={row.href}
                    className="group grid grid-cols-12 items-center gap-4 py-6 lg:py-8 cursor-pointer min-w-0"
                  >
                    <span className="col-span-12 sm:col-span-3 font-mono-code text-[color:var(--color-text-muted)]">
                      {row.label}
                    </span>
                    <span
                      className="col-span-11 sm:col-span-8 text-white tracking-[-0.02em] leading-[1.05] group-hover:text-[color:var(--color-accent-warm)] transition-colors font-light"
                      style={{
                        fontFamily: 'var(--font-body)',
                        fontSize: 'clamp(22px, 2.6vw, 44px)',
                        letterSpacing: '-0.01em',
                        wordBreak: 'break-word',
                      }}
                    >
                      {row.value}
                    </span>
                    <span className="col-span-1 flex justify-end text-white/60 group-hover:text-white transition-colors">
                      <svg width="22" height="22" viewBox="0 0 22 22" aria-hidden="true">
                        <path
                          d="M5 5 L17 5 L17 17 M17 5 L5 17"
                          stroke="currentColor"
                          strokeWidth="1.1"
                          fill="none"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                      </svg>
                    </span>
                  </Link>
                </li>
              ))}
            </ul>

            <div className="mt-10 flex flex-wrap gap-3">
              <Link href="mailto:projects@soundstage.studio" className="btn-pill-warm">
                <span className="font-button-uppercase">Start a project</span>
                <svg width="12" height="12" viewBox="0 0 12 12" aria-hidden="true">
                  <path d="M2 6h8M6 2l4 4-4 4" stroke="currentColor" strokeWidth="1.2" fill="none" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </Link>
              <Link href="/work" className="btn-pill-obsidian">
                View our work
              </Link>
            </div>
          </div>

          <div className="lg:col-span-5">
            <div className="font-mono-code text-[color:var(--color-text-whisper)] mb-6">OFFICES</div>
            <ul className="flex flex-col gap-5">
              {OFFICES.map((o) => (
                <li key={o.city} className="flex items-start justify-between gap-6 border-b border-[color:var(--color-border-subtle)] pb-5">
                  <span className="font-card-heading text-white tracking-[-0.01em]">{o.city}</span>
                  <span className="font-body-standard text-[color:var(--color-text-muted)] text-right max-w-[22ch]">
                    {o.line}
                  </span>
                </li>
              ))}
            </ul>

            <div className="mt-12 flex flex-col gap-2 font-body-standard text-[color:var(--color-text-muted)]">
              <span>© {new Date().getFullYear()} SOUNDSTAGE Studio</span>
              <span>All artists represented exclusively.</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
