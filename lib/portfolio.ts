export type PortfolioItem = {
  slug: string;
  title: string;
  client: string;
  discipline: 'Sound' | 'Localization' | 'Artist';
  year: number;
  aspect: 'portrait' | 'landscape' | 'square' | 'wide';
  accent: string; // css color for the thumbnail overlay
  poster: string;
  video?: string;
  summary: string;
};

export const PORTFOLIO: PortfolioItem[] = [
  {
    slug: 'atlas-protocol',
    title: 'Atlas Protocol',
    client: 'North Star Studios',
    discipline: 'Sound',
    year: 2025,
    aspect: 'landscape',
    accent: 'rgba(245, 242, 239, 0.12)',
    poster:
      'https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?auto=format&fit=crop&w=1600&q=80',
    summary:
      'Adaptive cinematic score and combat systemic SFX for a AAA sci-fi shooter.',
  },
  {
    slug: 'ninefold-path',
    title: 'Ninefold Path',
    client: 'Tidepool Games',
    discipline: 'Localization',
    year: 2025,
    aspect: 'portrait',
    accent: 'rgba(127, 255, 255, 0.08)',
    poster:
      'https://images.unsplash.com/photo-1519681393784-d120267933ba?auto=format&fit=crop&w=1200&q=80',
    summary:
      'Full voice-over localization across 18 languages with performance-matched casting.',
  },
  {
    slug: 'solarium',
    title: 'Solarium',
    client: 'Lumen Entertainment',
    discipline: 'Artist',
    year: 2024,
    aspect: 'square',
    accent: 'rgba(255, 248, 235, 0.14)',
    poster:
      'https://images.unsplash.com/photo-1511379938547-c1f69419868d?auto=format&fit=crop&w=1200&q=80',
    summary:
      'Composer representation and long-form creative strategy for an anthology series.',
  },
  {
    slug: 'dusk-ii',
    title: 'Dusk II',
    client: 'Foldcraft',
    discipline: 'Sound',
    year: 2024,
    aspect: 'wide',
    accent: 'rgba(255, 255, 255, 0.08)',
    poster:
      'https://images.unsplash.com/photo-1470813740244-df37b8c1edcb?auto=format&fit=crop&w=2000&q=80',
    summary:
      'Environmental audio design and diegetic radio for an open-world survival sequel.',
  },
  {
    slug: 'koi-requiem',
    title: 'Koi Requiem',
    client: 'Moth & Moon',
    discipline: 'Localization',
    year: 2024,
    aspect: 'portrait',
    accent: 'rgba(245, 242, 239, 0.10)',
    poster:
      'https://images.unsplash.com/photo-1487958449943-2429e8be8625?auto=format&fit=crop&w=1200&q=80',
    summary:
      'JP→EN performance localization and adaptive redub for a narrative RPG.',
  },
  {
    slug: 'field-report',
    title: 'Field Report',
    client: 'Arcline Audio',
    discipline: 'Artist',
    year: 2023,
    aspect: 'landscape',
    accent: 'rgba(127, 255, 255, 0.1)',
    poster:
      'https://images.unsplash.com/photo-1496307653780-42ee777d4833?auto=format&fit=crop&w=1600&q=80',
    summary:
      'Press & awards campaign for two breakout voice actors in the AA space.',
  },
];

export const DISCIPLINES = ['All', 'Sound', 'Localization', 'Artist'] as const;
