/**
 * /work index loading state — a low-noise skeleton that matches the
 * actual page rhythm (header + asymmetric masonry) so layout shift is
 * minimised when content swaps in.
 */
export default function Loading() {
  return (
    <div
      role="status"
      aria-live="polite"
      aria-label="Loading work"
      className="bg-[color:var(--color-ink-black)] pt-[120px] lg:pt-[160px]"
    >
      <div className="mx-auto max-w-[1440px] px-5 lg:px-10">
        <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
          <div className="flex flex-col gap-6">
            <div className="h-[14px] w-32 rounded-full bg-white/5" />
            <div className="h-[44px] w-[min(420px,80vw)] rounded-md bg-white/5" />
          </div>
          <div className="flex gap-2">
            {Array.from({ length: 4 }).map((_, i) => (
              <div key={i} className="h-9 w-20 rounded-full bg-white/5" />
            ))}
          </div>
        </div>

        <div className="mt-14 grid grid-cols-1 gap-5 lg:grid-cols-12 lg:auto-rows-[minmax(220px,auto)] lg:gap-6 pb-[128px]">
          {/* Static class strings so Tailwind JIT can scan them. */}
          {['lg:col-span-7', 'lg:col-span-5', 'lg:col-span-4', 'lg:col-span-8', 'lg:col-span-5', 'lg:col-span-7'].map(
            (span, i) => (
              <div
                key={i}
                className={`${span} aspect-[16/10] lg:aspect-auto lg:min-h-[220px] rounded-[var(--radius-large)] bg-[color:var(--color-ink-obsidian)] rim-outline animate-pulse`}
              />
            ),
          )}
        </div>
      </div>
      <span className="sr-only">Loading work index</span>
    </div>
  );
}
