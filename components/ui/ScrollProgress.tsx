'use client';

import { useEffect, useState } from 'react';
import { motion, useScroll, useSpring } from 'framer-motion';

const BAR_CLASS =
  'fixed top-0 left-0 right-0 z-[70] h-[2px] origin-left bg-gradient-to-r from-white/90 via-white/60 to-[color:var(--color-accent-warm)]';

/**
 * ScrollProgress — whisper-thin top-of-page scroll indicator.
 *
 * Progressive enhancement:
 *   • Chromium 115+ (CSS `animation-timeline: scroll()`) → pure CSS,
 *     driven by the native scroller. Zero JS per frame.
 *   • Everywhere else → Framer Motion useScroll + spring, which keeps
 *     the same "sound settling" feel.
 *
 * Both paths share the gradient, height, and z-index, so the visual
 * is identical across browsers.
 */
export function ScrollProgress() {
  const [cssScrollTimeline, setCssScrollTimeline] = useState(false);
  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, {
    stiffness: 120,
    damping: 28,
    restDelta: 0.001,
  });

  useEffect(() => {
    setCssScrollTimeline(
      typeof CSS !== 'undefined' && CSS.supports('animation-timeline: scroll()'),
    );
  }, []);

  if (cssScrollTimeline) {
    return (
      <div
        aria-hidden="true"
        className={`${BAR_CLASS} scroll-progress-native`}
      />
    );
  }

  return (
    <motion.div
      aria-hidden="true"
      style={{ scaleX }}
      className={BAR_CLASS}
    />
  );
}
