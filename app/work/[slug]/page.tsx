import Image from 'next/image';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import type { Metadata } from 'next';
import { PORTFOLIO } from '@/lib/portfolio';
import { AudioWaveform } from '@/components/canvas/AudioWaveform';

type Params = { slug: string };

export function generateStaticParams(): Params[] {
  return PORTFOLIO.map((p) => ({ slug: p.slug }));
}

export async function generateMetadata(
  { params }: { params: Promise<Params> },
): Promise<Metadata> {
  const { slug } = await params;
  const item = PORTFOLIO.find((p) => p.slug === slug);
  if (!item) return {};
  return {
    title: `${item.title} — ${item.discipline}`,
    description: item.summary,
    openGraph: {
      title: `${item.title} — ${item.discipline}`,
      description: item.summary,
      images: [{ url: item.poster }],
    },
  };
}

export default async function WorkDetailPage(
  { params }: { params: Promise<Params> },
) {
  const { slug } = await params;
  const item = PORTFOLIO.find((p) => p.slug === slug);
  if (!item) notFound();

  const nextItem =
    PORTFOLIO[(PORTFOLIO.findIndex((p) => p.slug === slug) + 1) % PORTFOLIO.length];

  return (
    <article className="bg-[color:var(--color-ink-black)] text-white">
      {/* Hero */}
      <section className="relative min-h-[80svh] overflow-hidden">
        <div className="absolute inset-0">
          <Image
            src={item.poster}
            alt=""
            fill
            priority
            className="object-cover opacity-60"
            sizes="100vw"
          />
          <div
            className="absolute inset-0 mix-blend-screen"
            style={{ backgroundColor: item.accent }}
            aria-hidden="true"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-black/20 to-black" />
        </div>

        <div className="relative z-10 mx-auto flex min-h-[80svh] max-w-[1440px] flex-col justify-end px-5 lg:px-10 pb-16 pt-[140px] lg:pt-[180px]">
          <Link
            href="/work"
            className="font-mono-code text-[color:var(--color-text-muted)] hover:text-white transition-colors w-fit"
          >
            ← Back to work
          </Link>
          <div className="mt-6 flex flex-wrap items-center gap-4 font-micro text-[color:var(--color-text-secondary)]">
            <span>{item.discipline}</span>
            <span className="h-[1px] w-6 bg-white/30" />
            <span>{item.year}</span>
            <span className="h-[1px] w-6 bg-white/30" />
            <span>{item.client}</span>
          </div>
          <h1 className="mt-6 font-display-mega text-white tracking-[-0.04em] max-w-[14ch]">
            {item.title}
          </h1>
        </div>
      </section>

      {/* Body */}
      <section className="py-[96px] lg:py-[160px]">
        <div className="mx-auto grid max-w-[1440px] grid-cols-1 gap-10 px-5 lg:grid-cols-12 lg:gap-16 lg:px-10">
          <aside className="lg:col-span-4 flex flex-col gap-8">
            <InfoRow label="Client" value={item.client} />
            <InfoRow label="Discipline" value={item.discipline} />
            <InfoRow label="Year" value={String(item.year)} />
            <InfoRow label="Role" value="Production · Mix · Localization" />
            <InfoRow label="Languages" value="18 · EN JP KO FR DE…" />
          </aside>

          <div className="lg:col-span-8 flex flex-col gap-10">
            <p className="font-body-large text-white max-w-[58ch]">{item.summary}</p>
            <p className="font-body text-[color:var(--color-text-secondary)] max-w-[58ch]">
              Our role spanned early concept scoring through final mastering,
              partnering with the creative directors to build an audio identity
              that holds up across a soundbar, a cinema, and a pair of earbuds
              on a morning commute. We developed a bespoke adaptive music
              system, designed the diegetic layer, supervised the full voice-
              over programme, and integrated everything directly in the team&apos;s
              middleware of choice.
            </p>

            <AudioWaveform bars={160} height={120} intensity={0.9} className="opacity-70" />

            <p className="font-body text-[color:var(--color-text-secondary)] max-w-[58ch]">
              The result is a sonic world that sits underneath the frame
              without calling attention to itself — felt, never forced.
            </p>
          </div>
        </div>
      </section>

      {/* Next project */}
      <section className="border-t border-[color:var(--color-border-subtle)]">
        <Link
          href={nextItem ? `/work/${nextItem.slug}` : '/work'}
          className="group block px-5 py-16 lg:px-10 lg:py-24 cursor-pointer"
        >
          <div className="mx-auto flex max-w-[1440px] flex-col gap-4">
            <span className="font-mono-code text-[color:var(--color-text-whisper)]">NEXT</span>
            <span className="font-display-hero text-white tracking-[-0.02em] group-hover:text-[color:var(--color-accent-warm)] transition-colors">
              {nextItem?.title ?? 'Back to index'} →
            </span>
          </div>
        </Link>
      </section>
    </article>
  );
}

function InfoRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex flex-col gap-1 border-b border-[color:var(--color-border-subtle)] pb-4">
      <span className="font-mono-code text-[color:var(--color-text-whisper)]">{label}</span>
      <span className="font-body-standard text-white">{value}</span>
    </div>
  );
}
