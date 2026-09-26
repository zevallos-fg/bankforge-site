'use client';

import { useState } from 'react';
import Link from 'next/link';

/**
 * Header navigation for the Tiqsi.ai information architecture.
 *
 * Five destinations: Home, RIAs, Banks, Pricing, Insights. The previous nav
 * exposed nine links across two overlapping groupings and named products
 * ("2025 SEC Marketing Audit", "AI SEO + Marketing Intelligence") that the new
 * IA folds under their audience.
 */
export default function SiteNav() {
  const [mobileNav, setMobileNav] = useState(false);

  // /ai-visibility is the cross-lane definitional page (money page 8, D-TW-13).
  // It belongs in the nav because seven other pages link to it as the explanation
  // of the term, so a reader needs to reach it without first picking a lane.
  const links = [
    { href: '/rias', label: 'Investment Advisers' },
    { href: '/banks', label: 'Banks & Credit Unions' },
    { href: '/ai-visibility', label: 'AI Visibility' },
    { href: '/pricing', label: 'Pricing' },
    { href: '/insights', label: 'Insights' },
  ];

  return (
    <nav
      className="fixed top-0 inset-x-0 z-50 px-6 py-3"
      style={{ backgroundColor: 'rgba(15,35,65,0.92)', backdropFilter: 'blur(12px)' }}
    >
      <div className="max-w-6xl mx-auto flex items-center justify-between">
        <Link
          href="/"
          className="text-xl tracking-tight"
          style={{ fontFamily: 'var(--font-display)' }}
        >
          <span style={{ color: '#7EB3E8' }}>Tiqsi</span>
          <span className="text-white">.ai</span>
        </Link>

        <div className="hidden md:flex items-center gap-1">
          {links.map((l) => (
            <Link
              key={l.href}
              href={l.href}
              className="px-3 py-2 text-sm text-white hover:text-white/80 transition-colors"
            >
              {l.label}
            </Link>
          ))}
        </div>

        <div className="flex items-center gap-3">
          <Link
            href="/pricing"
            className="hidden sm:inline-block bg-white text-bf-navy-deep text-sm font-medium px-4 py-2 rounded-lg hover:bg-gray-100 transition-colors"
          >
            Book a walkthrough
          </Link>
          <button
            className="md:hidden text-white p-2 text-xl"
            onClick={() => setMobileNav(!mobileNav)}
            aria-label="Menu"
            aria-expanded={mobileNav}
          >
            {mobileNav ? '✕' : '☰'}
          </button>
        </div>
      </div>

      {mobileNav && (
        <div className="md:hidden border-t border-white/10 py-2">
          {links.map((l) => (
            <Link
              key={l.href}
              href={l.href}
              className="block px-6 py-3 text-sm text-white/70 hover:text-white hover:bg-white/5"
              onClick={() => setMobileNav(false)}
            >
              {l.label}
            </Link>
          ))}
        </div>
      )}
    </nav>
  );
}
