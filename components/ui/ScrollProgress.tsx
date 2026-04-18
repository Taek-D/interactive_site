'use client';

import { motion, useScroll, useSpring } from 'framer-motion';

/**
 * ScrollProgress — whisper-thin top-of-page scroll indicator.
 * Uses framer-motion useScroll for a reactive 0–1 progress value,
 * softened with a spring so it feels like sound settling rather than snapping.
 */
export function ScrollProgress() {
  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, {
    stiffness: 120,
    damping: 28,
    restDelta: 0.001,
  });

  return (
    <motion.div
      aria-hidden="true"
      style={{ scaleX }}
      className="fixed top-0 left-0 right-0 z-[70] h-[2px] origin-left bg-gradient-to-r from-white/90 via-white/60 to-[color:var(--color-accent-warm)]"
    />
  );
}
