'use client';

import { useState } from 'react';
import Link from 'next/link';
import DemoRequestForm from './DemoRequestForm';

interface FaqItem {
  q: string;
  a: string;
}

interface AudiencePageProps {
  pageType: 'bank' | 'cu' | 'ria';
  h1: string;
  description: string;
  ctaText: string;
  faqItems: FaqItem[];
  extraNote?: string;
}

const audienceTypeMap = { bank: 'bank', cu: 'credit_union', ria: 'ria' } as const;
const sourcePageMap = { bank: '/for-banks', cu: '/for-credit-unions', ria: '/for-rias' } as const;

export default function AudiencePage({ pageType, h1, ctaText, faqItems, extraNote }: AudiencePageProps) {
  const [openFaq, setOpenFaq] = useState<number | null>(null);

  return (
    <div className="min-h-screen bg-white">
      {/* Nav */}
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
            href="mailto:fernando@bankforge.ai"
            className="bg-white text-bf-navy-deep text-sm font-medium px-4 py-2 rounded-lg hover:bg-gray-100 transition-colors"
          >
            Request a Call
          </Link>
        </div>
      </nav>

      {/* Hero */}
      <section className="pt-24 pb-16 px-6 bg-bf-navy-deep text-white">
        <div className="max-w-3xl mx-auto text-center">
          <h1
            className="text-4xl mb-5 leading-tight"
            style={{ fontFamily: 'var(--font-display)' }}
          >
            {h1}
          </h1>
          <p className="text-blue-200/80 text-lg leading-relaxed max-w-xl mx-auto mb-8">
            Know what your website says about you. Before customers or regulators do.
          </p>
          <DemoRequestForm
            audienceType={audienceTypeMap[pageType]}
            sourcePage={sourcePageMap[pageType]}
            sourceCta="hero_primary"
            ctaLabel={ctaText}
            buttonClassName="bg-white text-bf-navy-deep font-medium px-6 py-3 rounded-lg hover:bg-gray-100 transition-colors text-sm"
          />
        </div>
      </section>

      {/* FAQ */}
      <section className="py-16 px-6 bg-bf-slate">
        <div className="max-w-3xl mx-auto">
          <p className="text-bf-navy text-xs font-medium tracking-wide uppercase mb-3">
            Common Questions
          </p>
          <h2
            className="text-3xl text-gray-900 mb-8"
            style={{ fontFamily: 'var(--font-display)' }}
          >
            What you need to know.
          </h2>
          <div className="space-y-3">
            {faqItems.map((item, i) => (
              <div key={i} className="bg-white rounded-lg border border-gray-200 overflow-hidden">
                <button
                  onClick={() => setOpenFaq(openFaq === i ? null : i)}
                  className="w-full text-left px-5 py-4 flex items-center justify-between"
                >
                  <span className="text-sm font-medium text-gray-900">{item.q}</span>
                  <span className="text-gray-400 text-lg ml-4">
                    {openFaq === i ? '\u2212' : '+'}
                  </span>
                </button>
                {openFaq === i && (
                  <div className="px-5 pb-4">
                    <p className="text-sm text-gray-600 leading-relaxed">{item.a}</p>
                  </div>
                )}
              </div>
            ))}
          </div>
          {extraNote && (
            <p className="text-sm text-gray-500 mt-6 leading-relaxed">{extraNote}</p>
          )}
        </div>
      </section>

      {/* CTA Block */}
      <section className="mx-7 my-12">
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
            <DemoRequestForm
              audienceType={audienceTypeMap[pageType]}
              sourcePage={sourcePageMap[pageType]}
              sourceCta="cta_block"
              ctaLabel={ctaText}
              buttonClassName="bg-white text-bf-navy-deep font-medium px-6 py-3 rounded-lg hover:bg-gray-100 transition-colors text-sm"
            />
          </div>
        </div>
      </section>

      {/* Footer */}
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
