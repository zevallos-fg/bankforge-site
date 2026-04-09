'use client';

import { useState } from 'react';
import Link from 'next/link';
import GeoScanInput from '../components/GeoScanInput';
import GeoScanResults from '../components/GeoScanResults';
import DemoRequestForm from '../components/DemoRequestForm';

/* eslint-disable @typescript-eslint/no-explicit-any */

const signalCards = [
  {
    stat: '78%',
    statLabel: 'of community banks have no schema markup',
    body: "Schema tells AI systems exactly what your institution offers. Without it, AI engines must infer your products from unstructured text \u2014 and they rarely get it right.",
  },
  {
    stat: '64%',
    statLabel: 'of banks have significant GBP gaps',
    body: 'GBP is one of the primary data sources AI search engines draw from when answering questions about local financial services.',
  },
  {
    stat: '3,800+',
    statLabel: 'institutions with web archive data',
    body: 'AI engines prioritize content that demonstrates expertise. A stale website with a single rate table signals low authority.',
  },
  {
    stat: '\u2714',
    statLabel: 'Measured across ChatGPT, Perplexity, Google AI Overviews',
    body: "BankForge tests actual AI search engine responses \u2014 not just technical signals. Your score reflects real-world AI visibility.",
  },
];

const pricingTiers = [
  {
    step: '1',
    name: 'GEO Baseline Report',
    price: '$3,000',
    founding: 'Founding rate $2,500 \u2014 available to first 5 clients. Expires September 1, 2026.',
    note: null,
    items: [
      "Your institution\u2019s GEO score vs. peer average",
      'Competitor gap analysis (nearest 5 institutions by market)',
      '10 prioritized fixes ranked by impact',
      'Peer benchmark context from 4,300+ bank corpus',
      'DOCX report \u2014 delivered within 5 business days',
    ],
    ctaType: 'active' as const,
    ctaLabel: 'Request GEO Report',
    ctaKey: 'pricing_geo1',
    highlight: true,
  },
  {
    step: '2',
    name: 'Remediation Spec + Working Session',
    price: '$2,000',
    founding: null,
    note: 'Add-on after GEO 1 delivery',
    items: [
      'Technical remediation spec your marketing/IT team executes',
      '60-minute live working session \u2014 we walk through every fix',
      'Fixes prioritized by GEO score impact',
      'No vendor dependency \u2014 your team owns execution',
    ],
    ctaType: 'active' as const,
    ctaLabel: 'Request GEO Report',
    ctaKey: 'pricing_geo2',
    highlight: false,
  },
  {
    step: '3',
    name: 'GEO Monitoring',
    price: '$999/mo',
    founding: null,
    note: 'No contract \u00b7 Cancel anytime \u00b7 Available after Step 2',
    items: [
      'Month-over-month GEO score tracking',
      'Competitor delta report',
      'Alert on score drops above 5 points',
      'Covers ChatGPT, Perplexity, Google AI Overviews',
    ],
    ctaType: 'disabled' as const,
    ctaLabel: 'Available after Step 2',
    ctaKey: 'pricing_geo3',
    highlight: false,
  },
];

const stats = [
  { value: '45.8 avg', label: 'Average GEO score across 4,300+ banks (March 2026)' },
  { value: '16.6%', label: 'Banks scoring below 40 \u2014 invisible on AI search' },
  { value: '78%', label: 'Community banks with no schema markup' },
];

function ArrowRight({ color = '#1B5299' }: { color?: string }) {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
      <path d="M5 12h14M13 6l6 6-6 6" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function ArrowDown({ color = '#1B5299' }: { color?: string }) {
  return (
    <div className="flex justify-center py-3 md:hidden">
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
        <path d="M12 5v14M6 13l6 6 6-6" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    </div>
  );
}

export default function GeoScorePageClient() {
  const [scanResult, setScanResult] = useState<any>(null);

  return (
    <div className="min-h-screen bg-white">
      {/* ─── NAV ───────────────────────────────────────────────── */}
      <nav
        className="fixed top-0 inset-x-0 z-50 px-6 py-3"
        style={{ backgroundColor: 'rgba(15,35,65,0.92)', backdropFilter: 'blur(12px)' }}
      >
        <div className="max-w-6xl mx-auto flex items-center justify-between">
          <Link href="/" className="text-xl tracking-tight" style={{ fontFamily: 'var(--font-display)' }}>
            <span style={{ color: '#7EB3E8' }}>BankForge</span>
            <span className="text-white">.ai</span>
          </Link>
          <div className="hidden md:flex items-center gap-6 text-sm text-gray-300">
            <Link href="/for-banks" className="hover:text-white transition-colors">Banks</Link>
            <Link href="/for-credit-unions" className="hover:text-white transition-colors">Credit Unions</Link>
            <Link href="/for-rias" className="hover:text-white transition-colors">Investment Advisers</Link>
            <Link href="/insights" className="hover:text-white transition-colors">Insights</Link>
          </div>
          <Link
            href="mailto:outreach@bankforge.ai"
            className="bg-white text-bf-navy-deep text-sm font-medium px-4 py-2 rounded-lg hover:bg-gray-100 transition-colors"
          >
            Request a Call
          </Link>
        </div>
      </nav>

      {/* ─── HERO — scan input ─────────────────────────────────── */}
      <section className="pt-24 pb-16 px-6" style={{ backgroundColor: '#0F2341' }}>
        <div className="max-w-3xl mx-auto text-center">
          <p className="text-xs font-medium tracking-wide uppercase mb-4" style={{ color: '#7EB3E8' }}>
            GEO Score
          </p>
          <h1
            className="text-4xl text-white leading-tight mb-5"
            style={{ fontFamily: 'var(--font-display)' }}
          >
            Your bank is invisible on AI search. Here&apos;s how to fix it.
          </h1>
          <p className="text-blue-200/80 text-lg leading-relaxed max-w-xl mx-auto">
            BankForge has computed GEO scores across 4,300+ community banks.
            The average score is 45.8 out of 100. 16.6% score below 40 &mdash;
            invisible on ChatGPT, Perplexity, and Google AI Overviews when
            customers search for local banking services.
          </p>
          {!scanResult ? (
            <GeoScanInput onResult={setScanResult} />
          ) : (
            <div className="mt-8 text-center">
              <p className="text-white/80 text-sm">
                {'\u2713'} Found {scanResult.entity?.name}
              </p>
              <button
                onClick={() => document.getElementById('geo-scan-results')?.scrollIntoView({ behavior: 'smooth' })}
                className="text-white/60 text-xs mt-2 underline cursor-pointer"
              >
                Jump to results &darr;
              </button>
            </div>
          )}
        </div>
      </section>

      {/* ─── SCAN RESULTS (conditional) ────────────────────────── */}
      {scanResult && (
        <section id="geo-scan-results" className="py-16 px-6 bg-white border-b border-gray-100">
          <div className="max-w-4xl mx-auto">
            <GeoScanResults result={scanResult} />
          </div>
        </section>
      )}

      {/* ─── HOW IT WORKS ──────────────────────────────────────── */}
      <section className="py-16 px-6">
        <div className="max-w-5xl mx-auto">
          <p className="text-bf-navy text-xs font-medium tracking-wide uppercase mb-3">
            How it works
          </p>
          <h2
            className="text-3xl text-gray-900 mb-3"
            style={{ fontFamily: 'var(--font-display)' }}
          >
            AI search engines don&apos;t read your website the way Google does.
          </h2>
          <p className="text-sm text-gray-600 mb-10">
            They extract structured signals. If those signals aren&apos;t there,
            your institution doesn&apos;t exist in the AI layer.
          </p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {signalCards.map((card, i) => (
              <div
                key={i}
                className="rounded-lg p-5 bg-white"
                style={{ border: '1px solid #d1dbe8', borderLeft: '3px solid #1B5299' }}
              >
                <p className="text-2xl mb-1" style={{ fontFamily: 'var(--font-display)', color: '#1B5299' }}>
                  {card.stat}
                </p>
                <p className="text-sm font-medium text-gray-900 mb-2">{card.statLabel}</p>
                <p className="text-sm text-gray-600 leading-relaxed">{card.body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ─── PRICING ───────────────────────────────────────────── */}
      <section id="what-we-deliver" className="py-16 px-6" style={{ backgroundColor: '#F8F9FB' }}>
        <div className="max-w-5xl mx-auto">
          <p className="text-bf-navy text-xs font-medium tracking-wide uppercase mb-3">
            What we deliver
          </p>
          <h2
            className="text-3xl text-gray-900 mb-10"
            style={{ fontFamily: 'var(--font-display)' }}
          >
            From score to fixed. Three steps.
          </h2>

          {/* Desktop */}
          <div className="hidden md:flex items-start">
            {pricingTiers.map((tier, idx) => (
              <div key={tier.step} className="contents">
                <div
                  className="flex-1 rounded-xl p-6 bg-white flex flex-col"
                  style={{
                    border: tier.highlight ? '2px solid #1B5299' : '1px solid #e5e7eb',
                    opacity: tier.ctaType === 'disabled' ? 0.75 : 1,
                  }}
                >
                  <p className="text-xs font-medium mb-2" style={{ color: '#7EB3E8' }}>Step {tier.step}</p>
                  <div className="min-h-[56px] flex items-start">
                    <h3 className="text-lg text-gray-900" style={{ fontFamily: 'var(--font-display)' }}>{tier.name}</h3>
                  </div>
                  <p className="text-3xl mb-1" style={{ fontFamily: 'var(--font-display)', color: '#0F2341' }}>{tier.price}</p>
                  {tier.founding && <p className="text-xs text-gray-500 mb-3 leading-relaxed">{tier.founding}</p>}
                  {tier.note && <p className="text-xs text-gray-400 mb-3">{tier.note}</p>}
                  <ul className="space-y-2 mb-6 flex-1">
                    {tier.items.map((item, i) => (
                      <li key={i} className="text-sm text-gray-600 leading-relaxed flex gap-2">
                        <span className="text-bf-navy mt-0.5 shrink-0">&bull;</span>
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>
                  {tier.ctaType === 'active' ? (
                    <DemoRequestForm
                      audienceType="bank"
                      sourcePage="/geo-score"
                      sourceCta={tier.ctaKey}
                      ctaLabel={tier.ctaLabel}
                      buttonClassName="w-full bg-bf-navy-deep text-white font-medium px-4 py-3 rounded-lg hover:bg-bf-navy-deep/90 transition-colors text-sm text-center cursor-pointer"
                    />
                  ) : (
                    <p className="w-full text-center text-sm text-gray-400 py-3">{tier.ctaLabel}</p>
                  )}
                </div>
                {idx < pricingTiers.length - 1 && (
                  <div className="flex items-center justify-center w-12 pt-20 shrink-0">
                    <ArrowRight color={idx === 0 ? '#1B5299' : '#9CA3AF'} />
                  </div>
                )}
              </div>
            ))}
          </div>

          {/* Mobile */}
          <div className="md:hidden space-y-0">
            {pricingTiers.map((tier, idx) => (
              <div key={tier.step}>
                <div
                  className="rounded-xl p-6 bg-white flex flex-col"
                  style={{
                    border: tier.highlight ? '2px solid #1B5299' : '1px solid #e5e7eb',
                    opacity: tier.ctaType === 'disabled' ? 0.75 : 1,
                  }}
                >
                  <p className="text-xs font-medium mb-2" style={{ color: '#7EB3E8' }}>Step {tier.step}</p>
                  <h3 className="text-lg text-gray-900 mb-2" style={{ fontFamily: 'var(--font-display)' }}>{tier.name}</h3>
                  <p className="text-3xl mb-1" style={{ fontFamily: 'var(--font-display)', color: '#0F2341' }}>{tier.price}</p>
                  {tier.founding && <p className="text-xs text-gray-500 mb-3 leading-relaxed">{tier.founding}</p>}
                  {tier.note && <p className="text-xs text-gray-400 mb-3">{tier.note}</p>}
                  <ul className="space-y-2 mb-6 flex-1">
                    {tier.items.map((item, i) => (
                      <li key={i} className="text-sm text-gray-600 leading-relaxed flex gap-2">
                        <span className="text-bf-navy mt-0.5 shrink-0">&bull;</span>
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>
                  {tier.ctaType === 'active' ? (
                    <DemoRequestForm
                      audienceType="bank"
                      sourcePage="/geo-score"
                      sourceCta={tier.ctaKey}
                      ctaLabel={tier.ctaLabel}
                      buttonClassName="w-full bg-bf-navy-deep text-white font-medium px-4 py-3 rounded-lg hover:bg-bf-navy-deep/90 transition-colors text-sm text-center cursor-pointer"
                    />
                  ) : (
                    <p className="w-full text-center text-sm text-gray-400 py-3">{tier.ctaLabel}</p>
                  )}
                </div>
                {idx < pricingTiers.length - 1 && <ArrowDown color={idx === 0 ? '#1B5299' : '#9CA3AF'} />}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ─── STAT ROW ──────────────────────────────────────────── */}
      <section className="py-12 px-6">
        <div className="max-w-5xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
          {stats.map((s, i) => (
            <div key={i}>
              <p className="text-3xl mb-1" style={{ fontFamily: 'var(--font-display)', color: '#1B5299' }}>{s.value}</p>
              <p className="text-sm text-gray-500">{s.label}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ─── BOTTOM CTA ────────────────────────────────────────── */}
      <section className="mx-7 mb-12">
        <div className="bg-bf-navy-deep rounded-[10px] py-12 px-10 text-center">
          <div className="max-w-xl mx-auto">
            <h2 className="text-white text-3xl mb-4" style={{ fontFamily: 'var(--font-display)' }}>
              Your competitors are invisible on AI search too.
              <br />
              The first bank to fix it owns the query.
            </h2>
            <p className="text-blue-200/70 text-sm leading-relaxed mb-6">
              BankForge has already computed your institution&apos;s GEO score.
              Request the report and see exactly where you stand.
            </p>
            <DemoRequestForm
              audienceType="bank"
              sourcePage="/geo-score"
              sourceCta="cta_block"
              ctaLabel="Get Your GEO Score Report"
            />
          </div>
        </div>
      </section>

      {/* ─── FOOTER ────────────────────────────────────────────── */}
      <footer className="py-6 px-6 border-t border-gray-100">
        <div className="max-w-5xl mx-auto flex flex-col md:flex-row items-center justify-between gap-2 text-[11px] text-gray-400">
          <span style={{ fontFamily: 'var(--font-display)' }} className="text-gray-500 text-sm">
            <span style={{ color: '#1B5299' }}>BankForge</span>.ai
          </span>
          <span className="text-center">
            BankForge flags findings for compliance counsel review. We never conclude a violation.
          </span>
          <span>&copy; 2026</span>
        </div>
      </footer>
    </div>
  );
}
