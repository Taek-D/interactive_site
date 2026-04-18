'use client';

import { useEffect, useRef } from 'react';
import { AnimatePresence, motion, useReducedMotion } from 'framer-motion';

type Props = {
  open: boolean;
  onClose: () => void;
  src?: string;
  poster?: string;
  title?: string;
};

/**
 * VideoModal — overlay player for portfolio videos.
 * - Closes on ESC, backdrop click, and close button.
 * - Locks body scroll while open.
 * - Focus ring + aria-modal for a11y.
 */
export function VideoModal({ open, onClose, src, poster, title }: Props) {
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const shouldReduceMotion = useReducedMotion();

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    document.addEventListener('keydown', onKey);
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => {
      document.removeEventListener('keydown', onKey);
      document.body.style.overflow = prevOverflow;
    };
  }, [open, onClose]);

  useEffect(() => {
    if (!open) {
      videoRef.current?.pause();
      return;
    }
    const v = videoRef.current;
    if (v) {
      v.currentTime = 0;
      v.play().catch(() => undefined);
    }
  }, [open]);

  return (
    <AnimatePresence>
      {open ? (
        <motion.div
          role="dialog"
          aria-modal="true"
          aria-label={title ?? 'Video preview'}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.3 }}
          className="fixed inset-0 z-[80] bg-black/90 backdrop-blur-md"
          onClick={onClose}
        >
          <motion.div
            initial={shouldReduceMotion ? { opacity: 0 } : { opacity: 0, scale: 0.98, y: 10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={shouldReduceMotion ? { opacity: 0 } : { opacity: 0, scale: 0.98, y: 10 }}
            transition={{ duration: 0.35, ease: [0.33, 1, 0.68, 1] }}
            onClick={(e) => e.stopPropagation()}
            className="absolute inset-0 flex items-center justify-center p-4 lg:p-10"
          >
            <div className="relative w-full max-w-[1200px] aspect-video overflow-hidden rounded-[var(--radius-section)] bg-[color:var(--color-ink-obsidian)] card-obsidian">
              {src ? (
                <video
                  ref={videoRef}
                  className="absolute inset-0 h-full w-full object-cover"
                  src={src}
                  poster={poster}
                  controls
                  playsInline
                  preload="metadata"
                />
              ) : (
                <div
                  className="absolute inset-0"
                  style={{
                    backgroundImage: poster ? `url(${poster})` : undefined,
                    backgroundSize: 'cover',
                    backgroundPosition: 'center',
                  }}
                />
              )}
              <button
                type="button"
                onClick={onClose}
                aria-label="Close video"
                className="absolute top-4 right-4 inline-flex h-11 w-11 items-center justify-center rounded-full border border-white/30 bg-black/60 text-white backdrop-blur-sm hover:bg-black/80 transition-colors"
              >
                <svg width="16" height="16" viewBox="0 0 16 16" aria-hidden="true">
                  <path d="M4 4 L12 12 M12 4 L4 12" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" />
                </svg>
              </button>
            </div>
          </motion.div>
        </motion.div>
      ) : null}
    </AnimatePresence>
  );
}
