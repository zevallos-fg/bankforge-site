'use client';

import { useState } from 'react';
import Link from 'next/link';

export default function SiteNav() {
  const [mobileNav, setMobileNav] = useState(false);

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
          <span style={{ color: '#7EB3E8' }}>BankForge</span>
          <span className="text-white">.ai</span>
        </Link>

        <div className="hidden md:flex items-center gap-1">
          <Link href="/insights" className="px-3 py-2 text-sm text-white hover:text-white/80 transition-colors">
            Insights
          </Link>
          <span className="w-px h-4 bg-white/20 mx-2" />
          {/* FDIC-Insured Banks group */}
          <div className="flex flex-col items-center gap-0.5 px-2">
            <span style={{ fontSize: '9px', textTransform: 'uppercase', letterSpacing: '0.8px', color: 'rgba(255,255,255,0.35)' }}>FDIC-Insured Banks</span>
            <div className="flex items-center gap-1">
              <Link href="/ai-seo-score" className="px-2 py-1 text-sm text-white hover:text-white/80 transition-colors">
                AI SEO + Marketing Intelligence
              </Link>
              <Link href="/compliance-review" className="relative px-2 py-1 text-sm text-white hover:text-white/80 transition-colors">
                Compliance Review
                <span className="absolute -top-1.5 -right-1 text-[8px] font-medium px-1 rounded" style={{ backgroundColor: '#C8A84B', color: '#0F2341' }}>Jun 2026</span>
              </Link>
            </div>
          </div>
          <span className="w-px h-4 bg-white/20 mx-2" />
          {/* RIAs group */}
          <div className="flex flex-col items-center gap-0.5 px-2">
            <span style={{ fontSize: '9px', textTransform: 'uppercase', letterSpacing: '0.8px', color: 'rgba(255,255,255,0.35)' }}>RIAs</span>
            <Link href="/sec-marketing-rule-audit" className="px-2 py-1 text-sm text-white hover:text-white/80 transition-colors">
              2025 SEC Marketing Audit
            </Link>
          </div>
          <span className="w-px h-4 bg-white/20 mx-2" />
          <Link href="/for-banks" className="px-3 py-2 text-sm text-white/50 hover:text-white/80 transition-colors">
            For Banks
          </Link>
          <Link href="/for-credit-unions" className="px-3 py-2 text-sm text-white/50 hover:text-white/80 transition-colors">
            For Credit Unions
          </Link>
          <Link href="/for-rias" className="px-3 py-2 text-sm text-white/50 hover:text-white/80 transition-colors">
            For Investment Advisers
          </Link>
        </div>

        <div className="flex items-center gap-3">
          <Link
            href="mailto:outreach@bankforge.ai"
            className="bg-white text-bf-navy-deep text-sm font-medium px-4 py-2 rounded-lg hover:bg-gray-100 transition-colors"
          >
            Request a Call
          </Link>
          <button
            className="md:hidden text-white p-2 text-xl"
            onClick={() => setMobileNav(!mobileNav)}
            aria-label="Menu"
          >
            {mobileNav ? '\u2715' : '\u2630'}
          </button>
        </div>
      </div>
      {mobileNav && (
        <div className="md:hidden border-t border-white/10 py-2">
          <Link href="/insights" className="block px-6 py-3 text-sm text-white/70 hover:text-white hover:bg-white/5" onClick={() => setMobileNav(false)}>Insights</Link>
          <Link href="/ai-seo-score" className="block px-6 py-3 text-sm text-white/70 hover:text-white hover:bg-white/5" onClick={() => setMobileNav(false)}>AI SEO + Marketing Intelligence</Link>
          <Link href="/sec-marketing-rule-audit" className="block px-6 py-3 text-sm text-white/70 hover:text-white hover:bg-white/5" onClick={() => setMobileNav(false)}>2025 SEC Marketing Audit</Link>
          <Link href="/for-banks" className="block px-6 py-3 text-sm text-white/50 hover:text-white hover:bg-white/5" onClick={() => setMobileNav(false)}>For Banks</Link>
          <Link href="/for-credit-unions" className="block px-6 py-3 text-sm text-white/50 hover:text-white hover:bg-white/5" onClick={() => setMobileNav(false)}>For Credit Unions</Link>
          <Link href="/for-rias" className="block px-6 py-3 text-sm text-white/50 hover:text-white hover:bg-white/5" onClick={() => setMobileNav(false)}>For Investment Advisers</Link>
        </div>
      )}
    </nav>
  );
}
