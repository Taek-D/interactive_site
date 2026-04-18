'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';
import { AnimatePresence, motion, useReducedMotion } from 'framer-motion';

const NAV_LINKS = [
  { href: '/#scrolltelling', label: 'Story' },
  { href: '/#services', label: 'Services' },
  { href: '/work', label: 'Work' },
  { href: '/#clients', label: 'Clients' },
  { href: '/#contact', label: 'Contact' },
] as const;

export function NavBar() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const shouldReduceMotion = useReducedMotion();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 16);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => {
    if (mobileOpen) {
      document.body.style.overflow = 'hidden';
      // Trap focus logic could be added here or via a component
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [mobileOpen]);

  return (
    <>
      <header
        className={[
          'fixed top-0 inset-x-0 z-50 transition-[backdrop-filter,background-color,border-color] duration-500',
          scrolled
            ? 'backdrop-blur-xl bg-black/60 border-b border-[color:var(--color-border-subtle)]'
            : 'bg-transparent border-b border-transparent',
        ].join(' ')}
      >
        <nav
          aria-label="Primary"
          className="mx-auto flex h-[72px] max-w-[1440px] items-center justify-between px-5 lg:px-10"
        >
          <Link
            href="/"
            className="font-button-uppercase tracking-[0.22em] text-white inline-flex items-center gap-2"
            aria-label="SOUNDSTAGE home"
          >
            <SoundmarkLogo />
            <span>SOUNDSTAGE</span>
          </Link>

          <ul className="hidden lg:flex items-center gap-8">
            {NAV_LINKS.map((link) => (
              <li key={link.href}>
                <Link
                  href={link.href}
                  className="font-nav text-[color:var(--color-text-secondary)] hover:text-white transition-colors"
                >
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>

          <div className="hidden lg:flex items-center gap-3">
            <Link href="/#contact" className="btn-pill-obsidian">
              Start a project
            </Link>
          </div>

          <button
            type="button"
            aria-label={mobileOpen ? 'Close menu' : 'Open menu'}
            aria-expanded={mobileOpen}
            onClick={() => setMobileOpen((v) => !v)}
            className="lg:hidden inline-flex h-11 w-11 items-center justify-center rounded-full border border-[color:var(--color-border-light)] text-white"
          >
            <span className="sr-only">{mobileOpen ? 'Close' : 'Menu'}</span>
            <svg width="20" height="20" viewBox="0 0 20 20" aria-hidden="true">
              <path
                d={mobileOpen ? 'M4 4 L16 16 M16 4 L4 16' : 'M3 6 H17 M3 14 H17'}
                stroke="currentColor"
                strokeWidth="1.25"
                strokeLinecap="round"
                fill="none"
              />
            </svg>
          </button>
        </nav>
      </header>

      <AnimatePresence>
        {mobileOpen && (
          <motion.aside
            key="mobile-panel"
            initial={shouldReduceMotion ? { opacity: 0 } : { opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={shouldReduceMotion ? { opacity: 0 } : { opacity: 0, y: -20 }}
            transition={{ duration: 0.35, ease: [0.33, 1, 0.68, 1] }}
            className="fixed inset-0 z-40 lg:hidden bg-black/95 backdrop-blur-xl pt-[72px]"
          >
            <ul className="flex flex-col gap-2 px-6 py-10">
              {NAV_LINKS.map((link, i) => (
                <motion.li
                  key={link.href}
                  initial={shouldReduceMotion ? { opacity: 0 } : { opacity: 0, y: 16 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.05 * i, duration: 0.35, ease: [0.33, 1, 0.68, 1] }}
                >
                  <Link
                    href={link.href}
                    onClick={() => setMobileOpen(false)}
                    className="font-display-hero text-white block py-3"
                  >
                    {link.label}
                  </Link>
                </motion.li>
              ))}
              <motion.li
                initial={shouldReduceMotion ? { opacity: 0 } : { opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3, duration: 0.35 }}
                className="pt-6"
              >
                <Link
                  href="/#contact"
                  className="btn-pill-warm"
                  onClick={() => setMobileOpen(false)}
                >
                  Start a project
                </Link>
              </motion.li>
            </ul>
          </motion.aside>
        )}
      </AnimatePresence>
    </>
  );
}

function SoundmarkLogo() {
  return (
    <svg width="20" height="20" viewBox="0 0 20 20" aria-hidden="true" className="text-white">
      <g stroke="currentColor" strokeWidth="1.2" strokeLinecap="round">
        <line x1="2" y1="10" x2="2" y2="10" />
        <line x1="6" y1="6" x2="6" y2="14" />
        <line x1="10" y1="3" x2="10" y2="17" />
        <line x1="14" y1="7" x2="14" y2="13" />
        <line x1="18" y1="10" x2="18" y2="10" />
      </g>
    </svg>
  );
}
