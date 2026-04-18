/**
 * /work/[slug] loading state — mirrors the detail page's hero + 4/8 body
 * grid. Keeps the user oriented while the case-study chunk loads.
 */
export default function Loading() {
  return (
    <div
      role="status"
      aria-live="polite"
      aria-label="Loading case study"
      className="bg-[color:var(--color-ink-black)]"
    >
      {/* Hero placeholder */}
      <section className="relative min-h-[80svh] overflow-hidden">
        <div className="absolute inset-0 bg-[color:var(--color-ink-obsidian)] animate-pulse" />
        <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-black/20 to-black" />
        <div className="relative z-10 mx-auto flex min-h-[80svh] max-w-[1440px] flex-col justify-end px-5 lg:px-10 pb-16 pt-[140px] lg:pt-[180px]">
          <div className="h-3 w-32 rounded-full bg-white/10" />
          <div className="mt-6 h-4 w-72 rounded-full bg-white/10" />
          <div className="mt-6 h-[64px] w-[min(560px,86vw)] rounded-md bg-white/10" />
        </div>
      </section>

      {/* Body placeholder */}
      <section className="py-[96px] lg:py-[160px]">
        <div className="mx-auto grid max-w-[1440px] grid-cols-1 gap-10 px-5 lg:grid-cols-12 lg:gap-16 lg:px-10">
          <aside className="lg:col-span-4 flex flex-col gap-6">
            {Array.from({ length: 5 }).map((_, i) => (
              <div key={i} className="flex flex-col gap-2 border-b border-[color:var(--color-border-subtle)] pb-4">
                <div className="h-3 w-20 rounded-full bg-white/8" />
                <div className="h-4 w-40 rounded-full bg-white/10" />
              </div>
            ))}
          </aside>

          <div className="lg:col-span-8 flex flex-col gap-6">
            <div className="h-5 w-full max-w-[58ch] rounded-full bg-white/10" />
            <div className="h-5 w-[88%] max-w-[58ch] rounded-full bg-white/8" />
            <div className="h-5 w-[72%] max-w-[58ch] rounded-full bg-white/8" />
            <div className="mt-4 h-[120px] w-full rounded-md bg-white/5" />
          </div>
        </div>
      </section>
      <span className="sr-only">Loading case study</span>
    </div>
  );
}
