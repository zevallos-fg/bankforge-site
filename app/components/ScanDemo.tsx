'use client';

import { useState, useEffect } from 'react';

interface ScanResult {
  found: boolean;
  entity_name?: string;
  domain?: string;
  entity_type?: string;
  asset_tier?: string;
  primary_msa?: string;
  geo_visibility_score?: number;
  signal_checks?: Record<string, unknown>;
  gbp_claimed?: string;
  gbp_rating?: string;
  dmarc_present?: string;
  dkim_present?: string;
  ssl_health_tier?: string;
  findings?: Array<{ description: string; severity: string }>;
}

const LOADING_STEPS = [
  'Scraping public pages...',
  'Running compliance checks...',
  'Scoring AI visibility...',
  'Generating findings...',
];

export default function ScanDemo({ onClose }: { onClose: () => void }) {
  const [domain, setDomain] = useState('');
  const [tosAccepted, setTosAccepted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [loadingStep, setLoadingStep] = useState(0);
  const [result, setResult] = useState<ScanResult | null>(null);
  const [error, setError] = useState('');

  useEffect(() => {
    if (!loading) return;
    if (loadingStep >= LOADING_STEPS.length) return;
    const delays = [800, 800, 800, 600];
    const timer = setTimeout(() => setLoadingStep((s) => s + 1), delays[loadingStep] ?? 800);
    return () => clearTimeout(timer);
  }, [loading, loadingStep]);

  async function handleScan(e: React.FormEvent) {
    e.preventDefault();
    if (!tosAccepted) return;
    setError('');
    setResult(null);
    setLoading(true);
    setLoadingStep(0);

    try {
      const cleanDomain = domain.trim().toLowerCase().replace(/^https?:\/\//, '').replace(/^www\./, '').replace(/\/.*$/, '');
      const res = await fetch(`/api/scan-preview?domain=${encodeURIComponent(cleanDomain)}`);
      const data = await res.json();

      if (res.status === 429) {
        setError('One preview scan is available every 72 hours. Request a full review for immediate access.');
        setLoading(false);
        return;
      }

      // Wait for animation to finish
      await new Promise((resolve) => setTimeout(resolve, 3200));
      setResult(data);
    } catch {
      setError('Something went wrong. Please try again.');
    } finally {
      setLoading(false);
    }
  }

  const geoAvg = result?.entity_type === 'ria' ? 33.3 : 45.8;
  const geoColor =
    (result?.geo_visibility_score ?? 0) < 40
      ? '#DC2626'
      : (result?.geo_visibility_score ?? 0) < 60
        ? '#D97706'
        : '#16A34A';

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/60" onClick={onClose} />
      <div className="relative bg-white rounded-xl shadow-2xl max-w-lg w-full max-h-[90vh] overflow-y-auto">
        <div className="p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl text-gray-900" style={{ fontFamily: 'var(--font-display)' }}>
              Scan Preview
            </h2>
            <button onClick={onClose} className="text-gray-400 hover:text-gray-600 text-xl">&times;</button>
          </div>

          {!result && !loading && (
            <form onSubmit={handleScan}>
              <label className="block text-xs font-medium text-gray-700 mb-1">
                Enter your institution&apos;s domain
              </label>
              <input
                type="text"
                required
                placeholder="e.g. yourbank.com"
                value={domain}
                onChange={(e) => setDomain(e.target.value)}
                className="w-full border border-gray-300 rounded-lg px-3 py-2.5 text-sm mb-4 focus:outline-none focus:ring-2 focus:ring-bf-navy/30 focus:border-bf-navy"
              />
              <label className="flex items-start gap-2 mb-4 cursor-pointer">
                <input
                  type="checkbox"
                  checked={tosAccepted}
                  onChange={(e) => setTosAccepted(e.target.checked)}
                  className="mt-0.5"
                />
                <span className="text-xs text-gray-600 leading-relaxed">
                  I confirm this preview is for my institution&apos;s internal use only.
                  Commercial resale of BankForge findings is prohibited.
                </span>
              </label>
              {error && <p className="text-red-600 text-xs mb-3">{error}</p>}
              <button
                type="submit"
                disabled={!tosAccepted || !domain.trim()}
                className="w-full bg-bf-navy text-white font-medium py-3 rounded-lg hover:bg-bf-navy-deep transition-colors text-sm disabled:opacity-40"
              >
                Run Preview Scan
              </button>
            </form>
          )}

          {loading && (
            <div className="py-10 text-center">
              <div className="inline-block w-8 h-8 border-2 border-bf-navy border-t-transparent rounded-full animate-spin mb-4" />
              <div className="space-y-2">
                {LOADING_STEPS.map((step, i) => (
                  <p
                    key={i}
                    className="text-sm transition-opacity duration-300"
                    style={{ opacity: i <= loadingStep ? 1 : 0.2, color: i <= loadingStep ? '#1B5299' : '#9CA3AF' }}
                  >
                    {i < loadingStep ? '\u2713' : i === loadingStep ? '\u25CF' : '\u25CB'} {step}
                  </p>
                ))}
              </div>
            </div>
          )}

          {result && !result.found && (
            <NotFoundCapture domain={domain} />
          )}

          {result && result.found && (
            <div>
              {/* Header */}
              <div className="flex items-start justify-between mb-4">
                <div>
                  <h3 className="text-lg font-medium text-gray-900">{result.entity_name}</h3>
                  <p className="text-xs text-gray-500">
                    {result.asset_tier && `${result.asset_tier} \u00B7 `}{result.primary_msa ?? result.domain}
                  </p>
                </div>
                <div className="text-right">
                  <p className="text-3xl font-bold" style={{ color: geoColor, fontFamily: 'var(--font-display)' }}>
                    {result.geo_visibility_score ?? 'N/A'}
                  </p>
                  <p className="text-xs text-gray-400">
                    GEO Score &middot; vs {geoAvg} avg
                  </p>
                </div>
              </div>

              {/* Findings */}
              {result.findings && result.findings.length > 0 && (
                <div className="mb-4">
                  <p className="text-xs font-medium text-gray-500 uppercase tracking-wide mb-2">
                    Compliance Findings
                  </p>
                  {result.findings.slice(0, 3).map((f, i) => (
                    <div key={i} className="flex items-start gap-2 mb-2">
                      <span
                        className="text-[10px] font-medium uppercase tracking-wider px-1.5 py-0.5 rounded mt-0.5 shrink-0"
                        style={{
                          backgroundColor: f.severity === 'HIGH' ? '#FEE2E2' : f.severity === 'MEDIUM' ? '#FEF3C7' : '#F3F4F6',
                          color: f.severity === 'HIGH' ? '#991B1B' : f.severity === 'MEDIUM' ? '#92400E' : '#6B7280',
                        }}
                      >
                        {f.severity}
                      </span>
                      <p className="text-sm text-gray-700">{f.description}</p>
                    </div>
                  ))}
                  {result.findings.length > 3 && (
                    <p className="text-xs text-gray-400 mt-2" style={{ filter: 'blur(0.3px)' }}>
                      Full report includes {result.findings.length - 3} more findings &rarr;
                    </p>
                  )}
                </div>
              )}

              {/* Digital signals */}
              <div className="flex flex-wrap gap-2 mb-4">
                <Pill label="GBP" value={result.gbp_claimed === 'true' ? 'Claimed' : 'Unclaimed'} good={result.gbp_claimed === 'true'} />
                <Pill label="DMARC" value={result.dmarc_present === 'true' ? 'Present' : 'Missing'} good={result.dmarc_present === 'true'} />
                <Pill label="DKIM" value={result.dkim_present === 'true' ? 'Present' : 'Missing'} good={result.dkim_present === 'true'} />
                <Pill label="SSL" value={result.ssl_health_tier ?? 'Unknown'} good={result.ssl_health_tier === 'strong' || result.ssl_health_tier === 'adequate'} />
              </div>

              {/* Disclaimer */}
              <div className="rounded-lg p-3 mb-4" style={{ backgroundColor: '#FFFBF0', border: '1px solid #C8A84B' }}>
                <p className="text-xs text-amber-800 leading-relaxed">
                  <strong>Note:</strong> This preview is based on BankForge&apos;s March 2026 scan.
                  A live real-time scan is coming June 2026. Full findings report requires a
                  compliance review engagement.
                </p>
              </div>

              {/* CTA */}
              <a
                href="mailto:fernando@bankforge.ai?subject=Full%20Findings%20Report%20Request"
                className="block w-full text-center bg-bf-navy text-white font-medium py-3 rounded-lg hover:bg-bf-navy-deep transition-colors text-sm"
              >
                Request your full findings report &rarr;
              </a>

              {/* Watermark */}
              <p className="text-[10px] text-gray-300 text-center mt-3">
                BankForge.ai &mdash; internal use only &middot; commercial resale prohibited &middot; March 2026 data
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

function NotFoundCapture({ domain }: { domain: string }) {
  const [email, setEmail] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState('');

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSubmitting(true);
    setSubmitError('');
    try {
      const res = await fetch('/api/waitlist', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          firstName: 'Website Preview Request',
          bankName: domain,
          email,
          source: 'scan_not_found',
        }),
      });
      if (res.ok) {
        setSubmitted(true);
      } else {
        setSubmitError('Something went wrong \u2014 email us directly at fernando@bankforge.ai');
      }
    } catch {
      setSubmitError('Something went wrong \u2014 email us directly at fernando@bankforge.ai');
    } finally {
      setSubmitting(false);
    }
  }

  if (submitted) {
    return (
      <div className="py-6 text-center">
        <p className="text-bf-navy text-sm font-medium">
          Got it. We&apos;ll be in touch once your scan is complete.
        </p>
      </div>
    );
  }

  return (
    <div className="py-6">
      <p className="text-gray-600 text-sm leading-relaxed mb-4">
        We haven&apos;t scanned this institution yet. Your request has been logged
        and we&apos;ll run a manual review. Enter your email below and we&apos;ll
        reach out when it&apos;s ready.
      </p>
      <form onSubmit={handleSubmit} className="flex gap-2">
        <input
          type="email"
          required
          placeholder="your@email.com"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="flex-1 border border-gray-300 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-bf-navy/30 focus:border-bf-navy"
        />
        <button
          type="submit"
          disabled={submitting}
          className="bg-bf-navy text-white font-medium px-4 py-2.5 rounded-lg hover:bg-bf-navy-deep transition-colors text-sm disabled:opacity-50 shrink-0"
        >
          {submitting ? 'Sending...' : 'Request a review \u2192'}
        </button>
      </form>
      {submitError && <p className="text-red-600 text-xs mt-2">{submitError}</p>}
    </div>
  );
}

function Pill({ label, value, good }: { label: string; value: string; good: boolean }) {
  return (
    <span
      className="inline-flex items-center gap-1 text-xs px-2 py-1 rounded-full border"
      style={{
        backgroundColor: good ? '#F0FDF4' : '#FEF2F2',
        borderColor: good ? '#BBF7D0' : '#FECACA',
        color: good ? '#166534' : '#991B1B',
      }}
    >
      <span className="font-medium">{label}:</span> {value}
    </span>
  );
}
