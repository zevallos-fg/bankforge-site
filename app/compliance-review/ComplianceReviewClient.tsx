'use client';

import { useState } from 'react';
import Link from 'next/link';
import { getCorpusMonthLabel } from '@/app/lib/corpus-month';
import ComplianceScanResult from '../components/ComplianceScanResult';

// ─── Finding cards data ───────────────────────────────────────────────

const FINDING_CARDS = [
  { tag: 'HIGH', tagColor: 'red' as const, title: 'Rate advertisement missing Reg DD triggering terms', desc: "APY displayed without effective date, minimum balance, or fees disclosure. On the examiner\u2019s checklist every cycle.", ref: 'Reg DD / 12 CFR 1030' },
  { tag: 'HIGH', tagColor: 'red' as const, title: 'Equal Housing Lender disclosure absent from mortgage pages', desc: 'Required statement or logo not detected on consumer lending pages. Consistent examiner flag across FDIC, OCC, and CFPB supervised institutions.', ref: 'ECOA / Reg B / FFIEC' },
  { tag: 'HIGH', tagColor: 'red' as const, title: 'UDAAP dark pattern signal detected', desc: 'Teaser rate or promotional language without clear conditions. Unfair or deceptive presentation under CFPB UDAAP examination framework.', ref: 'UDAAP / CFPB' },
  { tag: 'MEDIUM', tagColor: 'amber' as const, title: 'Privacy notice not readily accessible', desc: 'Privacy notice absent from footer or not linked from account-opening pages. Cross-referenced against public website structure.', ref: 'Gramm-Leach-Bliley / Reg P' },
];

// ─── Pricing tiers ────────────────────────────────────────────────────

const TIERS = [
  {
    asset: '$100M\u2013$1B',
    name: 'Community',
    price: '$1,750/mo',
    founding: 'Month 1\u20136 \u00b7 first 5 institutions',
    stepUp: '\u2191 $3,000/mo at Month 7',
    highlight: true,
    features: [
      'Reg DD, UDAAP, Equal Housing, FFIEC',
      'Up to 20 pages scanned',
      'Severity-graded findings: Low / Medium / High',
      'Regulatory citation on every finding',
      'Peer benchmark \u2014 4,300+ FDIC-Insured Bank corpus',
      'DOCX delivered within 5 business days',
    ],
    unlocks: null,
    cta: 'Get Early Access',
    ctaStyle: 'primary' as const,
  },
  {
    asset: '$1B\u2013$5B',
    name: 'Growth',
    price: '$2,500/mo',
    founding: 'Month 1\u20136 \u00b7 first 5 institutions',
    stepUp: '\u2191 $4,500/mo at Month 7',
    highlight: false,
    features: [
      'All Community scope',
      'Multi-product line analysis',
      'Competitive intelligence \u2014 nearest 5 peers by MSA',
      'Regulatory environment overlay (FFIEC CDR trends)',
      'Vendor stack signals included',
    ],
    unlocks: ['Scan scope expands to 50 pages', 'Executive dashboard unlocks'],
    cta: 'Get Early Access',
    ctaStyle: 'secondary' as const,
  },
  {
    asset: '$5B\u2013$50B',
    name: 'Regional',
    price: '$5,000/mo',
    founding: 'Month 1\u20136 \u00b7 first 5 institutions',
    stepUp: '\u2191 $8,500/mo at Month 7',
    highlight: false,
    features: [
      'All Growth scope',
      'BHC subsidiary mapping',
      'Multi-market peer benchmarking',
      'Exam cycle proximity signal',
    ],
    unlocks: ['Scan scope expands to 100 pages', 'BHC-level executive dashboard'],
    cta: 'Get Early Access',
    ctaStyle: 'secondary' as const,
  },
  {
    asset: '$50B+ / BHC',
    name: 'Enterprise',
    price: 'Custom',
    founding: 'Direct engagement',
    stepUp: null,
    highlight: false,
    features: [
      'Full Regional scope',
      'Unlimited pages \u2014 full site coverage',
      'BHC structure + all subsidiary entities',
      'Named CCO engagement',
      'Custom exam cycle monitoring',
      'Board-ready reporting format',
    ],
    unlocks: null,
    cta: 'Contact Us',
    ctaStyle: 'outline' as const,
  },
];

// ─── Helpers ──────────────────────────────────────────────────────────

function deriveBankName(input: string): string {
  const clean = input.trim().toLowerCase().replace(/^https?:\/\//, '').replace(/^www\./, '').replace(/\/.*$/, '');
  const seg = clean.split('.')[0] ?? 'bank';
  return seg.charAt(0).toUpperCase() + seg.slice(1) + ' Bank';
}

// ─── Component ────────────────────────────────────────────────────────

/* eslint-disable @typescript-eslint/no-explicit-any */

export default function ComplianceReviewClient() {
  const [domain, setDomain] = useState('');
  const [scanState, setScanState] = useState<'idle' | 'loading' | 'found' | 'not_found' | 'error'>('idle');
  const [scanResult, setScanResult] = useState<any>(null);
  const [bankName, setBankName] = useState('');
  const [notifyEmail, setNotifyEmail] = useState('');
  const [notifySent, setNotifySent] = useState(false);

  async function handleScan() {
    if (!domain.trim()) return;
    const clean = domain.trim().toLowerCase().replace(/^https?:\/\//, '').replace(/^www\./, '').replace(/\/.*$/, '');
    setBankName(deriveBankName(domain));
    setScanState('loading');
    try {
      const res = await fetch(`/api/scan-preview?domain=${encodeURIComponent(clean)}`);
      if (res.status === 429) { setScanState('error'); return; }
      const data = await res.json();
      if (data.found) {
        setScanResult(data);
        setScanState('found');
      } else {
        setScanState('not_found');
      }
    } catch {
      setScanState('error');
    }
  }

  async function handleNotify() {
    if (!notifyEmail.includes('@')) return;
    try {
      await fetch('/api/waitlist', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ firstName: 'Compliance Scan Request', bankName: domain, email: notifyEmail, source: 'compliance_not_found' }),
      });
      setNotifySent(true);
    } catch { /* silent */ }
  }

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

      {/* ─── HERO ──────────────────────────────────────────────── */}
      <section className="pt-24 pb-16 px-6 min-h-[600px]" style={{ backgroundColor: '#0F2341' }}>
        <div className="max-w-xl mx-auto text-center">
          <p style={{ fontSize: '10px', textTransform: 'uppercase', letterSpacing: '1.3px', color: 'rgba(255,255,255,0.4)', marginBottom: '16px' }}>
            For FDIC-Insured Banks
          </p>

          <div className="flex justify-center mb-6">
            <span
              className="inline-flex items-center gap-2"
              style={{ backgroundColor: 'rgba(163,45,45,0.2)', border: '1px solid rgba(163,45,45,0.5)', borderRadius: '20px', padding: '5px 14px', fontSize: '11px', color: '#F5A0A0' }}
            >
              <span className="relative flex h-1.5 w-1.5">
                <span className="absolute inline-flex h-full w-full rounded-full bg-[#F5A0A0] opacity-75" style={{ animation: 'pulse 2s ease-in-out infinite' }} />
                <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-[#F5A0A0]" />
              </span>
              67% of FDIC-Insured Banks have at least one High compliance finding
            </span>
          </div>

          <h1 style={{ fontFamily: 'var(--font-display)', fontSize: '38px', fontWeight: 400, lineHeight: 1.1, color: '#fff', marginBottom: '20px' }}>
            Your website has compliance exposure.
            <br />
            <em style={{ color: '#7EB3E8' }}>BankForge finds it first.</em>
          </h1>

          <p style={{ fontSize: '14px', color: 'rgba(255,255,255,0.55)', maxWidth: '440px', lineHeight: 1.7, margin: '0 auto 32px' }}>
            BankForge scans your institution&apos;s public digital footprint against Reg DD, UDAAP,
            Equal Housing, and FFIEC standards &mdash; flagging what&apos;s on every examiner&apos;s
            checklist before your next exam cycle.
          </p>

          <p style={{ fontSize: '11px', color: 'rgba(255,255,255,0.4)', letterSpacing: '0.5px', marginBottom: '8px' }}>
            See your compliance findings.
          </p>
          <div className="bf-glow max-w-md mx-auto">
            <div className="flex" style={{ border: '1px solid rgba(255,255,255,0.15)', borderRadius: '8px', overflow: 'hidden' }}>
              <input
                type="text"
                placeholder="yourbank.com"
                value={domain}
                onChange={(e) => setDomain(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleScan()}
                style={{ flex: 1, background: 'rgba(255,255,255,0.06)', border: 'none', padding: '13px 16px', fontSize: '13px', color: '#fff', outline: 'none' }}
              />
              <button
                onClick={handleScan}
                disabled={scanState === 'loading' || !domain.trim()}
                style={{ background: '#1B5299', color: '#fff', padding: '13px 20px', fontSize: '12px', fontWeight: 500, border: 'none', cursor: 'pointer', whiteSpace: 'nowrap', opacity: scanState === 'loading' ? 0.6 : 1 }}
              >
                {scanState === 'loading' ? 'Checking...' : 'See your findings \u2193'}
              </button>
            </div>
          </div>
          <p style={{ fontSize: '11px', color: 'rgba(255,255,255,0.25)', marginTop: '8px' }}>
            Reads from our {getCorpusMonthLabel()}{' '}data &middot; 1 lookup per firm per 72 hrs
          </p>

          {scanState === 'found' && scanResult && (
            <div className="mt-8 text-center">
              <p className="text-white/80 text-sm">{'\u2713'} Found {scanResult.entity?.name ?? bankName}</p>
              <button
                onClick={() => document.getElementById('compliance-scan-results')?.scrollIntoView({ behavior: 'smooth' })}
                className="text-white/60 text-xs mt-2 underline cursor-pointer"
              >
                Jump to results &darr;
              </button>
            </div>
          )}

          {scanState === 'not_found' && !notifySent && (
            <div className="max-w-md mx-auto mt-8 text-center">
              <p className="text-white/70 text-sm mb-4">
                We haven&apos;t scanned this institution yet. Enter your email and we&apos;ll reach out when it&apos;s ready.
              </p>
              <div className="flex gap-2">
                <input type="email" placeholder="your@email.com" value={notifyEmail} onChange={(e) => setNotifyEmail(e.target.value)} onKeyDown={(e) => e.key === 'Enter' && handleNotify()} className="flex-1 rounded-lg border border-white/30 bg-white/10 px-4 py-3 text-sm text-white placeholder-white/50 focus:border-white/60 focus:outline-none" />
                <button onClick={handleNotify} className="bg-white text-[#0F2341] font-medium px-6 py-3 rounded-lg text-sm cursor-pointer">Notify me</button>
              </div>
              <button onClick={() => { setScanState('idle'); setDomain(''); }} className="text-xs text-white/40 hover:text-white/60 mt-3 cursor-pointer">&larr; Try a different domain</button>
            </div>
          )}

          {scanState === 'not_found' && notifySent && (
            <div className="max-w-md mx-auto mt-8 text-center">
              <p className="text-white/80 text-sm">Got it. We&apos;ll reach out when your scan is ready.</p>
            </div>
          )}

          {scanState === 'error' && (
            <div className="max-w-md mx-auto mt-8 text-center">
              <p className="text-white/70 text-sm mb-2">One preview scan is available every 72 hours.</p>
              <button onClick={() => { setScanState('idle'); setDomain(''); }} className="text-xs text-white/40 hover:text-white/60 cursor-pointer">&larr; Try again later</button>
            </div>
          )}

          <div style={{ borderTop: '0.5px solid rgba(255,255,255,0.07)', paddingTop: '32px', marginTop: '32px' }}>
            <div className="grid grid-cols-3 gap-4">
              {[
                { num: '4,300+', label: 'FDIC-Insured Banks scanned' },
                { num: '89.5%', label: 'Have Reg DD findings on their website' },
                { num: '83.4%', label: 'Have website accessibility issues' },
              ].map((s, i) => (
                <div key={i} className="text-center" style={{ borderRight: i < 2 ? '0.5px solid rgba(255,255,255,0.07)' : 'none' }}>
                  <p style={{ fontFamily: 'var(--font-display)', fontSize: '28px', color: '#7EB3E8' }}>{s.num}</p>
                  <p style={{ fontSize: '10px', color: 'rgba(255,255,255,0.38)', fontWeight: 300, maxWidth: '140px', margin: '4px auto 0' }}>{s.label}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ─── SCAN RESULTS (conditional) ────────────────────────── */}
      {scanState === 'found' && scanResult && (
        <section id="compliance-scan-results" className="py-16 px-6 bg-white border-b border-gray-100">
          <div className="max-w-4xl mx-auto">
            <ComplianceScanResult result={scanResult} />
          </div>
        </section>
      )}

      {/* ─── WHAT WE SURFACE ───────────────────────────────────── */}
      <section className="py-16 px-6">
        <div className="max-w-5xl mx-auto">
          <p className="text-bf-navy text-xs font-medium tracking-wide uppercase mb-3">What we surface</p>
          <h2 className="text-3xl text-gray-900 mb-3" style={{ fontFamily: 'var(--font-display)' }}>
            The deficiency patterns examiners flag every cycle.
          </h2>
          <p className="text-sm text-gray-500 mb-10">
            Every finding mapped to its rule citation. Reviewed by our team before delivery.
            We flag for counsel &mdash; never conclude a violation.
          </p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {FINDING_CARDS.map((card, i) => (
              <div
                key={i}
                className="rounded-xl p-5 bg-white"
                style={{
                  border: card.tagColor === 'amber' ? '1px solid #E8C055' : '1px solid #d1dbe8',
                  borderLeft: card.tagColor === 'amber' ? '4px solid #E8C055' : '4px solid #A32D2D',
                }}
              >
                <span className="inline-block text-[10px] font-medium uppercase tracking-wider px-2 py-0.5 rounded mb-2" style={{ backgroundColor: card.tagColor === 'red' ? '#FEE2E2' : '#FEF3C7', color: card.tagColor === 'red' ? '#991B1B' : '#92400E' }}>
                  {card.tag}
                </span>
                <h3 className="text-sm font-medium text-gray-900 mb-1">{card.title}</h3>
                <p className="text-sm text-gray-600 leading-relaxed mb-2">{card.desc}</p>
                <p className="text-xs text-gray-400">{card.ref}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ─── PRICING ───────────────────────────────────────────── */}
      <section id="pricing-section" className="py-16 px-6" style={{ backgroundColor: '#F2F4F7' }}>
        <div className="max-w-5xl mx-auto">
          <p className="text-bf-navy text-xs font-medium tracking-wide uppercase mb-3">Pricing by institution size</p>
          <h2 className="text-3xl text-gray-900 mb-3" style={{ fontFamily: 'var(--font-display)' }}>
            Compliance Review pricing bands.
          </h2>
          <p className="text-sm text-gray-500 mb-10">
            Priced by asset tier, not by seat or usage. Larger institutions have more pages,
            more product lines, and more regulatory surface area &mdash; pricing reflects that scope.
          </p>

          {/* Tier cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-4">
            {TIERS.map((tier) => (
              <div key={tier.name} className="rounded-xl p-6 bg-white flex flex-col" style={{ border: tier.highlight ? '2px solid #1B5299' : '1px solid #e5e7eb' }}>
                {/* Block 1: Asset + Name */}
                <p className="text-xs uppercase tracking-wide text-gray-400 mb-1">{tier.asset}</p>
                <h3 className="text-lg font-semibold text-gray-900 mb-3" style={{ fontFamily: 'var(--font-display)' }}>{tier.name}</h3>

                {/* Block 2: Price + founding + stepUp */}
                <div className="min-h-[72px] mb-3">
                  <p className="text-3xl text-gray-900" style={{ fontFamily: 'var(--font-display)' }}>{tier.price}</p>
                  <p className="text-xs text-gray-500 mt-1">{tier.founding}</p>
                  {tier.stepUp ? (
                    <p className="text-xs text-gray-500">{tier.stepUp}</p>
                  ) : (
                    <p className="text-xs text-transparent select-none">&nbsp;</p>
                  )}
                </div>

                {/* Block 3: AI SEO inclusion */}
                <div className="rounded-lg px-3 py-2 mb-4" style={{ backgroundColor: '#EBF1FA' }}>
                  <p className="text-xs text-bf-navy">
                    <span className="mr-1">{'\u2605'}</span>
                    AI SEO + Marketing Intelligence monitoring included ($999/mo value) — built into every tier
                  </p>
                </div>

                {/* Block 4: Features + optional Unlocks */}
                <ul className="space-y-2 mb-4 flex-1">
                  {tier.features.map((f, i) => (
                    <li key={i} className="text-sm text-gray-600 leading-relaxed flex gap-2">
                      <span className="text-bf-navy mt-0.5 shrink-0">&bull;</span>
                      <span>{f}</span>
                    </li>
                  ))}
                </ul>
                {tier.unlocks && (
                  <div className="rounded-lg p-3 mb-4" style={{ backgroundColor: '#FFFBF0', border: '1px solid #C8A84B' }}>
                    <p className="text-[10px] font-medium uppercase tracking-wider mb-1.5" style={{ color: '#C8A84B' }}>Unlocks</p>
                    {tier.unlocks.map((u, i) => (
                      <p key={i} className="text-xs leading-relaxed flex gap-1.5" style={{ color: '#92710A' }}>
                        <span style={{ color: '#C8A84B' }}>&bull;</span> {u}
                      </p>
                    ))}
                  </div>
                )}

                {/* Block 5: CTA */}
                {tier.ctaStyle === 'primary' && (
                  <a href="mailto:outreach@bankforge.ai?subject=Compliance%20Review%20Early%20Access" className="block w-full text-center bg-bf-navy-deep text-white font-medium py-3 rounded-lg text-sm transition-colors hover:opacity-90">
                    {tier.cta}
                  </a>
                )}
                {tier.ctaStyle === 'secondary' && (
                  <a href="mailto:outreach@bankforge.ai?subject=Compliance%20Review%20Early%20Access" className="block w-full text-center text-bf-navy-deep font-medium py-3 rounded-lg text-sm transition-colors border border-bf-navy-deep hover:bg-bf-navy-deep hover:text-white">
                    {tier.cta}
                  </a>
                )}
                {tier.ctaStyle === 'outline' && (
                  <a href="mailto:outreach@bankforge.ai?subject=Enterprise%20Compliance%20Review" className="block w-full text-center text-bf-navy-deep font-medium py-3 rounded-lg text-sm transition-colors border border-gray-300 hover:border-bf-navy-deep">
                    {tier.cta}
                  </a>
                )}
              </div>
            ))}
          </div>

          <p className="text-xs text-gray-400 text-center mb-12">
            Founding rate expires January 1, 2027 or when the 5th institution signs, whichever comes first.
            Step-up is automatic and written into the agreement.
          </p>

          {/* ─── Compliance Remediation block ───────────────────── */}
          <div className="rounded-xl bg-white border border-gray-200 p-6">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6">
              <div>
                <p className="text-xs uppercase tracking-wide text-gray-400 mb-1">Available September 2026 &middot; To Subscribers</p>
                <h3 className="text-xl text-gray-900" style={{ fontFamily: 'var(--font-display)' }}>Compliance Remediation</h3>
              </div>
              <div className="flex-1 md:ml-6 bg-bf-navy-deep rounded-xl px-6 py-3 text-center md:text-left">
                <p className="text-[9px] uppercase tracking-wider text-white/40">Launching</p>
                <p className="text-xl font-bold text-white" style={{ fontFamily: 'var(--font-display)' }}>September 2026</p>
                <p className="text-xs" style={{ color: '#C8A84B' }}>Subscribers only</p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="rounded-xl p-5" style={{ backgroundColor: '#F2F4F7' }}>
                <p className="text-sm text-gray-600 leading-relaxed mb-3">
                  Structured as working sessions &mdash; each covering up to 2 High findings &mdash; with an optional
                  examiner-ready memo for exam prep, MRA responses, or self-assessment documentation.
                </p>
                <ul className="space-y-2">
                  {[
                    'Structured remediation roadmap for each finding',
                    'Working session with your compliance or legal team',
                    'Prioritized by exam cycle proximity',
                    'No vendor dependency \u2014 your team owns execution',
                    'Examiner-ready memo available on High findings',
                  ].map((item, i) => (
                    <li key={i} className="text-sm text-gray-600 leading-relaxed flex gap-2">
                      <span className="text-bf-navy mt-0.5 shrink-0">&bull;</span>
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="rounded-xl p-5" style={{ backgroundColor: '#F2F4F7' }}>
                <div className="border-b border-gray-200 pb-3 mb-3">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-semibold text-gray-900">Per session</p>
                      <p className="text-xs text-gray-400">Up to 2 High findings &middot; 30-min working session</p>
                    </div>
                    <p className="text-2xl font-bold text-gray-900" style={{ fontFamily: 'var(--font-display)' }}>$750</p>
                  </div>
                </div>
                <div className="pb-3 mb-3">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-semibold text-gray-900">+ Examiner-ready memo</p>
                      <p className="text-xs text-gray-400">Exam prep &middot; MRA response &middot; Self-assessment</p>
                    </div>
                    <p className="text-2xl font-bold text-gray-900" style={{ fontFamily: 'var(--font-display)' }}>+$250</p>
                  </div>
                </div>
                <p className="text-xs text-gray-400 border-t border-gray-200 pt-3">
                  As many sessions as needed. An FDIC-Insured Bank with 5 High findings needs 3 sessions &mdash;
                  $2,250 standard, $3,000 with full memo documentation.
                </p>
                <a
                  href="mailto:outreach@bankforge.ai?subject=Compliance%20Remediation%20September%202026"
                  className="block w-full text-center bg-bf-navy-deep text-white font-medium py-3 rounded-lg text-sm mt-4 opacity-50 cursor-not-allowed"
                  onClick={(e) => e.preventDefault()}
                >
                  Notify Me for September Launch
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ─── BOTTOM CTA ────────────────────────────────────────── */}
      <section className="mx-7 mb-12 mt-12">
        <div className="bg-bf-navy-deep rounded-[10px] py-14 px-10 text-center">
          <div className="max-w-xl mx-auto">
            <h2 className="text-white text-3xl mb-4" style={{ fontFamily: 'var(--font-display)' }}>
              Your website is already being evaluated.
            </h2>
            <p className="text-gray-300 text-sm leading-relaxed mb-6">
              BankForge reviews every finding before delivery. No vendor energy. No AI noise.
              Examiner-side methodology from an institution-side compliance professional.
            </p>
            <a
              href="mailto:outreach@bankforge.ai?subject=Compliance%20Review%20Early%20Access"
              className="inline-block bg-white text-bf-navy-deep font-medium px-6 py-3 rounded-lg text-sm hover:bg-gray-50 transition-colors"
            >
              Get Early Access &mdash; Launching June 2026
            </a>
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
