'use client';

import dynamic from 'next/dynamic';
import { useEffect, useRef, useState } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { AudioWaveform } from '@/components/canvas/AudioWaveform';

const Scene3D = dynamic(() => import('@/components/canvas/Scene3D'), {
  ssr: false,
  loading: () => null,
});

if (typeof window !== 'undefined') {
  gsap.registerPlugin(ScrollTrigger);
}

type Beat = {
  index: string;
  headline: string;
  body: string;
};

const BEATS: Beat[] = [
  {
    index: '02 / 01',
    headline: 'A single sound\ncan shape a world.',
    body: 'From the hum of an ancient machine to the breath of an unseen hero, we compose the invisible architecture that turns a game into a place.',
  },
  {
    index: '02 / 02',
    headline: 'A voice, reborn\nin every language.',
    body: 'Our localization studios preserve performance across 36 languages — capturing nuance, cadence, and character so every region hears the same heartbeat.',
  },
  {
    index: '02 / 03',
    headline: 'Artists behind\nthe greatest cues.',
    body: 'We represent the composers, voice actors, and sound designers whose work defines the era — pairing them with the stories that deserve them.',
  },
  {
    index: '02 / 04',
    headline: 'One studio.\nEvery frequency.',
    body: 'Production, localization, and talent — orchestrated as one signal from concept to final master.',
  },
];

export function Scrolltelling() {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const pinRef = useRef<HTMLDivElement | null>(null);
  const beatRefs = useRef<Array<HTMLDivElement | null>>([]);
  const [progress, setProgress] = useState(0);
  const [activeBeat, setActiveBeat] = useState(0);

  useEffect(() => {
    const container = containerRef.current;
    const pin = pinRef.current;
    if (!container || !pin) return;

    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    const ctx = gsap.context(() => {
      // Integrate Lenis with ScrollTrigger (instance exposed by LenisProvider)
      const lenis = (window as unknown as { __lenis?: { on: (e: string, fn: () => void) => void } }).__lenis;
      if (lenis) lenis.on('scroll', ScrollTrigger.update);

      // Initial states: beats 1..n hidden
      beatRefs.current.forEach((el, i) => {
        if (!el) return;
        gsap.set(el, { autoAlpha: i === 0 ? 1 : 0, y: i === 0 ? 0 : 40 });
      });

      const st = ScrollTrigger.create({
        trigger: container,
        start: 'top top',
        end: () => `+=${window.innerHeight * BEATS.length}`,
        pin: pin,
        scrub: reduced ? false : 0.6,
        onUpdate: (self) => {
          setProgress(self.progress);
          const idx = Math.min(
            BEATS.length - 1,
            Math.floor(self.progress * BEATS.length),
          );
          setActiveBeat(idx);
        },
        anticipatePin: 1,
      });

      // Cross-fade beats with a master timeline
      if (!reduced) {
        const tl = gsap.timeline({
          scrollTrigger: {
            trigger: container,
            start: 'top top',
            end: () => `+=${window.innerHeight * BEATS.length}`,
            scrub: 0.6,
          },
        });

        for (let i = 1; i < BEATS.length; i++) {
          const prev = beatRefs.current[i - 1];
          const next = beatRefs.current[i];
          if (!prev || !next) continue;
          tl.to(
            prev,
            { autoAlpha: 0, y: -40, duration: 0.5, ease: 'power2.inOut' },
            i - 1,
          ).fromTo(
            next,
            { autoAlpha: 0, y: 40 },
            { autoAlpha: 1, y: 0, duration: 0.5, ease: 'power2.out' },
            i - 1,
          );
        }
      }

      return () => {
        st.kill();
      };
    }, container);

    return () => ctx.revert();
  }, []);

  return (
    <section
      id="scrolltelling"
      ref={containerRef}
      className="relative bg-[color:var(--color-ink-warm)]"
      aria-label="Brand story, scrolling stage"
    >
      <div
        ref={pinRef}
        className="relative h-[100svh] w-full overflow-hidden"
      >
        {/* Background — subtle noise + waveform watermark */}
        <div
          aria-hidden="true"
          className="absolute inset-0 opacity-30"
          style={{
            backgroundImage:
              'radial-gradient(ellipse at 20% 10%, rgba(255,248,235,0.05), transparent 60%), radial-gradient(ellipse at 80% 90%, rgba(127,255,255,0.03), transparent 55%)',
          }}
        />

        {/* 3D orbiting object */}
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
          <Scene3D className="aspect-square w-[72vmin] max-w-[780px]" progress={progress} />
        </div>

        {/* Content grid */}
        <div className="relative z-10 mx-auto flex h-full max-w-[1440px] flex-col px-5 lg:px-10 py-20 lg:py-28">
          <div className="flex items-center justify-between font-mono-code text-[color:var(--color-text-whisper)]">
            <span>02 · STORY</span>
            <div className="flex gap-1.5">
              {BEATS.map((_, i) => (
                <span
                  key={i}
                  className={[
                    'h-[2px] w-8 transition-colors duration-500',
                    i <= activeBeat ? 'bg-white' : 'bg-white/20',
                  ].join(' ')}
                />
              ))}
            </div>
          </div>

          <div className="relative mt-auto max-w-[900px]">
            {BEATS.map((beat, i) => (
              <div
                key={beat.index}
                ref={(el) => {
                  beatRefs.current[i] = el;
                }}
                className="absolute inset-x-0 bottom-0"
              >
                <div className="font-mono-code text-[color:var(--color-text-muted)] mb-6">
                  {beat.index}
                </div>
                <h2 className="font-display-hero text-white whitespace-pre-line max-w-[22ch]">
                  {beat.headline}
                </h2>
                <p className="mt-8 font-body max-w-[52ch] text-[color:var(--color-text-secondary)]">
                  {beat.body}
                </p>
              </div>
            ))}
            {/* Spacer to reserve height so absolute beats don't collapse layout */}
            <div className="invisible">
              <div className="font-mono-code mb-6">00 / 00</div>
              <h2 className="font-display-hero whitespace-pre-line max-w-[22ch]">
                {'Placeholder headline\nwith two lines reserved.'}
              </h2>
              <p className="mt-8 font-body max-w-[52ch]">
                {BEATS[0]?.body}
              </p>
            </div>
          </div>

          <AudioWaveform
            bars={80}
            height={48}
            className="mt-10 opacity-40"
            intensity={0.4 + progress * 0.8}
          />
        </div>
      </div>
    </section>
  );
}
