'use client';

import Image from 'next/image';
import Link from 'next/link';
import { useMemo, useState } from 'react';
import { motion } from 'framer-motion';
import { PORTFOLIO, DISCIPLINES } from '@/lib/portfolio';

export default function WorkIndexPage() {
  const [filter, setFilter] = useState<(typeof DISCIPLINES)[number]>('All');
  const filtered = useMemo(
    () => (filter === 'All' ? PORTFOLIO : PORTFOLIO.filter((p) => p.discipline === filter)),
    [filter],
  );

  return (
    <div className="bg-[color:var(--color-ink-black)] pt-[120px] lg:pt-[160px]">
      <div className="mx-auto max-w-[1440px] px-5 lg:px-10">
        <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <div className="font-mono-code text-[color:var(--color-text-whisper)] mb-6">INDEX · WORK</div>
            <h1 className="font-display-hero text-white max-w-[22ch]">
              Every title, stripped to its waveform.
            </h1>
          </div>

          <div className="flex flex-wrap gap-2">
            {DISCIPLINES.map((d) => {
              const active = filter === d;
              return (
                <button
                  key={d}
                  type="button"
                  onClick={() => setFilter(d)}
                  className={[
                    'font-button-uppercase rounded-full px-4 py-2 text-[12px] transition-colors cursor-pointer',
                    active
                      ? 'bg-white text-black'
                      : 'bg-transparent border border-[color:var(--color-border-light)] text-[color:var(--color-text-secondary)] hover:text-white',
                  ].join(' ')}
                  aria-pressed={active}
                >
                  {d}
                </button>
              );
            })}
          </div>
        </div>

        <motion.ul
          layout
          className="mt-14 grid grid-cols-1 gap-5 lg:grid-cols-12 lg:auto-rows-[minmax(220px,auto)] lg:gap-6 pb-[128px]"
        >
          {filtered.map((item, i) => {
            const span =
              item.aspect === 'wide'
                ? 'lg:col-span-8'
                : item.aspect === 'portrait'
                  ? 'lg:col-span-5'
                  : item.aspect === 'square'
                    ? 'lg:col-span-4'
                    : 'lg:col-span-7';
            const aspect =
              item.aspect === 'portrait'
                ? 'aspect-[3/4]'
                : item.aspect === 'landscape'
                  ? 'aspect-[16/10]'
                  : item.aspect === 'square'
                    ? 'aspect-square'
                    // 21/9 is too flat on phones; only apply at lg+
                    : 'aspect-[16/10] lg:aspect-[21/9]';

            return (
              <motion.li
                layout
                key={item.slug}
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: i * 0.04, ease: [0.33, 1, 0.68, 1] }}
                className={`group ${span}`}
              >
                <Link
                  href={`/work/${item.slug}`}
                  className="relative block h-full w-full overflow-hidden rounded-[var(--radius-large)] bg-[color:var(--color-ink-obsidian)] rim-outline cursor-pointer"
                  data-cursor="hover"
                >
                  <div className={`relative w-full ${aspect}`}>
                    <Image
                      src={item.poster}
                      alt=""
                      fill
                      sizes="(min-width: 1024px) 50vw, 100vw"
                      className="object-cover opacity-80 transition-[transform,opacity] duration-[1200ms] ease-[cubic-bezier(0.33,1,0.68,1)] group-hover:opacity-55 group-hover:scale-[1.03]"
                    />
                    <div
                      className="absolute inset-0 mix-blend-screen"
                      style={{ backgroundColor: item.accent }}
                      aria-hidden="true"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent" />
                  </div>
                  <div className="absolute inset-x-0 bottom-0 p-6 lg:p-8">
                    <div className="flex items-center justify-between font-micro text-[color:var(--color-text-muted)]">
                      <span>{item.discipline}</span>
                      <span>{item.year}</span>
                    </div>
                    <h3 className="mt-3 font-card-heading text-white">{item.title}</h3>
                    <div className="mt-1 font-body-standard text-[color:var(--color-text-secondary)]">
                      {item.client}
                    </div>
                  </div>
                </Link>
              </motion.li>
            );
          })}
        </motion.ul>
      </div>
    </div>
  );
}
