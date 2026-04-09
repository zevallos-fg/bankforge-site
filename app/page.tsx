'use client';

import { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import ScanDemo from './components/ScanDemo';
import DemoRequestForm from './components/DemoRequestForm';

// ─── Signal Card Data ───────────────────────────────────────────────

const bankCards = [
  {
    accent: 'blue',
    tag: 'HIGH',
    title: 'Rate advertisement missing Reg DD triggering terms',
    desc: 'APY displayed without effective date, minimum balance, or fees disclosure. On the examiner\u2019s checklist every cycle.',
    ref: 'Reg DD / 12 CFR 1030',
  },
  {
    accent: 'blue',
    tag: 'GEO Score',
    stat: '45.8 avg',
    title: 'Average bank GEO score out of 100',
    desc: '16.6% of banks score below 40 \u2014 invisible on ChatGPT, Perplexity, and Google AI Overviews for local deposit and loan queries.',
    ref: 'March 2026',
  },
  {
    accent: 'blue',
    tag: 'HIGH',
    title: 'Equal Housing Lender disclosure absent from mortgage pages',
    desc: 'Required statement or logo not detected on consumer lending pages. Consistent examiner flag across FDIC, OCC, and CFPB supervised institutions.',
    ref: 'ECOA / Reg B / FFIEC',
  },
  {
    accent: 'gold',
    tag: 'Marketing + Compliance Signal',
    stat: '83.4%',
    title: 'of banks have website accessibility issues',
    desc: 'Accessibility gaps suppress Google search rankings, reduce mobile conversion, and create ADA enforcement exposure \u2014 an active CFPB and DOJ priority.',
    ref: 'March 2026',
  },
];

const riaCards = [
  {
    accent: 'blue',
    tag: 'HIGH',
    title: 'Testimonial displayed without required legend',
    desc: 'Client quote or endorsement without compensation disclosure and material conditions legend. Top SEC exam deficiency \u2014 December 2025 Risk Alert.',
    ref: 'Rule 206(4)-1(b)(1)',
  },
  {
    accent: 'blue',
    tag: 'GEO Score',
    stat: '33.3 avg',
    title: 'Average RIA GEO score out of 100',
    desc: '37.2% of RIAs score below 40 \u2014 invisible on ChatGPT, Perplexity, and Google AI Overviews when prospects search for investment advisers.',
    ref: 'March 2026',
  },
  {
    accent: 'blue',
    tag: 'HIGH',
    title: 'Third-party rating without required context',
    desc: 'Star rating or ranking displayed without disclosure of criteria, date range, or compensation paid. Cited in SEC December 2025 Risk Alert as a top Marketing Rule deficiency.',
    ref: 'Rule 206(4)-1(c)(1)',
  },
  {
    accent: 'gold',
    tag: 'Marketing + Compliance Signal',
    stat: '92.3%',
    title: 'of RIAs have website accessibility issues',
    desc: 'The highest rate across all institution types we scan. Accessibility gaps suppress search rankings, reduce prospect conversion, and create ADA legal exposure.',
    ref: 'March 2026',
  },
];

const bankAdditionalSignals = 'Beyond these findings, BankForge also surfaces <signal>HTTPS enforcement gaps</signal>, <signal>NMLS identifier presence</signal> on loan pages, <signal>CFPB complaint volume trends</signal>, <signal>vendor and technology stack signals</signal>, <signal>Google Business Profile completeness</signal>, <signal>DNS and email security posture</signal>, <signal>schema markup coverage</signal>, and <signal>web archive history</signal> \u2014 all from the same single scan.';

const riaAdditionalSignals = 'Beyond these findings, BankForge also surfaces <signal>Reg S-P privacy notice gaps</signal>, <signal>performance advertising disclosure issues</signal>, <signal>AI crawler access</signal>, <signal>schema markup coverage</signal>, <signal>Form ADV alignment signals</signal>, <signal>Google Business Profile completeness</signal>, <signal>DNS and email security posture</signal>, and <signal>web archive history</signal> \u2014 all from the same single scan.';

// ─── JSON-LD Schema ─────────────────────────────────────────────────

const jsonLd = [
  {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    name: 'BankForge.ai',
    url: 'https://bankforge.ai',
    description: 'Compliance intelligence platform for regulated financial institutions. We scan public digital presences for regulatory compliance gaps and AI visibility signals across 66,000+ institutions.',
    foundingDate: '2026',
    areaServed: 'United States',
    serviceType: ['Compliance Review', 'GEO Remediation', 'RIA Marketing Rule Compliance', 'Bank Digital Compliance Monitoring'],
  },
  {
    '@context': 'https://schema.org',
    '@type': 'Service',
    name: 'Compliance Review',
    provider: { '@type': 'Organization', name: 'BankForge.ai' },
    description: 'Structured review of a financial institution\u2019s public digital presence against regulatory compliance criteria. Findings are severity-graded with regulatory citations. Reviewed by the BankForge team before delivery.',
    serviceType: 'Compliance Review',
  },
  {
    '@context': 'https://schema.org',
    '@type': 'Service',
    name: 'GEO Remediation',
    provider: { '@type': 'Organization', name: 'BankForge.ai' },
    description: 'AI visibility remediation for financial institutions. Improves GEO scores across ChatGPT, Perplexity, Google AI Overviews, and other AI search engines.',
    serviceType: 'GEO Remediation',
  },
  {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: [
      {
        '@type': 'Question',
        name: 'What compliance gaps does BankForge find on bank websites?',
        acceptedAnswer: { '@type': 'Answer', text: 'BankForge scans for UDAAP risk language, Reg Z triggering terms, Reg DD rate advertising gaps, missing Equal Housing Lender disclosures, NMLS identifier absence on loan pages, FFIEC non-deposit disclaimer issues, and Fair Lending signals. Every finding is severity-graded with the specific regulatory citation attached.' },
      },
      {
        '@type': 'Question',
        name: 'What is a GEO score?',
        acceptedAnswer: { '@type': 'Answer', text: 'A GEO score measures how visible your institution is on AI-powered search engines like ChatGPT, Perplexity, and Google AI Overviews. BankForge computes GEO scores across 66,000+ institutions. The average bank scores 45.8 out of 100. The average RIA scores 33.3.' },
      },
      {
        '@type': 'Question',
        name: 'What does a BankForge RIA compliance review cover?',
        acceptedAnswer: { '@type': 'Answer', text: 'BankForge reviews RIA websites against SEC Marketing Rule (Rule 206(4)-1) criteria including testimonial and endorsement disclosures, third-party rating context, performance advertising requirements, and Regulation S-P privacy notice accessibility. Every finding references the December 2025 SEC Risk Alert deficiency categories.' },
      },
      {
        '@type': 'Question',
        name: 'How does BankForge find compliance gaps on a website?',
        acceptedAnswer: { '@type': 'Answer', text: 'BankForge crawls public-facing pages without requiring any login or IT access. Every page is processed against UDAAP, Reg Z, Reg DD, FFIEC, Fair Lending, and SEC Marketing Rule criteria and scored for AI visibility across a corpus of 66,000+ institutions. Findings include specific regulatory citations, not marketing opinions.' },
      },
    ],
  },
];

// ─── Helpers ────────────────────────────────────────────────────────

function renderSignalText(html: string) {
  const parts = html.split(/<signal>(.*?)<\/signal>/g);
  return parts.map((part, i) =>
    i % 2 === 1 ? (
      <span key={i} style={{ color: '#1B5299' }}>{part}</span>
    ) : (
      <span key={i}>{part}</span>
    )
  );
}

// ─── Page ───────────────────────────────────────────────────────────

export default function HomePage() {
  const [tab, setTab] = useState<'bank' | 'ria'>('bank');
  const [scanOpen, setScanOpen] = useState(false);
  const [mobileNav, setMobileNav] = useState(false);

  const cards = tab === 'bank' ? bankCards : riaCards;
  const additionalSignals = tab === 'bank' ? bankAdditionalSignals : riaAdditionalSignals;

  return (
    <div className="min-h-screen bg-white">
      {jsonLd.map((schema, i) => (
        <script
          key={i}
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
        />
      ))}

      {/* ─── NAV ───────────────────────────────────────────────── */}
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
            <button
              onClick={() => setTab('bank')}
              className="relative px-4 py-2 text-sm transition-colors"
              style={{ color: tab === 'bank' ? '#fff' : '#9ca3af' }}
            >
              Banks &amp; Credit Unions
              {tab === 'bank' && (
                <span className="absolute bottom-0 left-4 right-4 h-[2px]" style={{ backgroundColor: '#7EB3E8' }} />
              )}
            </button>
            <button
              onClick={() => setTab('ria')}
              className="relative px-4 py-2 text-sm transition-colors"
              style={{ color: tab === 'ria' ? '#fff' : '#9ca3af' }}
            >
              Investment Advisers
              {tab === 'ria' && (
                <span className="absolute bottom-0 left-4 right-4 h-[2px]" style={{ backgroundColor: '#7EB3E8' }} />
              )}
            </button>
            <span className="w-px h-4 bg-white/20 mx-2" />
            <Link href="/insights" className="px-3 py-2 text-sm text-gray-300 hover:text-white transition-colors">
              Insights
            </Link>
            <Link href="/geo-score" className="px-3 py-2 text-sm text-gray-300 hover:text-white transition-colors">
              GEO Score
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
            <Link href="/for-banks" className="block px-6 py-3 text-sm text-white/70 hover:text-white hover:bg-white/5" onClick={() => setMobileNav(false)}>Banks</Link>
            <Link href="/for-credit-unions" className="block px-6 py-3 text-sm text-white/70 hover:text-white hover:bg-white/5" onClick={() => setMobileNav(false)}>Credit Unions</Link>
            <Link href="/for-rias" className="block px-6 py-3 text-sm text-white/70 hover:text-white hover:bg-white/5" onClick={() => setMobileNav(false)}>Investment Advisers</Link>
            <Link href="/insights" className="block px-6 py-3 text-sm text-white/70 hover:text-white hover:bg-white/5" onClick={() => setMobileNav(false)}>Insights</Link>
            <Link href="/geo-score" className="block px-6 py-3 text-sm text-white/70 hover:text-white hover:bg-white/5" onClick={() => setMobileNav(false)}>GEO Score</Link>
          </div>
        )}
      </nav>

      {/* ─── HERO ──────────────────────────────────────────────── */}
      <section className="relative min-h-[600px] flex items-center justify-center pt-16">
        <Image
          src="https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=1200&q=80"
          fill
          priority
          alt="Aerial landscape"
          className="object-cover object-[center_30%]"
        />
        <div
          className="absolute inset-0"
          style={{
            background: 'linear-gradient(to bottom, rgba(15,35,65,0.82) 0%, rgba(15,35,65,0.95) 100%)',
          }}
        />
        <div className="relative z-10 text-center max-w-2xl mx-auto px-6 py-20">
          <h1
            className="text-white text-[44px] leading-tight mb-5"
            style={{ fontFamily: 'var(--font-display)' }}
          >
            Know what your website says about you.
            <br />
            <em style={{ color: '#7EB3E8' }}>Before <span className="font-bold">customers</span> or <span className="font-bold">regulators</span> do.</em>
          </h1>
          <p className="text-blue-200/80 text-lg leading-relaxed mb-8 max-w-xl mx-auto">
            BankForge scans your public digital presence for regulatory compliance gaps and
            AI &amp; digital marketing visibility. One scan. Three perspectives &mdash; your
            examiners, your customers, and your competitors on AI.
          </p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <a
              href="mailto:outreach@bankforge.ai"
              className="bg-white text-[#0F2341] font-medium px-6 py-3 rounded-lg text-sm hover:bg-gray-50 transition-colors text-center"
            >
              Request a Review
            </a>
            <button
              onClick={() =>
                document.getElementById('what-bankforge-finds')
                  ?.scrollIntoView({ behavior: 'smooth' })
              }
              className="border border-white/30 text-white px-6 py-3 rounded-lg text-sm hover:border-white/60 transition-colors"
            >
              See what we find
            </button>
          </div>
        </div>
      </section>

      {/* ─── SIGNAL CARDS ──────────────────────────────────────── */}
      <section id="what-bankforge-finds" className="pt-8 pb-16 px-6">
        <div className="max-w-5xl mx-auto">
          <p className="text-bf-navy text-xs font-medium tracking-wide uppercase mb-3">
            What BankForge finds
          </p>
          <h2
            className="text-3xl text-gray-900 mb-8"
            style={{ fontFamily: 'var(--font-display)' }}
          >
            One Scan. Two Lenses.
          </h2>

          {/* Column headers */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
            <div>
              <span className="inline-block text-xs font-medium px-3 py-1 rounded-full bg-blue-50 text-bf-navy border border-blue-200">
                Risk &amp; Compliance Lens
              </span>
            </div>
            <div>
              <span className="inline-block text-xs font-medium px-3 py-1 rounded-full" style={{ backgroundColor: '#FFFBF0', color: '#92710A', border: '1px solid #C8A84B' }}>
                Marketing &amp; Digital Intelligence Lens
              </span>
            </div>
          </div>

          {/* 2x2 grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
            {cards.map((card, i) => (
              <div
                key={`${tab}-${i}`}
                className="rounded-lg p-5"
                style={{
                  backgroundColor: card.accent === 'gold' ? '#FFFBF0' : '#fff',
                  border: card.accent === 'gold'
                    ? '1px solid #C8A84B'
                    : '1px solid #d1dbe8',
                  borderLeft: card.accent === 'gold'
                    ? '3px solid #C8A84B'
                    : '3px solid #1B5299',
                }}
              >
                <div className="flex items-center gap-2 mb-2">
                  <span
                    className="text-[10px] font-medium uppercase tracking-wider px-2 py-0.5 rounded"
                    style={{
                      backgroundColor: card.accent === 'gold' ? '#FEF3C7' : '#EBF1FA',
                      color: card.accent === 'gold' ? '#92710A' : '#1B5299',
                    }}
                  >
                    {card.tag}
                  </span>
                </div>
                {card.stat && (
                  <p
                    className="text-2xl mb-1"
                    style={{ fontFamily: 'var(--font-display)', color: card.accent === 'gold' ? '#92710A' : '#1B5299' }}
                  >
                    {card.stat}
                  </p>
                )}
                <h3 className="text-sm font-medium text-gray-900 mb-1">{card.title}</h3>
                <p className="text-sm text-gray-600 leading-relaxed mb-2">{card.desc}</p>
                <p className="text-xs text-gray-400">{card.ref}</p>
              </div>
            ))}
          </div>

          {/* Additional signals box */}
          <div
            className="rounded-lg p-5"
            style={{ backgroundColor: '#F8F9FA', border: '0.5px solid #D1D5DB', borderRadius: '8px' }}
          >
            <p className="text-xs font-medium text-gray-500 uppercase tracking-wide mb-2">
              Also surfaced in every scan
            </p>
            <p className="text-sm text-gray-600 leading-relaxed">
              {renderSignalText(additionalSignals)}
            </p>
          </div>
        </div>
      </section>

      {/* ─── HOW IT WORKS ──────────────────────────────────────── */}
      <section id="how-it-works" className="py-16 px-6" style={{ backgroundColor: '#0F2341' }}>
        <div className="max-w-5xl mx-auto">
          <p className="text-xs font-medium tracking-wide uppercase mb-3" style={{ color: '#7EB3E8' }}>
            How it works
          </p>
          <h2
            className="text-3xl text-white mb-3"
            style={{ fontFamily: 'var(--font-display)' }}
          >
            Compliance gaps and digital intelligence. Found in minutes.
          </h2>
          <p className="text-blue-200/70 text-sm mb-10">
            Three steps. No login required. No IT involvement.
          </p>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Step 01 */}
            <div>
              <p className="text-xs font-medium mb-3" style={{ color: '#7EB3E8' }}>Step 01</p>
              <h3 className="text-white text-lg font-medium mb-2" style={{ fontFamily: 'var(--font-display)' }}>
                We scrape your website
              </h3>
              <p className="text-blue-200/70 text-sm leading-relaxed mb-3">
                The BankForge team captures your homepage, product pages, rate disclosures, and
                public filings. No login. No IT involvement. We work with exactly what your
                customers and examiners see.
              </p>
              <p className="text-xs text-blue-300/50">
                Covers: homepages &middot; product pages &middot; rate sheets &middot; disclosures &middot; public filings &middot; footers
              </p>
            </div>
            {/* Step 02 */}
            <div>
              <p className="text-xs font-medium mb-3" style={{ color: '#7EB3E8' }}>Step 02</p>
              <h3 className="text-white text-lg font-medium mb-2" style={{ fontFamily: 'var(--font-display)' }}>
                Our intelligence engine analyzes every page
              </h3>
              <p className="text-blue-200/70 text-sm leading-relaxed mb-3">
                Every page is processed against UDAAP, Reg Z, Reg DD, FFIEC interagency guidance,
                Fair Lending, and SEC Marketing Rule criteria &mdash; and scored for AI visibility,
                digital performance, and accessibility across our corpus of 66,000+ institutions.
                Specific regulatory citations. Not marketing opinions.
              </p>
              <p className="text-xs text-blue-300/50">
                Corpus: 4,300+ banks &middot; 23,000+ RIAs &middot; 4,400+ credit unions
              </p>
            </div>
            {/* Step 03 */}
            <div>
              <p className="text-xs font-medium mb-3" style={{ color: '#7EB3E8' }}>Step 03</p>
              <h3 className="text-white text-lg font-medium mb-2" style={{ fontFamily: 'var(--font-display)' }}>
                You get a findings report
              </h3>
              <p className="text-blue-200/70 text-sm leading-relaxed mb-3">
                Every finding mapped to its regulatory citation, severity level, and recommended
                action. The BankForge team reviews every finding before delivery. Delivered within
                5 business days. We flag for counsel &mdash; never conclude a violation.
              </p>
              <p className="text-xs text-blue-300/50">
                Deliverable: DOCX report &middot; severity-graded &middot; regulatory citations &middot; peer benchmarks
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ─── WHY BANKFORGE ─────────────────────────────────────── */}
      <section className="py-16 px-6" style={{ backgroundColor: '#F2F4F7' }}>
        <div className="max-w-5xl mx-auto">
          <p className="text-bf-navy text-xs font-medium tracking-wide uppercase mb-3">
            Why BankForge
          </p>
          <h2
            className="text-3xl text-gray-900 mb-3"
            style={{ fontFamily: 'var(--font-display)' }}
          >
            Built different. By design.
          </h2>
          <p className="text-sm text-gray-600 mb-10">
            Most compliance tools tell you what went wrong after your examination. BankForge
            finds it before anyone else does.
          </p>

          <div className="overflow-x-auto">
            <table className="w-full text-sm border-collapse">
              <thead>
                <tr>
                  <th className="text-left py-3 px-4 font-medium text-gray-500 w-1/6"></th>
                  <th
                    className="text-left py-3 px-4 font-medium text-white rounded-t-lg"
                    style={{ backgroundColor: '#0F2341', borderLeft: '2px solid #0F2341', borderRight: '2px solid #0F2341' }}
                  >
                    BankForge
                  </th>
                  <th className="text-left py-3 px-4 font-medium text-gray-500 bg-gray-100 rounded-t-lg">
                    Everyone else
                  </th>
                </tr>
              </thead>
              <tbody>
                <tr className="border-t border-gray-200">
                  <td className="py-4 px-4 font-medium text-gray-700 align-top">Posture</td>
                  <td
                    className="py-4 px-4 text-gray-700 align-top"
                    style={{ backgroundColor: '#EBF1FA', borderLeft: '2px solid #0F2341', borderRight: '2px solid #0F2341' }}
                  >
                    <strong>Proactive.</strong> We surface compliance gaps and digital performance risks before your
                    examination cycle &mdash; or your website redesign launch.
                  </td>
                  <td className="py-4 px-4 text-gray-500 bg-gray-50 align-top">
                    Reactive. Most tools audit after an exam finding or an incident. By then the
                    gap is already on record.
                  </td>
                </tr>
                <tr className="border-t border-gray-200">
                  <td className="py-4 px-4 font-medium text-gray-700 align-top">Scope</td>
                  <td
                    className="py-4 px-4 text-gray-700 align-top"
                    style={{ backgroundColor: '#EBF1FA', borderLeft: '2px solid #0F2341', borderRight: '2px solid #0F2341' }}
                  >
                    <strong>Compliance + digital intelligence.</strong> One scan produces regulatory findings and
                    digital performance signals. Your CCO and CMO get the same intelligence from
                    one engagement.
                  </td>
                  <td className="py-4 px-4 text-gray-500 bg-gray-50 align-top">
                    Compliance only. Digital performance requires a separate vendor. Two invoices
                    for the same website.
                  </td>
                </tr>
                <tr className="border-t border-gray-200">
                  <td className="py-4 px-4 font-medium text-gray-700 align-top">Methodology</td>
                  <td
                    className="py-4 px-4 text-gray-700 align-top rounded-b-lg"
                    style={{ backgroundColor: '#EBF1FA', borderLeft: '2px solid #0F2341', borderRight: '2px solid #0F2341', borderBottom: '2px solid #0F2341' }}
                  >
                    <strong>Institution-specific, peer-benchmarked.</strong> Every finding is mapped to your
                    specific pages and benchmarked against institutions your size in your market.
                  </td>
                  <td className="py-4 px-4 text-gray-500 bg-gray-50 rounded-b-lg align-top">
                    Generic checklists. The same list applied to every institution regardless of
                    size, market, or regulatory history.
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </section>

      {/* ─── BOTTOM CTA ────────────────────────────────────────── */}
      <section className="mx-7 mb-12 mt-12">
        <div className="bg-bf-navy-deep rounded-[10px] py-12 px-10 text-center">
          <div className="max-w-xl mx-auto">
            <h2
              className="text-white text-3xl mb-4"
              style={{ fontFamily: 'var(--font-display)' }}
            >
              Your website already has an audience you&apos;re not preparing for.
            </h2>
            <p className="text-blue-200/70 text-sm leading-relaxed mb-6">
              The BankForge team reviews every finding before delivery. No vendor energy. No AI noise.
            </p>
            <div className="flex flex-col items-center gap-4">
              <DemoRequestForm
                audienceType={tab === 'ria' ? 'ria' : 'bank'}
                sourcePage="/"
                sourceCta="cta_block"
                ctaLabel="Request a Review"
                buttonClassName="bg-white text-bf-navy-deep font-medium px-6 py-3 rounded-lg hover:bg-gray-100 transition-colors text-sm"
              />
              <Link
                href="/geo-score"
                className="border border-white/30 text-white font-medium px-6 py-3 rounded-lg hover:bg-white/10 transition-colors text-sm"
              >
                See what your GEO score is
              </Link>
            </div>
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

      {/* ─── SCAN DEMO MODAL ───────────────────────────────────── */}
      {scanOpen && <ScanDemo onClose={() => setScanOpen(false)} />}
    </div>
  );
}
