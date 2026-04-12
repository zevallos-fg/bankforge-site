'use client';

import { useState } from 'react';
import Link from 'next/link';
import { getCorpusMonth, getCorpusMonthLabel } from '@/app/lib/corpus-month';
import SiteNav from '../components/SiteNav';

// ─── Simulated findings (always the same regardless of input) ─────────

const DEMO_FINDINGS = [
  { severity: 'HIGH', text: 'Testimonial displayed without compensation disclosure or material conditions legend', ref: 'Rule 206(4)-1(b)(1)' },
  { severity: 'HIGH', text: 'Third-party rating shown without criteria, date range, or compensation disclosure', ref: 'Rule 206(4)-1(c)(1)' },
  { severity: 'MEDIUM', text: 'Reg S-P privacy notice not readily accessible from homepage or contact page', ref: 'Reg S-P / 17 CFR 248' },
];

const FINDING_CARDS = [
  { tag: 'HIGH', tagColor: 'red', title: 'Testimonial displayed without required legend', desc: 'Client quote or endorsement present without compensation disclosure and material conditions legend. Top Risk Alert deficiency.', ref: 'Rule 206(4)-1(b)(1)' },
  { tag: 'HIGH', tagColor: 'red', title: 'Third-party rating without required context', desc: 'Star rating or ranking displayed without criteria, date range, or compensation disclosure. Cited directly in December 2025 Risk Alert.', ref: 'Rule 206(4)-1(c)(1)' },
  { tag: 'HIGH', tagColor: 'red', title: 'Performance advertising without required disclosures', desc: 'Hypothetical or extracted performance presented without prominent disclosure of material assumptions and limitations.', ref: 'Rule 206(4)-1(d)' },
  { tag: 'MEDIUM', tagColor: 'amber', title: 'Reg S-P privacy notice accessibility gap', desc: 'Privacy notice not readily accessible or absent from digital presence. Cross-referenced against Form ADV Part 2A disclosures.', ref: 'Reg S-P / 17 CFR 248' },
];

function deriveFirmName(domain: string): string {
  const clean = domain.trim().toLowerCase().replace(/^https?:\/\//, '').replace(/^www\./, '').replace(/\/.*$/, '');
  const seg = clean.split('.')[0] ?? 'firm';
  return seg.charAt(0).toUpperCase() + seg.slice(1) + ' Advisers';
}

// ─── Page ─────────────────────────────────────────────────────────────

export default function SecMarketingClient() {
  const [domain, setDomain] = useState('');
  const [showResults, setShowResults] = useState(false);
  const [firmName, setFirmName] = useState('');

  function handleScan() {
    if (!domain.trim()) return;
    setFirmName(deriveFirmName(domain));
    setShowResults(true);
  }

  return (
    <div className="min-h-screen bg-white">
      {/* ─── NAV ───────────────────────────────────────────────── */}
      <SiteNav />

      {/* ─── HERO ──────────────────────────────────────────────── */}
      <section className="pt-24 pb-16 px-6" style={{ backgroundColor: '#0F2341' }}>
        <div className="max-w-xl mx-auto text-center">
          {/* Eyebrow */}
          <p style={{ fontSize: '10px', textTransform: 'uppercase', letterSpacing: '1.3px', color: 'rgba(255,255,255,0.4)', marginBottom: '16px' }}>
            For Registered Investment Advisers
          </p>

          {/* Alert badge */}
          <div className="flex justify-center mb-6">
            <span
              className="inline-flex items-center gap-2"
              style={{ backgroundColor: 'rgba(163,45,45,0.2)', border: '1px solid rgba(163,45,45,0.5)', borderRadius: '20px', padding: '5px 14px', fontSize: '11px', color: '#F5A0A0' }}
            >
              <span className="relative flex h-1.5 w-1.5">
                <span className="absolute inline-flex h-full w-full rounded-full bg-[#F5A0A0] opacity-75" style={{ animation: 'pulse 2s ease-in-out infinite' }} />
                <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-[#F5A0A0]" />
              </span>
              December 2025 SEC Risk Alert — Marketing Rule deficiencies identified
            </span>
          </div>

          {/* H1 */}
          <h1 style={{ fontFamily: 'var(--font-display)', fontSize: '38px', fontWeight: 400, lineHeight: 1.1, color: '#fff', marginBottom: '20px' }}>
            Your marketing is already under review.
            <br />
            <em style={{ color: '#7EB3E8' }}>BankForge finds it first.</em>
          </h1>

          {/* Subheadline */}
          <p style={{ fontSize: '14px', color: 'rgba(255,255,255,0.55)', maxWidth: '520px', lineHeight: 1.7, margin: '0 auto 32px' }}>
            The December 2025 Risk Alert identified Rule 206(4)-1 gaps as
            a top examination deficiency. See exactly where you stand
            before your examiner does.
          </p>

          {/* Scan input */}
          <p style={{ fontSize: '11px', color: 'rgba(255,255,255,0.4)', letterSpacing: '0.5px', marginBottom: '8px' }}>
            See your SEC Marketing Audit findings.
          </p>
          <div className="bf-glow max-w-md mx-auto">
            <div className="flex" style={{ border: '1px solid rgba(255,255,255,0.15)', borderRadius: '8px', overflow: 'hidden' }}>
              <input
                type="text"
                placeholder="youradviserfirm.com"
                value={domain}
                onChange={(e) => setDomain(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleScan()}
                style={{ flex: 1, background: 'rgba(255,255,255,0.06)', border: 'none', padding: '13px 16px', fontSize: '13px', color: '#fff', outline: 'none' }}
              />
              <button
                onClick={handleScan}
                style={{ background: '#1B5299', color: '#fff', padding: '13px 20px', fontSize: '12px', fontWeight: 500, border: 'none', cursor: 'pointer', whiteSpace: 'nowrap' }}
              >
                See findings &darr;
              </button>
            </div>
          </div>
          <p style={{ fontSize: '11px', color: 'rgba(255,255,255,0.25)', marginTop: '8px' }}>
            Reads from our {getCorpusMonthLabel()} data &middot; 1 lookup per firm per 72 hrs
          </p>

          {/* Found confirmation in hero */}
          {showResults && (
            <div className="mt-8 text-center">
              <p className="text-white/80 text-sm">{'\u2713'} Found {firmName}</p>
              <button
                onClick={() => document.getElementById('sec-scan-results')?.scrollIntoView({ behavior: 'smooth' })}
                className="text-white/60 text-xs mt-2 underline cursor-pointer"
              >
                Jump to results &darr;
              </button>
            </div>
          )}

          {/* Stat strip */}
          <div style={{ borderTop: '0.5px solid rgba(255,255,255,0.07)', paddingTop: '32px', marginTop: '32px' }}>
            <div className="grid grid-cols-3 gap-4">
              {[
                { num: '23,000+', label: 'Investment advisers scanned' },
                { num: '10,480', label: 'With testimonial signals detected' },
                { num: '45%', label: 'Have at least one High finding' },
              ].map((s, i) => (
                <div key={i} className="text-center" style={{ borderRight: i < 2 ? '0.5px solid rgba(255,255,255,0.07)' : 'none' }}>
                  <p style={{ fontFamily: 'var(--font-display)', fontSize: '28px', color: '#7EB3E8' }}>{s.num}</p>
                  <p style={{ fontSize: '11px', color: 'rgba(255,255,255,0.4)', fontWeight: 300, maxWidth: '140px', margin: '0 auto' }}>{s.label}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ─── SCAN RESULTS (white section below hero) ──────────── */}
      {showResults && (
        <section id="sec-scan-results" className="py-16 px-6 bg-white border-b border-gray-100">
          <div className="max-w-4xl mx-auto">
            {/* Header */}
            <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-2 mb-6">
              <div>
                <h3 className="text-xl font-medium text-gray-900">{firmName}</h3>
                <p className="text-sm text-gray-500">SEC-registered &middot; $100M&ndash;$1B AUM</p>
              </div>
              <p className="text-xs text-gray-400">{getCorpusMonthLabel()} data</p>
            </div>

            {/* Two-column cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
              {/* LEFT — Marketing Rule Risk */}
              <div className="rounded-lg p-5" style={{ backgroundColor: '#F8FAFC', border: '1px solid #E2E8F0' }}>
                <p className="text-xs font-medium text-gray-500 uppercase tracking-wide mb-3">Marketing Rule Risk</p>
                <p className="text-5xl font-bold mb-2" style={{ color: '#A32D2D', fontFamily: 'var(--font-display)' }}>High</p>
                <div className="w-full h-2.5 bg-gray-200 rounded-full mb-3">
                  <div className="h-2.5 rounded-full" style={{ width: '75%', background: 'linear-gradient(to right, #2A7A2A, #C8820A, #A32D2D)' }} />
                </div>
                <p className="text-sm text-gray-600 mb-3">3 High &middot; 2 Medium findings detected</p>
                <div className="rounded p-2.5" style={{ backgroundColor: '#FEF5F5', border: '0.5px solid #F0C0C0' }}>
                  <p className="text-xs leading-relaxed" style={{ color: '#7A0000' }}>
                    {'\u26A0'} Dec 2025 SEC Risk Alert — patterns match top cited deficiency categories.
                  </p>
                </div>
              </div>

              {/* RIGHT — Marketing Compliance Signals */}
              <div className="rounded-lg p-5" style={{ backgroundColor: '#F8FAFC', border: '1px solid #E2E8F0' }}>
                <p className="text-xs font-medium text-gray-500 uppercase tracking-wide mb-3">Marketing Compliance Signals</p>
                <div className="flex gap-4 mb-4">
                  <span className="text-sm"><span className="inline-block w-2.5 h-2.5 rounded-full mr-1.5" style={{ backgroundColor: '#A32D2D' }} />3 High</span>
                  <span className="text-sm"><span className="inline-block w-2.5 h-2.5 rounded-full mr-1.5" style={{ backgroundColor: '#C8820A' }} />2 Medium</span>
                </div>
                <p className="text-xs text-gray-500 mb-2">Top flags:</p>
                <div className="space-y-3">
                  <div className="flex items-start gap-2">
                    <span className="text-[10px] font-medium px-1.5 py-0.5 rounded mt-0.5 shrink-0" style={{ backgroundColor: '#EBF1FA', color: '#1B5299' }}>206(4)-1</span>
                    <div>
                      <p className="text-sm text-gray-700">Testimonial displayed without compensation disclosure or material conditions legend</p>
                      <p className="text-xs text-gray-400">Homepage — About section</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-2">
                    <span className="text-[10px] font-medium px-1.5 py-0.5 rounded mt-0.5 shrink-0" style={{ backgroundColor: '#EBF1FA', color: '#1B5299' }}>206(4)-1</span>
                    <div>
                      <p className="text-sm text-gray-700">Third-party rating shown without criteria, date range, or compensation disclosure</p>
                      <p className="text-xs text-gray-400">Homepage — Awards section</p>
                    </div>
                  </div>
                </div>
                <p className="text-xs text-gray-400 mt-3">Full report includes 3 more findings</p>
              </div>
            </div>

            {/* Technical Signals */}
            <div className="mb-6">
              <p className="text-xs font-medium text-gray-500 uppercase tracking-wide mb-3">Technical Signals</p>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                <SigCard icon={'\u26A0\uFE0F'} name="AI SEO Score" value="33 / 100" desc="Below average. Not visible on AI search for adviser queries." color="amber" />
                <SigCard icon={'\u2715'} name="DMARC" value="Missing" desc="Prevents email spoofing. Missing = FFIEC flag." color="red" />
                <SigCard icon={'\u26A0\uFE0F'} name="Reg S-P Privacy" value="Not accessible" desc="Privacy notice not linked from homepage or contact page." color="amber" />
                <SigCard icon={'\u2713'} name="SSL / TLS" value="TLSv1.3" desc="Encrypts traffic. TLS 1.3 = gold standard." color="green" />
                <SigCard icon={'\u26A0\uFE0F'} name="DKIM" value="Not configured" desc="Cryptographic email authentication missing." color="amber" />
                <SigCard icon={'\u26A0\uFE0F'} name="Web Activity" value="Moderate" desc="Content freshness signal for AI search engines." color="amber" />
              </div>
            </div>

            {/* CTA row */}
            <div className="flex flex-col sm:flex-row items-center justify-between gap-4 rounded-lg px-5 py-4" style={{ backgroundColor: '#F8F9FB' }}>
              <p style={{ fontSize: '13px', color: '#555', fontWeight: 300 }}>
                <span style={{ fontWeight: 500, color: '#1a1a1a' }}>Full report includes 3 more findings</span> with complete regulatory citations, severity grades, Form ADV cross-reference, and peer benchmarks.
              </p>
              <a
                href="mailto:outreach@bankforge.ai?subject=2025%20SEC%20Marketing%20Rule%20Audit"
                className="shrink-0 text-white font-medium rounded-md text-xs transition-colors text-center"
                style={{ backgroundColor: '#1B5299', padding: '10px 22px' }}
              >
                Request Audit — $4,500
              </a>
            </div>
          </div>
        </section>
      )}

      {/* ─── WHAT WE SURFACE ───────────────────────────────────── */}
      <section className="py-12 px-6">
        <div className="max-w-5xl mx-auto">
          <p className="text-bf-navy text-xs font-medium tracking-wide uppercase mb-3">What we surface</p>
          <h2 className="text-3xl text-gray-900 mb-3" style={{ fontFamily: 'var(--font-display)' }}>
            The deficiency patterns the December 2025 Risk Alert flagged.
          </h2>
          <p className="text-sm text-gray-500 mb-10">
            Every finding mapped to its rule citation. Reviewed by our team before delivery.
            We flag for counsel — never conclude a violation.
          </p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {FINDING_CARDS.map((card, i) => (
              <div
                key={i}
                className="rounded-lg p-5"
                style={{
                  backgroundColor: card.tagColor === 'amber' ? '#FFF4E5' : '#fff',
                  border: card.tagColor === 'amber' ? '1px solid #E8C055' : '1px solid #d1dbe8',
                  borderLeft: card.tagColor === 'amber' ? '3px solid #E8C055' : '3px solid #1B5299',
                }}
              >
                <span
                  className="inline-block text-[10px] font-medium uppercase tracking-wider px-2 py-0.5 rounded mb-2"
                  style={{
                    backgroundColor: card.tagColor === 'red' ? '#FEE2E2' : '#FFF4E5',
                    color: card.tagColor === 'red' ? '#991B1B' : '#9A5820',
                  }}
                >
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

      {/* ─── WHAT WE DELIVER ───────────────────────────────────── */}
      <section className="py-12 px-6" style={{ backgroundColor: '#F8F9FB' }}>
        <div className="max-w-5xl mx-auto">
          <p className="text-bf-navy text-xs font-medium tracking-wide uppercase mb-3">What we deliver</p>
          <h2 className="text-3xl text-gray-900 mb-10" style={{ fontFamily: 'var(--font-display)' }}>
            From audit to ongoing protection.
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* SKU 1 */}
            <div className="rounded-xl p-6 bg-white flex flex-col" style={{ border: '2px solid #1B5299' }}>
              <p style={{ fontSize: '10px', fontWeight: 500, letterSpacing: '1px', textTransform: 'uppercase', color: '#7EB3E8', marginBottom: '8px' }}>
                Step 1 — Start here
              </p>
              <h3 className="text-lg text-gray-900 mb-2" style={{ fontFamily: 'var(--font-display)' }}>
                2025 SEC Marketing Rule Audit
              </h3>
              <p className="text-3xl mb-1" style={{ fontFamily: 'var(--font-display)', color: '#0F2341' }}>$4,500</p>
              <p className="text-xs text-gray-400 mb-4">One-time &middot; Delivered within 5 business days</p>
              <hr className="border-gray-100 mb-4" />
              <ul className="space-y-2 mb-6 flex-1">
                {[
                  'Full marketing footprint audit against Rule 206(4)-1',
                  'Testimonial, endorsement, and third-party rating analysis',
                  'Performance advertising disclosure review',
                  'Form ADV Part 2A cross-reference',
                  'Reg S-P privacy notice signal check',
                  'AI SEO score and visibility report included',
                  'DOCX — severity-graded, regulatory citations, peer benchmarks',
                  'Reviewed by our team before delivery',
                ].map((item, i) => (
                  <li key={i} className="text-sm text-gray-600 leading-relaxed flex gap-2">
                    <span className="text-bf-navy mt-0.5 shrink-0">&bull;</span>
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
              <a
                href="mailto:outreach@bankforge.ai?subject=2025%20SEC%20Marketing%20Rule%20Audit"
                className="block w-full text-center text-white font-medium py-3 rounded-lg text-sm transition-colors"
                style={{ backgroundColor: '#1B5299' }}
              >
                Request Audit — $4,500
              </a>
            </div>

            {/* SKU 2 */}
            <div className="rounded-xl p-6 bg-white flex flex-col" style={{ border: '1px solid #e5e7eb' }}>
              <p style={{ fontSize: '10px', fontWeight: 500, letterSpacing: '1px', textTransform: 'uppercase', color: '#7EB3E8', marginBottom: '8px' }}>
                Step 2 — After audit delivery
              </p>
              <h3 className="text-lg text-gray-900 mb-2" style={{ fontFamily: 'var(--font-display)' }}>
                Monthly Marketing Monitoring
              </h3>
              <p className="text-3xl mb-1" style={{ fontFamily: 'var(--font-display)', color: '#0F2341' }}>$999/mo</p>
              <p className="text-xs text-gray-400 mb-3">No contract &middot; Cancel anytime</p>
              <div className="flex flex-wrap gap-2 mb-4">
                <span className="text-xs px-3 py-1 rounded-full" style={{ backgroundColor: '#EBF1FA', color: '#1B5299' }}>Available May 2026</span>
                <span className="text-xs px-3 py-1 rounded-full" style={{ backgroundColor: '#FFF4E5', color: '#9A5820' }}>Available only after audit delivery</span>
              </div>
              <hr className="border-gray-100 mb-4" />
              <ul className="space-y-2 mb-6 flex-1">
                {[
                  'Month-over-month marketing compliance delta',
                  'Immediate alert on new High findings',
                  'AI SEO score tracking across ChatGPT, Perplexity, Google',
                  'Meta Ad Library signals — testimonials and performance claims in paid ads',
                  'Google Ads Library signals — targeting and disclosure compliance',
                  'Monthly DOCX report regardless of changes',
                ].map((item, i) => (
                  <li key={i} className="text-sm text-gray-600 leading-relaxed flex gap-2">
                    <span className="text-bf-navy mt-0.5 shrink-0">&bull;</span>
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
              <a
                href="mailto:outreach@bankforge.ai?subject=SEC%20Monitoring%20May%202026%20Notification"
                className="block w-full text-center font-medium py-3 rounded-lg text-sm transition-colors"
                style={{ border: '1px solid #1B5299', color: '#1B5299' }}
              >
                Notify Me for May Launch
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* ─── CTA BLOCK ─────────────────────────────────────────── */}
      <section className="px-7 py-9">
        <div className="bg-bf-navy-deep rounded-[10px] py-10 px-10 text-center">
          <div className="max-w-xl mx-auto">
            <h2 className="text-white text-3xl mb-4" style={{ fontFamily: 'var(--font-display)' }}>
              Your marketing is already being evaluated.
              <br />
              See what we find before your examiner does.
            </h2>
            <p className="text-blue-200/70 text-sm leading-relaxed mb-6">
              Every finding reviewed for regulatory accuracy before delivery. No false positives. No generic checklists.
            </p>
            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <a
                href="mailto:outreach@bankforge.ai?subject=2025%20SEC%20Marketing%20Rule%20Audit"
                className="bg-white text-[#0F2341] font-medium px-6 py-3 rounded-lg text-sm hover:bg-gray-50 transition-colors text-center"
              >
                Request Audit — $4,500
              </a>
              <a
                href="mailto:outreach@bankforge.ai?subject=Sample%20RIA%20Findings%20Request"
                className="border border-white/30 text-white font-medium px-6 py-3 rounded-lg text-sm hover:border-white/60 transition-colors text-center"
              >
                See sample findings
              </a>
            </div>
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

      {/* Pulse animation for alert badge */}
      <style jsx>{`
        @keyframes pulse {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.3; }
        }
      `}</style>
    </div>
  );
}

function SigCard({ icon, name, value, desc, color }: { icon: string; name: string; value: string; desc: string; color: 'green' | 'amber' | 'red' }) {
  const bg = color === 'green' ? '#F0FDF4' : color === 'red' ? '#FEF2F2' : '#FAFAFA';
  const bdr = color === 'green' ? '#BBF7D0' : color === 'red' ? '#FECACA' : '#E5E7EB';
  return (
    <div className="rounded-lg p-2.5" style={{ backgroundColor: bg, border: `1px solid ${bdr}` }}>
      <div className="flex items-center gap-1 mb-1">
        <span className="text-sm">{icon}</span>
        <span className="text-xs font-medium text-gray-700">{name}</span>
      </div>
      <p className="text-xs text-gray-600 mb-1">{value}</p>
      <p className="text-[10px] text-gray-400 leading-relaxed">{desc}</p>
    </div>
  );
}
