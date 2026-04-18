import type { Metadata, Viewport } from 'next';
import { Inter, Geist_Mono } from 'next/font/google';
import './globals.css';
import { LenisProvider } from '@/components/providers/LenisProvider';
import { NavBar } from '@/components/ui/NavBar';
import { CursorTrail } from '@/components/ui/CursorTrail';
import { PageTransition } from '@/components/ui/PageTransition';
import { ScrollProgress } from '@/components/ui/ScrollProgress';

const inter = Inter({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-inter',
  weight: ['100', '200', '300', '400', '500', '600', '700'],
});

const geistMono = Geist_Mono({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-geist-mono',
  weight: ['400', '500'],
});

export const metadata: Metadata = {
  metadataBase: new URL('https://soundstage.studio'),
  title: {
    default: 'SOUNDSTAGE — Sound, Localization & Artist Management',
    template: '%s · SOUNDSTAGE',
  },
  description:
    'A global studio for sound production, localization and artist management — crafting audio identity for the worlds leading games and entertainment brands.',
  keywords: [
    'sound design',
    'game audio',
    'localization',
    'artist management',
    'voice over',
    'interactive audio',
  ],
  openGraph: {
    title: 'SOUNDSTAGE — Sound, Localization & Artist Management',
    description:
      'A global studio for sound production, localization and artist management.',
    url: 'https://soundstage.studio',
    siteName: 'SOUNDSTAGE',
    locale: 'en_US',
    type: 'website',
  },
  robots: { index: true, follow: true },
};

export const viewport: Viewport = {
  themeColor: '#000000',
  width: 'device-width',
  initialScale: 1,
  viewportFit: 'cover',
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" className={`${inter.variable} ${geistMono.variable}`}>
      <body className="bg-[color:var(--color-ink-black)] text-[color:var(--color-text-primary)] antialiased">
        <LenisProvider>
          <ScrollProgress />
          <CursorTrail />
          <NavBar />
          <PageTransition>{children}</PageTransition>
        </LenisProvider>
      </body>
    </html>
  );
}
