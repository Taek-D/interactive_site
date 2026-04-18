'use client';

import { usePathname } from 'next/navigation';
import { AnimatePresence, motion } from 'framer-motion';
import type { ReactNode } from 'react';

/**
 * PageTransition — route-level crossfade + subtle slide driven by Framer Motion.
 * Uses AnimatePresence with `mode="wait"` so the outgoing page fully unmounts
 * before the next one mounts, preventing layout thrash during the crossfade.
 */
export function PageTransition({ children }: { children: ReactNode }) {
  const pathname = usePathname();

  return (
    <AnimatePresence mode="wait" initial={false}>
      <motion.main
        key={pathname}
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -12 }}
        transition={{
          duration: 0.55,
          ease: [0.33, 1, 0.68, 1],
        }}
        className="min-h-screen"
      >
        {children}
      </motion.main>
    </AnimatePresence>
  );
}
