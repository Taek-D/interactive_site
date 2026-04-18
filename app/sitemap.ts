import type { MetadataRoute } from 'next';
import { PORTFOLIO } from '@/lib/portfolio';

export default function sitemap(): MetadataRoute.Sitemap {
  const base = 'https://soundstage.studio';
  const now = new Date();

  return [
    { url: `${base}/`, lastModified: now, changeFrequency: 'monthly', priority: 1 },
    { url: `${base}/work`, lastModified: now, changeFrequency: 'monthly', priority: 0.9 },
    ...PORTFOLIO.map((p) => ({
      url: `${base}/work/${p.slug}`,
      lastModified: now,
      changeFrequency: 'yearly' as const,
      priority: 0.7,
    })),
  ];
}
