'use client';

import { useState } from 'react';
import Link from 'next/link';

export default function GeoRemediationPage() {
  const [firstName, setFirstName] = useState('');
  const [bankName, setBankName] = useState('');
  const [email, setEmail] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSubmitting(true);
    setError('');

    try {
      const res = await fetch('/api/waitlist', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ firstName, bankName, email }),
      });

      if (res.ok) {
        setSubmitted(true);
      } else {
        setError('Something went wrong. Please try again.');
      }
    } catch {
      setError('Network error. Please try again.');
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="min-h-screen bg-white">
      {/* Nav */}
      <nav
        className="fixed top-0 inset-x-0 z-50 px-6 py-3 flex items-center justify-between"
        style={{ backgroundColor: 'rgba(15,35,65,0.80)', backdropFilter: 'blur(12px)' }}
      >
        <Link
          href="/"
          className="text-xl tracking-tight"
          style={{ fontFamily: 'var(--font-display)' }}
        >
          <span style={{ color: '#7EB3E8' }}>BankForge</span>
          <span className="text-white">.ai</span>
        </Link>
        <div className="hidden md:flex items-center gap-6 text-sm text-gray-300">
          <Link href="/insights" className="hover:text-white transition-colors">Insights</Link>
          <Link href="/geo-remediation" className="text-white">GEO Remediation</Link>
          <Link href="/#how-it-works" className="hover:text-white transition-colors">How it Works</Link>
          <Link href="/#about" className="hover:text-white transition-colors">About</Link>
        </div>
        <Link
          href="mailto:fernando@bankforge.ai"
          className="bg-white text-bf-navy-deep text-sm font-medium px-4 py-2 rounded-lg hover:bg-gray-100 transition-colors"
        >
          Request a Call
        </Link>
      </nav>

      {/* Hero */}
      <section className="pt-24 pb-16 px-6 bg-bf-navy-deep text-white">
        <div className="max-w-3xl mx-auto text-center">
          <span className="inline-block bg-white/10 text-blue-200 text-xs font-medium tracking-wider uppercase px-4 py-1.5 rounded-full mb-5 border border-white/10">
            GEO Remediation — Opening June 2026
          </span>
          <h1
            className="text-4xl mb-5 leading-tight"
            style={{ fontFamily: 'var(--font-display)' }}
          >
            Is your bank&apos;s GEO score in the{' '}
            <em style={{ color: '#7EB3E8' }}>bottom quartile?</em>
          </h1>
          <p className="text-blue-200/80 text-lg leading-relaxed max-w-xl mx-auto">
            BankForge has already computed AI visibility scores across 4,300+
            bank websites. We know where the gaps are. Join the waitlist —
            opening to first clients June 2026.
          </p>
        </div>
      </section>

      {/* Stats */}
      <section className="py-12 px-6 bg-bf-slate">
        <div className="max-w-4xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
          <div>
            <p
              className="text-3xl text-bf-navy"
              style={{ fontFamily: 'var(--font-display)' }}
            >
              4,300+
            </p>
            <p className="text-xs text-gray-500 mt-1">Banks scanned</p>
          </div>
          <div>
            <p
              className="text-3xl text-bf-navy"
              style={{ fontFamily: 'var(--font-display)' }}
            >
              64%
            </p>
            <p className="text-xs text-gray-500 mt-1">GBP gap detected</p>
          </div>
          <div>
            <p
              className="text-3xl text-bf-navy"
              style={{ fontFamily: 'var(--font-display)' }}
            >
              80 vs 10
            </p>
            <p className="text-xs text-gray-500 mt-1">Miami MSA top vs bottom</p>
          </div>
          <div>
            <p
              className="text-3xl text-bf-navy"
              style={{ fontFamily: 'var(--font-display)' }}
            >
              92.3%
            </p>
            <p className="text-xs text-gray-500 mt-1">RIAs with accessibility gaps</p>
          </div>
        </div>
      </section>

      {/* Gold callout */}
      <section className="py-12 px-6">
        <div className="max-w-3xl mx-auto">
          <div
            className="rounded-lg p-6"
            style={{
              backgroundColor: 'var(--bf-gold-bg)',
              borderLeft: '4px solid var(--bf-gold-bdr)',
            }}
          >
            <p className="text-amber-800 text-xs font-medium uppercase tracking-wide mb-2">
              Starting a website redesign?
            </p>
            <p className="text-sm text-amber-900 leading-relaxed">
              Run a compliance scan first. 89% of community bank websites have at least
              one compliance gap that would appear on an examiner&apos;s checklist. A redesign
              without a compliance baseline risks baking those gaps into a brand-new site.
            </p>
          </div>
        </div>
      </section>

      {/* Waitlist form */}
      <section className="py-12 px-6 bg-bf-slate">
        <div className="max-w-md mx-auto">
          <h2
            className="text-2xl text-gray-900 mb-2 text-center"
            style={{ fontFamily: 'var(--font-display)' }}
          >
            Join the GEO Remediation waitlist
          </h2>
          <p className="text-sm text-gray-500 text-center mb-8">
            First clients onboard June 2026. We&apos;ll reach out when it&apos;s your turn.
          </p>

          {submitted ? (
            <div className="bg-white rounded-xl border border-gray-200 p-8 text-center">
              <p
                className="text-xl text-bf-navy mb-2"
                style={{ fontFamily: 'var(--font-display)' }}
              >
                You&apos;re on the list.
              </p>
              <p className="text-sm text-gray-500">
                The BankForge team will follow up within 48 hours.
              </p>
            </div>
          ) : (
            <form
              onSubmit={handleSubmit}
              className="bg-white rounded-xl border border-gray-200 p-8 space-y-4"
            >
              <div>
                <label className="block text-xs font-medium text-gray-700 mb-1">
                  First name
                </label>
                <input
                  type="text"
                  required
                  value={firstName}
                  onChange={(e) => setFirstName(e.target.value)}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-bf-navy/30 focus:border-bf-navy"
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-gray-700 mb-1">
                  Bank name
                </label>
                <input
                  type="text"
                  required
                  value={bankName}
                  onChange={(e) => setBankName(e.target.value)}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-bf-navy/30 focus:border-bf-navy"
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-gray-700 mb-1">
                  Email
                </label>
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-bf-navy/30 focus:border-bf-navy"
                />
              </div>
              {error && <p className="text-red-600 text-xs">{error}</p>}
              <button
                type="submit"
                disabled={submitting}
                className="w-full bg-bf-navy text-white font-medium py-3 rounded-lg hover:bg-bf-navy-deep transition-colors text-sm disabled:opacity-50"
              >
                {submitting ? 'Submitting...' : 'Join Waitlist'}
              </button>
            </form>
          )}
        </div>
      </section>

      {/* Footer */}
      <footer className="py-6 px-6 border-t border-gray-100">
        <div className="max-w-5xl mx-auto flex flex-col md:flex-row items-center justify-between gap-2 text-[11px] text-gray-400">
          <span style={{ fontFamily: 'var(--font-display)' }} className="text-gray-500 text-sm">
            <span style={{ color: '#1B5299' }}>BankForge</span>.ai
          </span>
          <span>BankForge flags findings for compliance counsel review. We never conclude a violation.</span>
          <span>&copy; 2026</span>
        </div>
      </footer>
    </div>
  );
}
