import { AudioWaveform } from '@/components/canvas/AudioWaveform';

/**
 * Root loading state. Rendered while the home page (or any nested
 * segment without a closer loading.tsx) suspends. Mirrors the dark
 * canvas + waveform vocabulary of the rest of the system so the
 * transition feels continuous, not interrupted.
 */
export default function Loading() {
  return (
    <div
      role="status"
      aria-live="polite"
      aria-label="Loading"
      className="fixed inset-0 z-[60] flex items-center justify-center bg-[color:var(--color-ink-black)]"
    >
      <div className="flex flex-col items-center gap-6">
        <AudioWaveform
          bars={64}
          height={56}
          intensity={0.7}
          className="w-[min(420px,72vw)] opacity-70"
        />
        <span className="font-mono-code tracking-[0.18em] text-[color:var(--color-text-muted)] text-[11px] uppercase">
          Loading signal
        </span>
      </div>
    </div>
  );
}
