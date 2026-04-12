'use client';

import { useState } from 'react';
import Link from 'next/link';
import GeoScanInput from '../components/GeoScanInput';
import SiteNav from '../components/SiteNav';
import DemoRequestForm from '../components/DemoRequestForm';

/* eslint-disable @typescript-eslint/no-explicit-any */

const signalCards = [
  {
    stat: '78%',
    statLabel: 'of FDIC-Insured Banks have no schema markup',
    body: "Schema tells AI systems exactly what your institution offers. Without it, AI engines must infer your products from unstructured text \u2014 and they rarely get it right.",
  },
  {
    stat: '64%',
    statLabel: 'of FDIC-Insured Banks have significant Google Business Profile gaps',
    body: 'Your Google Business Profile is one of the primary data sources AI search engines draw from when answering questions about local financial services.',
  },
  {
    stat: '\u2713',
    statLabel: 'Historical digital presence signals included in every analysis.',
    body: 'AI engines prioritize content that demonstrates expertise. A stale website with a single rate table signals low authority.',
  },
  {
    stat: '\u2714',
    statLabel: 'Measured across ChatGPT, Perplexity, Google AI Overviews',
    body: "BankForge tests actual AI search engine responses \u2014 not just technical signals. Your score reflects real-world AI visibility.",
  },
];

const pricingTiers: Array<{ step: string; name: string; price: string; founding: string | null; note: string | null; items: string[]; ctaType: 'active' | 'disabled'; ctaLabel: string; ctaKey: string; highlight: boolean }> = [
  {
    step: '1',
    name: 'AI SEO + Marketing Intelligence Report',
    price: '$3,000',
    founding: 'Founding rate $2,500 \u2014 available to first 5 clients. Expires September 1, 2026.',
    note: 'No subscription, no compliance scope \u2014 the CMO owns it, delivered in 5 business days.',
    items: [
      "Your institution\u2019s AI SEO score vs. peer average",
      '__GOLD__Peer benchmarks from 4,300+ FDIC-Insured Banks',
      'Competitor gap analysis (nearest 5 institutions by market)',
      '10 prioritized fixes ranked by impact',
      'DOCX report \u2014 delivered within 5 business days',
    ],
    ctaType: 'active' as const,
    ctaLabel: 'Request AI SEO Report',
    ctaKey: 'pricing_geo1',
    highlight: true,
  },
  {
    step: '2',
    name: 'Remediation Spec + Working Session',
    price: '$2,000',
    founding: null,
    note: 'Optional add-on \u00b7 Available any time after Step 1',
    items: [
      'Technical remediation spec your marketing/IT team executes',
      '60-minute live working session \u2014 we walk through every fix',
      'Fixes prioritized by AI SEO score impact',
      'No vendor dependency \u2014 your team owns execution',
    ],
    ctaType: 'active' as const,
    ctaLabel: 'Book a Remediation Session',
    ctaKey: 'pricing_geo2',
    highlight: false,
  },
  {
    step: '3',
    name: 'AI SEO + Marketing Intelligence Monitoring',
    price: '$999/mo',
    founding: null,
    note: 'No contract \u00b7 Cancel anytime \u00b7 Available after Step 1',
    items: [
      'Month-over-month AI SEO score tracking',
      'Competitor delta report',
      'Alert on score drops above 5 points',
      'Covers ChatGPT, Perplexity, Google AI Overviews',
    ],
    ctaType: 'active' as const,
    ctaLabel: 'Start Monitoring',
    ctaKey: 'pricing_geo3',
    highlight: false,
  },
];

const stats = [
  { value: '4,300+', stacked: null, label: 'FDIC-Insured Banks scanned' },
  { value: '45.8 avg', stacked: null, label: 'Average AI SEO score' },
  { value: '16.6%', stacked: null, label: 'Score below 40 \u2014 invisible on AI search' },
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

/* ─── Tooltip ───────────────────────────────────────────────────────── */

function Tip({ text }: { text: string }) {
  const [show, setShow] = useState(false);
  return (
    <span className="relative inline-flex cursor-help ml-1" onMouseEnter={() => setShow(true)} onMouseLeave={() => setShow(false)}>
      <svg width="13" height="13" viewBox="0 0 16 16" fill="none" className="text-gray-400 hover:text-gray-600 transition-colors">
        <circle cx="8" cy="8" r="7" stroke="currentColor" strokeWidth="1.5" />
        <text x="8" y="11.5" textAnchor="middle" fill="currentColor" fontSize="9" fontWeight="600">?</text>
      </svg>
      {show && (
        <span className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 z-50 bg-slate-800 text-white text-xs rounded-lg p-2 max-w-[220px] shadow-lg whitespace-normal leading-relaxed pointer-events-none">{text}</span>
      )}
    </span>
  );
}

/* ─── Technical signal cell ─────────────────────────────────────────── */

function TechSigCell({ label, status, value, good, tip, extra }: {
  label: string; status: string; value: string; good: boolean; tip: string; extra?: string;
}) {
  return (
    <div className="rounded-lg p-2.5" style={{ backgroundColor: good ? '#F0FDF4' : '#FAFAFA', border: `1px solid ${good ? '#BBF7D0' : '#E5E7EB'}` }}>
      <div className="flex items-center gap-1 mb-1">
        <span className="text-sm">{status}</span>
        <span className="text-xs font-medium text-gray-700">{label}</span>
      </div>
      <p className="text-xs text-gray-600">{value}</p>
      {extra && <p className="text-xs text-amber-600">{extra}</p>}
      <p className="text-[10px] text-gray-400 leading-relaxed mt-1">{tip}</p>
    </div>
  );
}

/* ─── SEO Signal definitions ────────────────────────────────────────── */

const SEO_SIGNALS: Array<{ key: string; label: string; tooltip: string }> = [
  { key: 'https', label: 'HTTPS', tooltip: 'Secure connection required. AI engines deprioritize HTTP sites.' },
  { key: 'pageTitle', label: 'Page Title', tooltip: 'Descriptive title tag helps AI engines categorize your institution.' },
  { key: 'metaDescription', label: 'Meta Description', tooltip: 'Summary snippet AI engines use to describe your page in results.' },
  { key: 'h1Tag', label: 'H1 Tag', tooltip: 'Primary heading signals your page topic to AI crawlers.' },
  { key: 'brandVisibility', label: 'Brand Visibility', tooltip: 'Whether your institution appears in the top 10 organic search results.' },
  { key: 'schemaMarkup', label: 'Schema Markup', tooltip: 'Structured data that tells AI exactly what products you offer.' },
  { key: 'gbpListed', label: 'GBP Listed', tooltip: 'Google Business Profile — the primary source for local AI search answers.' },
];

/* ─── AI SEO Result Panel ───────────────────────────────────────────── */

function AiSeoResultPanel({ result }: { result: any }) {
  const geo = result.geo;
  const seoSigs = result.seoSignals ?? {};
  const compliance = result.compliance;
  const geoScore = geo?.score ?? 0;
  const geoColor = geoScore >= 60 ? '#10b981' : geoScore >= 40 ? '#BA7517' : geoScore >= 25 ? '#BA7517' : '#E24B4A';
  const geoLabel = geoScore >= 60 ? 'Strong' : geoScore >= 40 ? 'Moderate' : geoScore >= 25 ? 'Developing' : 'Needs Work';
  const geoGap = geo?.top_peer_score != null && geo?.score != null ? geo.top_peer_score - geo.score : null;

  return (
    <section id="geo-scan-results" className="py-16 px-6 bg-white border-b border-gray-100">
      <div className="max-w-4xl mx-auto animate-fadeIn">
        {/* Panel 1 — Entity header */}
        <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-2 mb-6">
          <div>
            <h3 className="text-xl font-medium text-gray-900" style={{ fontFamily: 'var(--font-display)' }}>{result.entity?.name}</h3>
            <p className="text-sm text-gray-500">
              {result.entity?.asset_tier && `${result.entity.asset_tier} \u00B7 `}
              {result.entity?.location ?? result.entity?.domain}
            </p>
          </div>
          <p className="text-xs text-gray-400">{result.repdte ? `${result.repdte} peer benchmarks` : ''}</p>
        </div>

        {/* Panel 2 — Two-column: AI SEO Score + SEO Signals */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
          {/* LEFT — AI SEO Score */}
          <div className="rounded-lg p-5" style={{ backgroundColor: '#F8FAFC', border: '1px solid #E2E8F0' }}>
            <p className="text-xs font-medium text-gray-500 uppercase tracking-wide mb-3">AI SEO Score</p>
            <div className="flex items-end gap-2 mb-2">
              <span className="text-5xl font-bold" style={{ color: geoColor, fontFamily: 'var(--font-display)' }}>
                {geo?.score ?? 'N/A'}
              </span>
              <span className="text-gray-400 text-xl mb-1">/ 65</span>
            </div>
            <p className="text-xs font-medium mb-3" style={{ color: geoColor }}>{geoLabel}</p>
            <div className="w-full h-2.5 bg-gray-200 rounded-full mb-3">
              <div className="h-2.5 rounded-full" style={{ width: `${Math.min((geoScore / 65) * 100, 100)}%`, backgroundColor: geoColor }} />
            </div>
            <div className="space-y-1 text-sm text-gray-600">
              {geo?.peer_avg != null && <p>Peer avg: <strong className="text-gray-800">{geo.peer_avg}</strong></p>}
              {geo?.percentile != null && geo?.peer_count != null && geo?.peer_state && (
                <p>Top <strong className="text-gray-800">{Math.max(1, Math.round(100 - geo.percentile))}%</strong> of {geo.peer_count} {geo.peer_state} peers</p>
              )}
            </div>
            {geoGap != null && geoGap > 15 && (
              <div className="mt-3 rounded p-2.5" style={{ backgroundColor: '#FEF3C7', border: '1px solid #F59E0B' }}>
                <p className="text-xs text-amber-800 leading-relaxed">
                  <strong>{'\u26A0\uFE0F'} Top competitor{geo?.top_peer_name ? ` (${geo.top_peer_name})` : ''} scores {geo?.top_peer_score}</strong> — a {geoGap}-point gap.
                </p>
              </div>
            )}
          </div>

          {/* RIGHT — SEO Signals */}
          <div className="rounded-lg p-5" style={{ backgroundColor: '#F8FAFC', border: '1px solid #E2E8F0' }}>
            <p className="text-xs font-medium text-gray-500 uppercase tracking-wide mb-3">SEO Signals</p>
            <div className="space-y-2.5">
              {SEO_SIGNALS.map((def) => {
                const val = seoSigs[def.key];
                const pass = val === true;
                const unknown = val == null;
                return (
                  <div key={def.key} className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      {unknown ? (
                        <span className="text-gray-300 text-sm">&mdash;</span>
                      ) : pass ? (
                        <svg width="16" height="16" viewBox="0 0 16 16" fill="none"><path d="M3.5 8.5L6.5 11.5L12.5 4.5" stroke="#10b981" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" /></svg>
                      ) : (
                        <svg width="16" height="16" viewBox="0 0 16 16" fill="none"><path d="M4 4l8 8M12 4l-8 8" stroke="#ef4444" strokeWidth="2" strokeLinecap="round" /></svg>
                      )}
                      <span className="text-sm" style={{ color: unknown ? '#D1D5DB' : '#374151' }}>{def.label}</span>
                    </div>
                    <Tip text={def.tooltip} />
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Panel 3 — Technical Signals */}
        <div className="mb-6">
          <p className="text-xs font-medium text-gray-500 uppercase tracking-wide mb-3">Technical Signals</p>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
            <TechSigCell
              label="GBP"
              status={result.signals?.gbp_claimed === true ? '\u2705' : result.signals?.gbp_claimed === false ? '\u26A0\uFE0F' : '\u2014'}
              value={result.signals?.gbp_claimed ? `${result.signals.gbp_rating ?? '\u2014'}\u2605 \u00B7 ${result.signals.gbp_reviews ?? 0} reviews` : 'Unclaimed'}
              good={result.signals?.gbp_claimed === true}
              tip="Primary AI data source for local search."
            />
            <TechSigCell
              label="DMARC"
              status={!result.signals?.dmarc_present ? '\u274C' : result.signals?.dmarc_policy === 'reject' ? '\u2705' : '\u26A0\uFE0F'}
              value={!result.signals?.dmarc_present ? 'Missing' : `Policy: ${result.signals.dmarc_policy ?? 'unknown'}`}
              good={!!result.signals?.dmarc_present && result.signals?.dmarc_policy === 'reject'}
              tip="Prevents email spoofing. Missing = FFIEC flag."
            />
            <TechSigCell
              label="DKIM"
              status={result.signals?.dkim_present ? '\u2705' : '\u26A0\uFE0F'}
              value={result.signals?.dkim_present ? 'Configured' : 'Not configured'}
              good={result.signals?.dkim_present === true}
              tip="Cryptographic email authentication."
            />
            <TechSigCell
              label="SPF"
              status={result.signals?.spf_present ? '\u2705' : '\u26A0\uFE0F'}
              value={result.signals?.spf_present ? 'Configured' : 'Missing'}
              good={result.signals?.spf_present === true}
              tip="Authorizes email sending servers."
            />
            <TechSigCell
              label="SSL / TLS"
              status={result.signals?.ssl_health === 'strong' ? '\u2705' : '\u26A0\uFE0F'}
              value={result.signals?.tls_version ?? result.signals?.ssl_health ?? 'Unknown'}
              good={result.signals?.ssl_health === 'strong' || result.signals?.ssl_health === 'adequate'}
              tip="Encrypts traffic. TLS 1.3 = gold standard."
              extra={result.signals?.cert_expiry_days != null && result.signals.cert_expiry_days < 90 ? `Cert: ${result.signals.cert_expiry_days}d` : undefined}
            />
            <TechSigCell
              label="Web Activity"
              status={result.signals?.web_velocity === 'active' ? '\u2705' : '\u26A0\uFE0F'}
              value={result.signals?.web_velocity ? `${result.signals.web_velocity.charAt(0).toUpperCase() + result.signals.web_velocity.slice(1)}` : 'No data'}
              good={result.signals?.web_velocity === 'active'}
              tip="Content freshness signal for AI engines."
            />
          </div>
        </div>

        {/* Panel 4 — Compliance strip */}
        {compliance && compliance.total > 0 && (
          <div className="rounded-lg p-4 mb-6 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3" style={{ backgroundColor: '#F8FAFC', border: '1px solid #E2E8F0' }}>
            <div className="flex items-center gap-4">
              <p className="text-xs font-medium text-gray-500 uppercase tracking-wide">Compliance</p>
              {compliance.high > 0 && (
                <span className="text-sm"><span className="inline-block w-2.5 h-2.5 rounded-full mr-1.5" style={{ backgroundColor: '#DC2626' }} />{compliance.high} High</span>
              )}
              {compliance.medium > 0 && (
                <span className="text-sm"><span className="inline-block w-2.5 h-2.5 rounded-full mr-1.5" style={{ backgroundColor: '#D97706' }} />{compliance.medium} Medium</span>
              )}
              {compliance.low > 0 && (
                <span className="text-sm"><span className="inline-block w-2.5 h-2.5 rounded-full mr-1.5" style={{ backgroundColor: '#9CA3AF' }} />{compliance.low} Low</span>
              )}
            </div>
            <Link href="/compliance-review" className="text-bf-navy text-sm font-medium hover:underline whitespace-nowrap">
              Learn more about compliance reviews &rarr;
            </Link>
          </div>
        )}

        {/* Footnote */}
        <p className="text-[10px] text-gray-400 text-center leading-relaxed">
          Source: BankForge March 2026 peer benchmarks &middot; Updated monthly &middot; PageSpeed and performance scores available after April 2026 sweep
        </p>

        {/* CTA */}
        <div className="text-center pt-4 mt-4 border-t border-gray-100">
          <p className="text-sm text-gray-600 mb-3">Ready to fix this?</p>
          <button
            onClick={() => document.getElementById('what-we-deliver')?.scrollIntoView({ behavior: 'smooth' })}
            className="text-bf-navy font-medium text-sm hover:underline cursor-pointer"
          >
            See what we deliver &darr;
          </button>
        </div>
      </div>
    </section>
  );
}

/* ─── Main page component ───────────────────────────────────────────── */

export default function GeoScorePageClient() {
  const [scanResult, setScanResult] = useState<any>(null);

  return (
    <div className="min-h-screen bg-white">
      {/* ─── NAV ───────────────────────────────────────────────── */}
      <SiteNav />

      {/* ─── HERO — scan input ─────────────────────────────────── */}
      <section className="pt-24 pb-16 px-6 min-h-[600px]" style={{ backgroundColor: '#0F2341' }}>
        <div className="max-w-3xl mx-auto text-center">
          {/* Eyebrow */}
          <p style={{ fontSize: '10px', fontWeight: 500, letterSpacing: '1.3px', textTransform: 'uppercase', color: 'rgba(255,255,255,0.4)', marginBottom: '14px' }}>
            For FDIC-Insured Banks
          </p>

          {/* Red pill badge */}
          <div className="flex justify-center mb-5">
            <span
              className="inline-flex items-center gap-2"
              style={{ backgroundColor: 'rgba(163,45,45,0.2)', border: '0.5px solid rgba(163,45,45,0.5)', borderRadius: '20px', padding: '5px 14px', fontSize: '11px', fontWeight: 500, color: '#F5A0A0' }}
            >
              <span className="relative flex h-1.5 w-1.5">
                <span className="absolute inline-flex h-full w-full rounded-full bg-[#F5A0A0] opacity-75" style={{ animation: 'pulse 2s ease-in-out infinite' }} />
                <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-[#F5A0A0]" />
              </span>
              16.6% of FDIC-Insured Banks are invisible to AI search. Are you?
            </span>
          </div>

          {/* H1 */}
          <h1
            className="text-4xl text-white leading-tight mb-5"
            style={{ fontFamily: 'var(--font-display)' }}
          >
            Your bank is invisible on AI search.
            <br />
            <em style={{ color: '#7EB3E8' }}>BankForge helps you fix it.</em>
          </h1>

          {/* Subheadline */}
          <p style={{ fontSize: '14px', color: 'rgba(255,255,255,0.55)', maxWidth: '520px', lineHeight: 1.7, margin: '0 auto 28px' }}>
            The gap between the top and bottom performer in the same market
            averages <strong style={{ color: 'rgba(255,255,255,0.85)', fontWeight: 400 }}>35 points</strong>. The institution that fixes it first owns
            the query &mdash; and the customer. And with Marketing Intelligence, you keep them too.
          </p>

          {/* Scan input with gold glow */}
          {!scanResult ? (
            <div>
              <div className="bf-glow max-w-lg mx-auto mt-4">
                <GeoScanInput onResult={setScanResult} />
              </div>
              <p style={{ fontSize: '11px', color: 'rgba(255,255,255,0.25)', marginTop: '10px' }}>
                Reads from our March 2026 data &mdash; updated monthly
              </p>
            </div>
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

          {/* Stat strip */}
          <div style={{ borderTop: '0.5px solid rgba(255,255,255,0.07)', paddingTop: '32px', marginTop: '32px' }}>
            <div className="grid grid-cols-3 gap-4">
              {stats.map((s, i) => (
                <div key={i} className="text-center" style={{ borderRight: i < 2 ? '0.5px solid rgba(255,255,255,0.07)' : 'none' }}>
                  {s.stacked ? (
                    <div className="flex flex-col items-center">
                      <span style={{ fontFamily: 'var(--font-display)', fontSize: '20px', color: '#7EB3E8' }}>{s.stacked[0]}</span>
                      <span style={{ fontFamily: 'var(--font-display)', fontSize: '20px', color: '#7EB3E8' }}>&middot; {s.stacked[1]}</span>
                    </div>
                  ) : (
                    <p style={{ fontFamily: 'var(--font-display)', fontSize: '28px', color: '#7EB3E8' }}>{s.value}</p>
                  )}
                  <p style={{ fontSize: '10px', color: 'rgba(255,255,255,0.38)', fontWeight: 300, maxWidth: '140px', margin: '4px auto 0' }}>{s.label}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ─── SCAN RESULTS ────────────────────────────────────────── */}
      {scanResult && <AiSeoResultPanel result={scanResult} />}

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
                {tier.step === '2' && (
                  <div className="flex items-center justify-center mb-2">
                    <div className="flex items-center gap-1.5 bg-amber-50 border border-[#c8a84b]/40 text-[#0f2341] text-xs font-medium px-3 py-1 rounded-full">
                      <span className="text-[#c8a84b]">★</span>
                      <span>Most Clients Add This</span>
                    </div>
                  </div>
                )}
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
                    {tier.items.map((item, i) => {
                      const isGold = item.startsWith('__GOLD__');
                      const text = isGold ? item.replace('__GOLD__', '') : item;
                      return (
                        <li key={i} className="text-sm text-gray-600 leading-relaxed flex gap-2">
                          <span className="text-bf-navy mt-0.5 shrink-0">&bull;</span>
                          {isGold ? (
                            <span className="font-semibold text-[#c8a84b]">{text}</span>
                          ) : (
                            <span>{text}</span>
                          )}
                        </li>
                      );
                    })}
                  </ul>
                  {tier.ctaType === 'active' ? (
                    <DemoRequestForm
                      audienceType="bank"
                      sourcePage="/ai-seo-score"
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
                {tier.step === '2' && (
                  <div className="flex items-center justify-center mb-2 mt-4">
                    <div className="flex items-center gap-1.5 bg-amber-50 border border-[#c8a84b]/40 text-[#0f2341] text-xs font-medium px-3 py-1 rounded-full">
                      <span className="text-[#c8a84b]">★</span>
                      <span>Most Clients Add This</span>
                    </div>
                  </div>
                )}
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
                    {tier.items.map((item, i) => {
                      const isGold = item.startsWith('__GOLD__');
                      const text = isGold ? item.replace('__GOLD__', '') : item;
                      return (
                        <li key={i} className="text-sm text-gray-600 leading-relaxed flex gap-2">
                          <span className="text-bf-navy mt-0.5 shrink-0">&bull;</span>
                          {isGold ? (
                            <span className="font-semibold text-[#c8a84b]">{text}</span>
                          ) : (
                            <span>{text}</span>
                          )}
                        </li>
                      );
                    })}
                  </ul>
                  {tier.ctaType === 'active' ? (
                    <DemoRequestForm
                      audienceType="bank"
                      sourcePage="/ai-seo-score"
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

      {/* ─── MARKETING INTELLIGENCE ───────────────────────────── */}
      <section className="py-16 px-6">
        <div className="max-w-5xl mx-auto">
          <div className="rounded-xl bg-white border border-gray-200 p-8">
            <h3 className="text-xl text-gray-900 mb-4" style={{ fontFamily: 'var(--font-display)' }}>
              What marketing intelligence means in practice
            </h3>
            <p className="text-sm text-gray-600 leading-relaxed mb-8">
              Every month, BankForge runs 37 signals across your institution&apos;s digital presence
              and compares them to your nearest competitors. You get a summary of what changed,
              what AI engines are citing about you vs. peers, and where you&apos;re losing ground
              before it shows up in your deposit pipeline.
            </p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {/* Left — Signals include */}
              <div>
                <p className="text-xs font-medium text-gray-500 uppercase tracking-wide mb-3">Signals include</p>
                <div className="flex flex-wrap gap-2">
                  {[
                    'AI search citations', 'Local pack position', 'Competitor site changes',
                    'Schema & structured data drift', 'Third-party vendor presence', 'App store ratings',
                    'Web content authority signals', 'SEO ranking signals', 'Mobile performance', 'Page speed scores',
                  ].map((s) => (
                    <span key={s} className="text-xs px-3 py-1.5 rounded-full bg-gray-100 text-gray-600">{s}</span>
                  ))}
                  <span className="text-xs px-3 py-1.5 rounded-full border border-dashed border-gray-300 text-gray-400 italic">+ more to come</span>
                </div>
              </div>
              {/* Right — By the numbers */}
              <div>
                <p className="text-xs font-medium text-gray-500 uppercase tracking-wide mb-3">By the numbers</p>
                <div className="grid grid-cols-2 gap-3">
                  {[
                    { num: '37', label: 'Signals tracked monthly' },
                    { num: '4,300+', label: 'Peer benchmarks' },
                    { num: '5', label: 'Nearest competitors tracked' },
                    { num: 'Monthly', label: 'Report cadence' },
                  ].map((s) => (
                    <div key={s.num} className="rounded-lg p-3" style={{ backgroundColor: '#F8FAFC', border: '1px solid #E2E8F0' }}>
                      <p className="text-xl mb-0.5" style={{ fontFamily: 'var(--font-display)', color: '#1B5299' }}>{s.num}</p>
                      <p className="text-xs text-gray-500">{s.label}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ─── CROSS-LINK: COMPLIANCE REVIEW ─────────────────────── */}
      <section className="px-6 pb-12">
        <div className="max-w-5xl mx-auto">
          <div className="rounded-xl bg-white border border-gray-200 p-8">
            <p className="text-bf-navy text-xs font-medium tracking-wide uppercase mb-3">Going deeper</p>
            <h3 className="text-xl text-gray-900 mb-3" style={{ fontFamily: 'var(--font-display)' }}>
              Need compliance findings alongside your AI SEO score?
            </h3>
            <p className="text-sm text-gray-600 leading-relaxed mb-4">
              The BankForge Compliance Review includes AI SEO + Marketing Intelligence
              monitoring from Month 1 &mdash; alongside Reg DD, UDAAP, Equal Housing, and FFIEC
              findings. Starting at $1,750/mo for community banks.
            </p>
            <Link href="/compliance-review" className="text-bf-navy text-sm font-medium hover:underline">
              &rarr; See Compliance Review pricing
            </Link>
          </div>
        </div>
      </section>

      {/* ─── STAT ROW ──────────────────────────────────────────── */}
      <section className="py-12 px-6">
        <div className="max-w-5xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
          {stats.map((s, i) => (
            <div key={i}>
              {s.stacked ? (
                <div className="flex flex-col items-center mb-1">
                  <span className="text-3xl" style={{ fontFamily: 'var(--font-display)', color: '#1B5299' }}>{s.stacked[0]}</span>
                  <span className="text-3xl" style={{ fontFamily: 'var(--font-display)', color: '#1B5299' }}>&middot; {s.stacked[1]}</span>
                </div>
              ) : (
                <p className="text-3xl mb-1" style={{ fontFamily: 'var(--font-display)', color: '#1B5299' }}>{s.value}</p>
              )}
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
              The first FDIC-Insured Bank to fix it owns the query.
            </h2>
            <p className="text-blue-200/70 text-sm leading-relaxed mb-6">
              BankForge has already computed your institution&apos;s AI SEO score.
              Request the report and see exactly where you stand.
            </p>
            <DemoRequestForm
              audienceType="bank"
              sourcePage="/ai-seo-score"
              sourceCta="cta_block"
              ctaLabel="Get Your AI SEO + Intelligence Report"
            />
          </div>
        </div>
      </section>

      {/* ─── FOOTER ────────────────────────────────────────────── */}
      <footer className="py-6 px-6 border-t border-gray-100">
        <div className="max-w-5xl mx-auto flex flex-col md:flex-row items-center justify-between gap-2 text-[11px] text-gray-400">
          <span className="flex items-center gap-2">
            <span style={{ fontFamily: 'var(--font-display)' }} className="text-gray-500 text-sm">
              <span style={{ color: '#1B5299' }}>BankForge</span>.ai
            </span>
            <span className="text-gray-300">·</span>
            <a href="https://www.linkedin.com/company/bankforge-ai" target="_blank" rel="noopener noreferrer" className="text-gray-500 hover:text-gray-700 transition-colors">LinkedIn</a>
          </span>
          <span className="text-center">
            BankForge flags findings for compliance counsel review. We never conclude a violation.
          </span>
          <span className="flex items-center gap-2">&copy; 2026 BankForge.ai LLC<span className="text-gray-300">·</span><a href="/privacy" className="text-gray-500 hover:text-gray-700 transition-colors">Privacy Policy</a><span className="text-gray-300">·</span><a href="/terms" className="text-gray-500 hover:text-gray-700 transition-colors">Terms of Service</a></span>
        </div>
      </footer>
    </div>
  );
}
