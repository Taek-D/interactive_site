'use client';

import Image from 'next/image';
import Link from 'next/link';
import { useRef, useState } from 'react';
import { motion, useInView, useReducedMotion } from 'framer-motion';
import { PORTFOLIO } from '@/lib/portfolio';
import type { PortfolioItem } from '@/lib/portfolio';

// Mobile-first aspect ratios. The `wide` 21/9 cinemascope is too flat
// on phones (text under it gets squeezed against the next card), so we
// fall back to 16/10 below `lg` and only honour 21/9 on desktop where
// the layout has room to breathe.
const ASPECT_CLASSES: Record<PortfolioItem['aspect'], string> = {
  portrait: 'aspect-[3/4]',
  landscape: 'aspect-[16/10]',
  square: 'aspect-square',
  wide: 'aspect-[16/10] lg:aspect-[21/9]',
};

const GRID_CLASSES: Record<string, string> = {
  'atlas-protocol': 'lg:col-span-7 lg:row-span-2',
  'ninefold-path': 'lg:col-span-5 lg:row-span-2',
  solarium: 'lg:col-span-4',
  'dusk-ii': 'lg:col-span-8',
  'koi-requiem': 'lg:col-span-5',
  'field-report': 'lg:col-span-7',
};

export function Portfolio() {
  const headerRef = useRef<HTMLDivElement | null>(null);
  const inView = useInView(headerRef, { once: true, margin: '-10% 0px' });
  const shouldReduceMotion = useReducedMotion();

  return (
    <section
      id="work"
      className="relative bg-[color:var(--color-ink-black)] py-[96px] lg:py-[160px]"
      aria-label="Selected work"
    >
      <div className="mx-auto max-w-[1440px] px-5 lg:px-10">
        <motion.div
          ref={headerRef}
          initial={shouldReduceMotion ? { opacity: 0 } : { opacity: 0, y: 24 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.9, ease: [0.33, 1, 0.68, 1] }}
          className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between"
        >
          <div>
            <div className="font-mono-code text-[color:var(--color-text-whisper)] mb-6">04 · WORK</div>
            <h2 className="font-section-heading text-white max-w-[18ch]">
              Selected signals.
            </h2>
          </div>
          <Link href="/work" className="btn-pill-obsidian self-start lg:self-end">
            <span className="font-button-uppercase">All projects</span>
            <svg width="12" height="12" viewBox="0 0 12 12" aria-hidden="true">
              <path d="M2 6h8M6 2l4 4-4 4" stroke="currentColor" strokeWidth="1.2" fill="none" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </Link>
        </motion.div>

        <div className="mt-14 grid grid-cols-1 gap-5 lg:grid-cols-12 lg:auto-rows-[minmax(220px,auto)] lg:gap-6">
          {PORTFOLIO.map((item, i) => (
            <PortfolioCard key={item.slug} item={item} index={i} />
          ))}
        </div>
      </div>
    </section>
  );
}

function PortfolioCard({ item, index }: { item: PortfolioItem; index: number }) {
  const [hovered, setHovered] = useState(false);
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const cardRef = useRef<HTMLAnchorElement | null>(null);
  const inView = useInView(cardRef, { once: true, margin: '-10% 0px' });
  const shouldReduceMotion = useReducedMotion();

  const gridClass = GRID_CLASSES[item.slug] ?? 'lg:col-span-6';

  const onEnter = () => {
    setHovered(true);
    if (shouldReduceMotion) return;
    const v = videoRef.current;
    if (v) {
      v.currentTime = 0;
      v.play().catch(() => undefined);
    }
  };
  const onLeave = () => {
    setHovered(false);
    const v = videoRef.current;
    if (v) v.pause();
  };

  return (
    <motion.div
      initial={shouldReduceMotion ? { opacity: 0 } : { opacity: 0, y: 40 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.8, ease: [0.33, 1, 0.68, 1], delay: index * 0.05 }}
      className={`group ${gridClass}`}
    >
      <Link
        ref={cardRef}
        href={`/work/${item.slug}`}
        onPointerEnter={onEnter}
        onPointerLeave={onLeave}
        onFocus={onEnter}
        onBlur={onLeave}
        className="relative block w-full h-full overflow-hidden rounded-[var(--radius-large)] bg-[color:var(--color-ink-obsidian)] rim-outline focus:rim-inset"
        data-cursor="hover"
        aria-label={`${item.title} — ${item.client} (${item.discipline})`}
      >
        <div className={`relative w-full ${ASPECT_CLASSES[item.aspect]}`}>
          <Image
            src={item.poster}
            alt=""
            fill
            sizes="(min-width: 1024px) 50vw, 100vw"
            className={[
              'object-cover transition-[opacity,transform] duration-[1200ms] ease-[cubic-bezier(0.33,1,0.68,1)]',
              hovered ? 'scale-[1.04] opacity-50' : 'scale-100 opacity-80',
            ].join(' ')}
            priority={index < 2}
          />
          {item.video && !shouldReduceMotion ? (
            <video
              ref={videoRef}
              className={[
                'absolute inset-0 h-full w-full object-cover transition-opacity duration-700',
                hovered ? 'opacity-100' : 'opacity-0',
              ].join(' ')}
              muted
              loop
              playsInline
              preload="none"
              poster={item.poster}
            >
              <source src={item.video} type="video/mp4" />
            </video>
          ) : null}

          <div
            className="absolute inset-0 transition-opacity duration-700"
            style={{ backgroundColor: item.accent, mixBlendMode: 'screen', opacity: hovered ? 0.8 : 1 }}
            aria-hidden="true"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/10 to-transparent" />
        </div>

        <div className="absolute inset-x-0 bottom-0 p-6 lg:p-8">
          <div className="flex items-center justify-between font-micro text-[color:var(--color-text-muted)] tabular-nums">
            <span>{item.discipline}</span>
            <span>{item.year}</span>
          </div>
          <h3 className="mt-3 font-card-heading text-white">
            {item.title}
          </h3>
          <div className="mt-1 font-body-standard text-[color:var(--color-text-secondary)]">
            {item.client}
          </div>
        </div>

        <div
          className={[
            'absolute top-5 right-5 inline-flex h-10 w-10 items-center justify-center rounded-full border border-white/25 bg-black/50 backdrop-blur-sm transition-[transform,opacity] duration-500',
            hovered ? 'opacity-100 scale-100' : 'opacity-70 scale-90',
          ].join(' ')}
          aria-hidden="true"
        >
          <svg width="14" height="14" viewBox="0 0 14 14">
            <path
              d="M3 3h8v8M3 11 11 3"
              stroke="currentColor"
              strokeWidth="1.2"
              fill="none"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </div>
      </Link>
    </motion.div>
  );
}
