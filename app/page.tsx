'use client';

import { useState } from 'react';
import Image from 'next/image';
import SignalCards from './components/SignalCards';
import HowItWorks from './components/HowItWorks';
import BioCard from './components/BioCard';

// ─── Data ────────────────────────────────────────────────────────────

const riaSignalCards = [
  {
    severity: 'HIGH' as const,
    title: 'Testimonial Disclosure Gap',
    description: 'Client testimonials displayed without required disclosure under Rule 206(4)-1(a)(4). SEC December 2025 Risk Alert flagged this as a top deficiency.',
    citation: 'Rule 206(4)-1(a)(4)',
  },
  {
    severity: 'HIGH' as const,
    title: 'Performance Advertising Without Required Context',
    description: 'Performance results presented without the disclosures required under Rule 206(4)-1(d). Gross/net, time period, and benchmark context required.',
    citation: 'Rule 206(4)-1(d)',
  },
  {
    severity: 'MEDIUM' as const,
    title: 'Third-Party Rating Without Disclosure',
    description: 'Third-party rating displayed without required disclosures: who provided the rating, criteria used, and whether compensation was involved.',
    citation: 'Rule 206(4)-1(a)(5)',
  },
  {
    severity: 'MEDIUM' as const,
    title: 'Privacy Notice Accessibility Gap',
    description: 'Privacy notice not readily accessible from the homepage. Reg S-P Rule 4 requires clear delivery mechanism for initial and annual notices.',
    citation: 'Reg S-P Rule 4',
  },
];

const bankSignalCards = [
  {
    severity: 'HIGH' as const,
    title: 'Equal Housing Lender Disclosure Missing',
    description: 'No Equal Housing Lender logo or text visible on homepage. Required under Fair Housing Act and Regulation B for all creditors.',
    citation: 'Reg B / Fair Housing Act',
  },
  {
    severity: 'HIGH' as const,
    title: 'UDAAP Risk — Misleading Rate Language',
    description: 'Rate language on deposit products may be misleading without APY context. Reg DD requires APY disclosure at equal prominence when rates are stated.',
    citation: 'Reg DD / 12 CFR 1030',
  },
  {
    severity: 'MEDIUM' as const,
    title: 'Non-Deposit Disclaimer Missing Near FDIC Logo',
    description: 'FDIC membership logo displayed near investment product links without "Not FDIC Insured / May Lose Value" disclaimer.',
    citation: 'FFIEC Interagency Guidance',
  },
  {
    severity: 'LOW' as const,
    title: 'Schema Markup Absent',
    description: 'No structured data (JSON-LD) detected on homepage. While not a regulatory requirement, schema markup improves search visibility and content trust signals.',
    citation: 'Best Practice',
  },
];

const riaHowItWorksSteps = [
  {
    number: '01',
    title: 'We scrape your website',
    description: 'The BankForge team captures your public-facing digital presence — homepage, about page, disclosures, and any client-facing content. No login or access required.',
  },
  {
    number: '02',
    title: 'We run a compliance Ctrl+F',
    description: 'Every page is analyzed against SEC Rule 206(4)-1 (Marketing Rule), Reg S-P, and Form ADV consistency standards. The BankForge team flags specific regulatory citations — never vague observations.',
  },
  {
    number: '03',
    title: 'You get a findings report',
    description: 'A DOCX report with every finding mapped to its regulatory citation, severity level, and recommended action. Delivered within 5 business days. The BankForge team reviews every finding before delivery.',
  },
];

const bankHowItWorksSteps = [
  {
    number: '01',
    title: 'We scrape your website',
    description: 'The BankForge team captures your homepage, product pages, and rate disclosures. No login, no IT involvement. We work with what your customers see.',
  },
  {
    number: '02',
    title: 'We run a compliance Ctrl+F',
    description: 'Every page is analyzed against UDAAP, Reg Z, Reg DD, FFIEC interagency guidance, and Fair Lending standards. The BankForge team flags specific regulatory citations — not marketing opinions.',
  },
  {
    number: '03',
    title: 'You get a findings report',
    description: 'A DOCX report with every finding mapped to its regulatory citation, severity level, and recommended action. Delivered within 5 business days. The BankForge team reviews every finding before delivery.',
  },
];

// ─── Page ────────────────────────────────────────────────────────────

const jsonLd = [
  {
    "@context": "https://schema.org",
    "@type": "Organization",
    "name": "BankForge.ai",
    "url": "https://bankforge.ai",
    "description": "Compliance intelligence platform for regulated financial institutions. We scan public digital presences for regulatory compliance gaps — UDAAP, Reg Z, Reg DD, Fair Lending, and SEC Marketing Rule — and surface findings before the next examination cycle.",
    "foundingDate": "2026",
    "areaServed": "United States",
    "serviceType": ["Compliance Review", "Regulatory Monitoring", "RIA Marketing Rule Compliance", "Bank Digital Compliance Monitoring"],
  },
  {
    "@context": "https://schema.org",
    "@type": "Service",
    "name": "RIA Compliance Review",
    "provider": { "@type": "Organization", "name": "BankForge.ai" },
    "description": "One-time structured review of an RIA's public digital presence against SEC Marketing Rule (Rule 206(4)-1) and Regulation S-P criteria. Findings are severity-graded with regulatory citations. Reviewed by the BankForge team before delivery.",
    "serviceType": "Compliance Review",
    "audience": { "@type": "Audience", "audienceType": "Registered Investment Advisers" },
  },
  {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    "mainEntity": [
      {
        "@type": "Question",
        "name": "What is the SEC Marketing Rule for RIAs?",
        "acceptedAnswer": { "@type": "Answer", "text": "The SEC Marketing Rule (Rule 206(4)-1 under the Investment Advisers Act) governs how registered investment advisers may advertise their services. Key requirements include: testimonials and endorsements must include compensation disclosures and material conditions legends; third-party ratings must disclose the criteria, date range, and any compensation; performance advertising must be fair and balanced. The SEC's December 2025 Risk Alert identified these areas as top examination deficiencies." },
      },
      {
        "@type": "Question",
        "name": "What does a BankForge RIA compliance review cover?",
        "acceptedAnswer": { "@type": "Answer", "text": "BankForge scrapes your public-facing website and Form ADV filings, then scans for the specific disclosures, language patterns, and omissions that SEC examiners look for under Rule 206(4)-1 and Regulation S-P. Every finding is severity-graded with the regulatory citation attached. The BankForge team reviews all findings before delivery. BankForge flags for counsel review — we never conclude a violation." },
      },
      {
        "@type": "Question",
        "name": "What compliance issues do community bank websites commonly have?",
        "acceptedAnswer": { "@type": "Answer", "text": "Common digital compliance gaps for community banks include: rate advertisements missing Regulation DD triggering terms (APY without effective date, minimum balance, or fees); missing Equal Housing Lender disclosures on mortgage pages; absent NMLS identifiers on loan product pages; and fee schedules not publicly accessible. BankForge scans for these and additional UDAAP, Reg Z, and Fair Lending signals across your entire public web presence." },
      },
      {
        "@type": "Question",
        "name": "How does BankForge find compliance gaps on a website?",
        "acceptedAnswer": { "@type": "Answer", "text": "BankForge crawls your public-facing pages — product pages, disclosures, footers — without requiring any login or access. Our compliance engine scans every page for the specific language, disclosures, and omissions that regulators flag, mapped directly to the applicable regulatory criteria. Think of it as a compliance Ctrl+F run against your entire website." },
      },
    ],
  },
];

const faqItems = [
  {
    q: "What is the SEC Marketing Rule for RIAs?",
    a: "The SEC Marketing Rule (Rule 206(4)-1 under the Investment Advisers Act) governs how registered investment advisers may advertise their services. Key requirements include: testimonials and endorsements must include compensation disclosures and material conditions legends; third-party ratings must disclose the criteria, date range, and any compensation; performance advertising must be fair and balanced. The SEC\u2019s December 2025 Risk Alert identified these areas as top examination deficiencies.",
  },
  {
    q: "What does a BankForge RIA compliance review cover?",
    a: "BankForge scrapes your public-facing website and Form ADV filings, then scans for the specific disclosures, language patterns, and omissions that SEC examiners look for under Rule 206(4)-1 and Regulation S-P. Every finding is severity-graded with the regulatory citation attached. The BankForge team reviews all findings before delivery. BankForge flags for counsel review \u2014 we never conclude a violation.",
  },
  {
    q: "What compliance issues do community bank websites commonly have?",
    a: "Common digital compliance gaps for community banks include: rate advertisements missing Regulation DD triggering terms (APY without effective date, minimum balance, or fees); missing Equal Housing Lender disclosures on mortgage pages; absent NMLS identifiers on loan product pages; and fee schedules not publicly accessible. BankForge scans for these and additional UDAAP, Reg Z, and Fair Lending signals across your entire public web presence.",
  },
  {
    q: "How does BankForge find compliance gaps on a website?",
    a: "BankForge crawls your public-facing pages \u2014 product pages, disclosures, footers \u2014 without requiring any login or access. Our compliance engine scans every page for the specific language, disclosures, and omissions that regulators flag, mapped directly to the applicable regulatory criteria. Think of it as a compliance Ctrl+F run against your entire website.",
  },
];

export default function HomePage() {
  const [tab, setTab] = useState<'ria' | 'bank'>('ria');

  return (
    <div className="min-h-screen bg-white">
      {/* JSON-LD Schema */}
      {jsonLd.map((schema, i) => (
        <script
          key={i}
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
        />
      ))}
      {/* ─── NAV ───────────────────────────────────────────────── */}
      <nav
        className="fixed top-0 inset-x-0 z-50 px-6 py-3 flex items-center justify-between"
        style={{ backgroundColor: 'rgba(15,35,65,0.80)', backdropFilter: 'blur(12px)' }}
      >
        <a
          href="/"
          className="text-xl tracking-tight"
          style={{ fontFamily: 'var(--font-display)' }}
        >
          <span style={{ color: '#7EB3E8' }}>BankForge</span>
          <span className="text-white">.ai</span>
        </a>
        <div className="hidden md:flex items-center gap-6 text-sm text-gray-300">
          <button onClick={() => setTab('bank')} className="hover:text-white transition-colors">
            For Banks
          </button>
          <button onClick={() => setTab('ria')} className="hover:text-white transition-colors">
            For RIAs
          </button>
          <a href="#how-it-works" className="hover:text-white transition-colors">How it Works</a>
          <a href="/insights" className="hover:text-white transition-colors">Insights</a>
          <a href="/geo-remediation" className="hover:text-white transition-colors">GEO Remediation</a>
          <a href="#about" className="hover:text-white transition-colors">About</a>
        </div>
        <a
          href="mailto:fernando@bankforge.ai"
          className="bg-white text-bf-navy-deep text-sm font-medium px-4 py-2 rounded-lg hover:bg-gray-100 transition-colors"
        >
          Request a Call
        </a>
      </nav>

      {/* ─── HERO ──────────────────────────────────────────────── */}
      <section className="relative min-h-[560px] flex items-center justify-center pt-16">
        <Image
          src="https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=1200&q=80"
          fill
          priority
          alt="Aerial city skyline"
          className="object-cover object-[center_30%]"
        />
        <div
          className="absolute inset-0"
          style={{
            background: 'linear-gradient(to bottom, rgba(15,35,65,0.85) 0%, rgba(15,35,65,0.92) 100%)',
          }}
        />
        <div className="relative z-10 text-center max-w-2xl mx-auto px-6 py-16">
          <span className="inline-block bg-white/10 text-blue-200 text-xs font-medium tracking-wider uppercase px-4 py-1.5 rounded-full mb-5 border border-white/10">
            Compliance Intelligence Platform
          </span>
          <h1
            className="text-white text-[46px] leading-tight mb-5"
            style={{ fontFamily: 'var(--font-display)' }}
          >
            Your next exam cycle starts{' '}
            <em style={{ color: '#7EB3E8' }}>now.</em>
          </h1>
          <p className="text-blue-200/80 text-lg leading-relaxed mb-8 max-w-xl mx-auto">
            BankForge reveals what examiners look for before your next exam cycle.
            Compliance intelligence for community banks and registered investment advisers.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-3 mb-8">
            <a
              href="mailto:fernando@bankforge.ai"
              className="bg-white text-bf-navy-deep font-medium px-6 py-3 rounded-lg hover:bg-gray-100 transition-colors text-sm"
            >
              Request a Compliance Review
            </a>
            <a
              href="#how-it-works"
              className="border border-white/30 text-white font-medium px-6 py-3 rounded-lg hover:bg-white/10 transition-colors text-sm"
            >
              See how it works
            </a>
          </div>
          {/* Audience toggle */}
          <div className="inline-flex bg-white/10 rounded-full p-1 border border-white/10">
            <button
              onClick={() => setTab('ria')}
              className={`px-5 py-2 rounded-full text-sm font-medium transition-all ${
                tab === 'ria'
                  ? 'bg-white text-bf-navy-deep shadow-sm'
                  : 'text-gray-300 hover:text-white'
              }`}
            >
              Investment Advisers
            </button>
            <button
              onClick={() => setTab('bank')}
              className={`px-5 py-2 rounded-full text-sm font-medium transition-all ${
                tab === 'bank'
                  ? 'bg-white text-bf-navy-deep shadow-sm'
                  : 'text-gray-300 hover:text-white'
              }`}
            >
              Community Banks
            </button>
          </div>
        </div>
      </section>

      {/* ─── PANELS ────────────────────────────────────────────── */}
      {tab === 'ria' ? <RiaPanel /> : <BankPanel />}

      {/* ─── FAQ ───────────────────────────────────────────────── */}
      <section className="bg-bf-slate py-16 px-6">
        <div className="max-w-5xl mx-auto">
          <p className="text-bf-navy text-xs font-medium tracking-wide uppercase mb-3">
            Common Questions
          </p>
          <h2
            className="text-3xl text-gray-900 mb-10"
            style={{ fontFamily: 'var(--font-display)' }}
          >
            What compliance reviewers actually look for.
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {faqItems.map((item, i) => (
              <div key={i}>
                <h3 className="text-sm font-medium text-gray-900 mb-2">{item.q}</h3>
                <p className="text-sm text-gray-600 leading-relaxed">{item.a}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ─── CTA BLOCK ─────────────────────────────────────────── */}
      <section className="mx-7 mb-12">
        <div className="relative bg-bf-navy-deep rounded-xl py-12 px-10 overflow-hidden">
          <Image
            src="https://images.unsplash.com/photo-1534430480872-3498386e7856?w=1000&q=70"
            fill
            alt=""
            className="object-cover opacity-10"
          />
          <div className="relative z-10 text-center max-w-xl mx-auto">
            <h2
              className="text-white text-3xl mb-4"
              style={{ fontFamily: 'var(--font-display)' }}
            >
              Your next exam cycle starts{' '}
              <em style={{ color: '#7EB3E8' }}>now.</em>
            </h2>
            <p className="text-blue-200/70 text-sm leading-relaxed mb-6">
              The BankForge team reviews every finding before delivery. No AI-generated reports
              go to clients unreviewed. Every observation is mapped to a specific regulatory citation.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
              <a
                href="mailto:fernando@bankforge.ai"
                className="bg-white text-bf-navy-deep font-medium px-6 py-3 rounded-lg hover:bg-gray-100 transition-colors text-sm"
              >
                Request a Compliance Review
              </a>
              <a
                href="#how-it-works"
                className="border border-white/30 text-white font-medium px-6 py-3 rounded-lg hover:bg-white/10 transition-colors text-sm"
              >
                See how it works
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* ─── FOOTER ────────────────────────────────────────────── */}
      <footer className="py-6 px-6 border-t border-gray-100">
        <div className="max-w-5xl mx-auto flex flex-col md:flex-row items-center justify-between gap-2 text-[11px] text-gray-400">
          <span
            style={{ fontFamily: 'var(--font-display)' }}
            className="text-gray-500 text-sm"
          >
            <span style={{ color: '#1B5299' }}>BankForge</span>.ai
          </span>
          <span className="text-center">
            BankForge flags for counsel review. We never conclude a violation.
          </span>
          <span>&copy; 2026</span>
        </div>
      </footer>
    </div>
  );
}

// ─── RIA Panel ──────────────────────────────────────────────────────

function RiaPanel() {
  return (
    <>
      {/* Section A — White bg */}
      <section className="py-16 px-6">
        <div className="max-w-5xl mx-auto">
          <p className="text-bf-navy text-xs font-medium tracking-wide uppercase mb-3">
            For Investment Advisers
          </p>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-start">
            <div>
              <h2
                className="text-3xl text-gray-900 mb-4 leading-snug"
                style={{ fontFamily: 'var(--font-display)' }}
              >
                SEC examiners are checking your website.{' '}
                <em className="text-bf-navy">Are you?</em>
              </h2>
              <p className="text-gray-600 text-sm leading-relaxed mb-6">
                The December 2025 SEC Risk Alert identified marketing compliance as
                a top examination priority. BankForge scans your public digital presence
                for the same signals examiners look for — testimonial disclosures,
                performance advertising, third-party ratings, and Reg S-P gaps.
              </p>
              <a
                href="mailto:fernando@bankforge.ai"
                className="inline-block bg-bf-navy text-white font-medium px-6 py-3 rounded-lg hover:bg-bf-navy-deep transition-colors text-sm"
              >
                Request a Marketing Rule Audit
              </a>
            </div>
            <SignalCards cards={riaSignalCards} />
          </div>
        </div>
      </section>

      {/* Section B — How it Works */}
      <div id="how-it-works">
        <HowItWorks steps={riaHowItWorksSteps} />
      </div>

      {/* Section C — Slate bg */}
      <section id="about" className="bg-bf-slate py-16 px-6">
        <div className="max-w-5xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-10 items-start">
          {/* Left: Gold callout + stats */}
          <div>
            <div
              className="rounded-lg p-5 mb-6"
              style={{
                backgroundColor: 'var(--bf-gold-bg)',
                borderLeft: '4px solid var(--bf-gold-bdr)',
              }}
            >
              <p className="text-amber-800 text-xs font-medium uppercase tracking-wide mb-2">
                SEC Risk Alert — December 2025
              </p>
              <p className="text-sm text-amber-900 leading-relaxed">
                The SEC Division of Examinations identified marketing practices as a
                2026 examination priority. Testimonial and endorsement disclosures,
                performance advertising, and third-party ratings were cited as the most
                common deficiency areas. Firms examined post-November 2022 are expected
                to demonstrate compliance with the amended Marketing Rule.
              </p>
            </div>
            <div className="grid grid-cols-3 gap-4">
              <div className="text-center">
                <p
                  className="text-2xl text-bf-navy"
                  style={{ fontFamily: 'var(--font-display)' }}
                >
                  23,000+
                </p>
                <p className="text-xs text-gray-500 mt-1">RIAs in corpus</p>
              </div>
              <div className="text-center">
                <p
                  className="text-2xl text-bf-navy"
                  style={{ fontFamily: 'var(--font-display)' }}
                >
                  86,000+
                </p>
                <p className="text-xs text-gray-500 mt-1">Findings analyzed</p>
              </div>
              <div className="text-center">
                <p
                  className="text-2xl text-bf-navy"
                  style={{ fontFamily: 'var(--font-display)' }}
                >
                  5 days
                </p>
                <p className="text-xs text-gray-500 mt-1">Report delivery</p>
              </div>
            </div>
          </div>

          {/* Right: Bio card */}
          <BioCard />
        </div>
      </section>
    </>
  );
}

// ─── Bank Panel ─────────────────────────────────────────────────────

function BankPanel() {
  return (
    <>
      {/* Section A — White bg */}
      <section className="py-16 px-6">
        <div className="max-w-5xl mx-auto">
          <p className="text-bf-navy text-xs font-medium tracking-wide uppercase mb-3">
            For Community Banks
          </p>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-start">
            <div>
              <h2
                className="text-3xl text-gray-900 mb-4 leading-snug"
                style={{ fontFamily: 'var(--font-display)' }}
              >
                What does your website say to{' '}
                <em className="text-bf-navy">examiners?</em>
              </h2>
              <p className="text-gray-600 text-sm leading-relaxed mb-6">
                Most community banks have never had their public digital presence reviewed
                through a compliance lens. BankForge scans your homepage, rate pages, and
                product disclosures against UDAAP, Reg Z, Reg DD, FFIEC guidance, and Fair
                Lending standards — the same frameworks examiners use.
              </p>
              <a
                href="mailto:fernando@bankforge.ai"
                className="inline-block bg-bf-navy text-white font-medium px-6 py-3 rounded-lg hover:bg-bf-navy-deep transition-colors text-sm"
              >
                Request a Compliance Review
              </a>
            </div>
            <SignalCards cards={bankSignalCards} />
          </div>
        </div>
      </section>

      {/* Section B — How it Works */}
      <div id="how-it-works">
        <HowItWorks steps={bankHowItWorksSteps} />
      </div>

      {/* Section C — Tiers */}
      <section className="bg-bf-slate py-16 px-6">
        <div className="max-w-5xl mx-auto">
          <p className="text-bf-navy text-xs font-medium tracking-wide uppercase mb-3">
            Three tiers
          </p>
          <h2
            className="text-3xl text-gray-900 mb-10"
            style={{ fontFamily: 'var(--font-display)' }}
          >
            From a one-time scan to ongoing monitoring.
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Scan */}
            <div className="bg-white rounded-xl border border-gray-200 p-6">
              <p className="text-bf-navy text-xs font-medium uppercase tracking-wide mb-1">Scan</p>
              <p className="text-2xl text-gray-900 mb-1" style={{ fontFamily: 'var(--font-display)' }}>$299</p>
              <p className="text-xs text-gray-400 mb-4">one-time</p>
              <ul className="space-y-2 text-sm text-gray-600">
                <li className="flex items-start gap-2"><span className="text-bf-navy mt-0.5">&#10003;</span>Homepage compliance scan</li>
                <li className="flex items-start gap-2"><span className="text-bf-navy mt-0.5">&#10003;</span>UDAAP / Reg Z / Reg DD / FFIEC / Fair Lending</li>
                <li className="flex items-start gap-2"><span className="text-bf-navy mt-0.5">&#10003;</span>DOCX findings report</li>
                <li className="flex items-start gap-2"><span className="text-bf-navy mt-0.5">&#10003;</span>Digital presence score (0–100)</li>
              </ul>
            </div>
            {/* Monitor */}
            <div className="bg-white rounded-xl border-2 border-bf-navy p-6 relative">
              <span className="absolute -top-3 left-6 bg-bf-navy text-white text-[10px] font-medium px-3 py-0.5 rounded-full uppercase tracking-wider">Recommended</span>
              <p className="text-bf-navy text-xs font-medium uppercase tracking-wide mb-1">Monitor</p>
              <p className="text-2xl text-gray-900 mb-1" style={{ fontFamily: 'var(--font-display)' }}>$749</p>
              <p className="text-xs text-gray-400 mb-4">/month</p>
              <ul className="space-y-2 text-sm text-gray-600">
                <li className="flex items-start gap-2"><span className="text-bf-navy mt-0.5">&#10003;</span>Everything in Scan</li>
                <li className="flex items-start gap-2"><span className="text-bf-navy mt-0.5">&#10003;</span>Monthly re-scan + delta report</li>
                <li className="flex items-start gap-2"><span className="text-bf-navy mt-0.5">&#10003;</span>Peer benchmarking</li>
                <li className="flex items-start gap-2"><span className="text-bf-navy mt-0.5">&#10003;</span>Competitive intelligence feed</li>
              </ul>
            </div>
            {/* Intelligence */}
            <div className="bg-white rounded-xl border border-gray-200 p-6">
              <p className="text-bf-navy text-xs font-medium uppercase tracking-wide mb-1">Intelligence</p>
              <p className="text-2xl text-gray-900 mb-1" style={{ fontFamily: 'var(--font-display)' }}>$1,750</p>
              <p className="text-xs text-gray-400 mb-4">/month &middot; founding rate</p>
              <ul className="space-y-2 text-sm text-gray-600">
                <li className="flex items-start gap-2"><span className="text-bf-navy mt-0.5">&#10003;</span>Everything in Monitor</li>
                <li className="flex items-start gap-2"><span className="text-bf-navy mt-0.5">&#10003;</span>10-page compliance audit</li>
                <li className="flex items-start gap-2"><span className="text-bf-navy mt-0.5">&#10003;</span>Regulatory environment brief</li>
                <li className="flex items-start gap-2"><span className="text-bf-navy mt-0.5">&#10003;</span>Executive dashboard</li>
                <li className="flex items-start gap-2"><span className="text-bf-navy mt-0.5">&#10003;</span>GEO visibility tracking</li>
              </ul>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
