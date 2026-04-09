'use client';

import { useState, useEffect } from 'react';

/* eslint-disable @typescript-eslint/no-explicit-any */

interface ScanResponse {
  found: boolean;
  entity?: {
    name: string;
    domain: string;
    fdic_cert: string | null;
    entity_type: string;
    asset_tier: string | null;
    location: string | null;
  };
  geo?: {
    score: number | null;
    peer_avg: number | null;
    peer_p75: number | null;
    percentile: number | null;
    peer_count: number | null;
    peer_state: string | null;
    peer_asset_tier: string | null;
    top_peer_score: number | null;
    top_peer_name: string | null;
  };
  signals?: {
    gbp_claimed: boolean | null;
    gbp_rating: number | null;
    gbp_reviews: number | null;
    dmarc_present: boolean | null;
    dmarc_policy: string | null;
    dkim_present: boolean | null;
    spf_present: boolean | null;
    ssl_health: string | null;
    tls_version: string | null;
    cert_expiry_days: number | null;
    web_velocity: string | null;
    last_capture: string | null;
  };
  compliance?: {
    total: number;
    high: number;
    medium: number;
    low: number;
    top_flags: Array<{ category: string | null; location: string | null; summary: string }>;
  };
  repdte?: string | null;
}

const LOADING_STEPS = [
  'Scraping public pages...',
  'Running compliance checks...',
  'Scoring AI visibility...',
  'Generating findings...',
];

export default function ScanDemo({ onClose, inline = false }: { onClose?: () => void; inline?: boolean }) {
  const [domain, setDomain] = useState('');
  const [tosAccepted, setTosAccepted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [loadingStep, setLoadingStep] = useState(0);
  const [result, setResult] = useState<ScanResponse | null>(null);
  const [error, setError] = useState('');
  const [showAiContext, setShowAiContext] = useState(false);

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

      await new Promise((resolve) => setTimeout(resolve, 3200));
      setResult(data);
    } catch {
      setError('Something went wrong. Please try again.');
    } finally {
      setLoading(false);
    }
  }

  const geo = result?.geo;
  const signals = result?.signals;
  const compliance = result?.compliance;
  const geoScore = geo?.score ?? 0;
  const geoColor = geoScore >= 60 ? '#16A34A' : geoScore >= 40 ? '#D97706' : '#DC2626';
  const geoGap = geo?.top_peer_score != null && geo.score != null ? geo.top_peer_score - geo.score : null;

  const innerContent = (
    <div className={inline ? 'w-full' : 'p-6'}>
      {!inline && (
        <button onClick={onClose} className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 text-xl">&times;</button>
      )}

          {/* ─── INPUT FORM ──────────────────────────────────── */}
          {!result && !loading && (
            <>
              <h2 className="text-xl text-gray-900 mb-6" style={{ fontFamily: 'var(--font-display)' }}>
                Scan Preview
              </h2>
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
            </>
          )}

          {/* ─── LOADING ─────────────────────────────────────── */}
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

          {/* ─── NOT FOUND ───────────────────────────────────── */}
          {result && !result.found && (
            <NotFoundCapture domain={domain} />
          )}

          {/* ─── RESULTS ─────────────────────────────────────── */}
          {result && result.found && (
            <div>
              {/* Section A — Header */}
              <div className="mb-4">
                <h3 className="text-lg font-medium text-gray-900">{result.entity?.name}</h3>
                <p className="text-xs text-gray-500">
                  {result.entity?.asset_tier && `${result.entity.asset_tier} \u00B7 `}
                  {result.entity?.location ?? result.entity?.domain}
                </p>
              </div>

              {/* Section B — AI SEO Score */}
              <div className="rounded-lg p-4 mb-4" style={{ backgroundColor: '#F8FAFC', border: '1px solid #E2E8F0' }}>
                <div className="flex items-center justify-between mb-2">
                  <p className="text-xs font-medium text-gray-500 uppercase tracking-wide">AI SEO Score</p>
                  <p className="text-xs text-gray-400">{result.repdte ? `Data: ${result.repdte}` : ''}</p>
                </div>
                <div className="flex items-end gap-2 mb-2">
                  <span className="text-4xl font-bold" style={{ color: geoColor, fontFamily: 'var(--font-display)' }}>
                    {geo?.score ?? 'N/A'}
                  </span>
                  <span className="text-gray-400 text-lg mb-1">/ 100</span>
                </div>
                {/* Progress bar */}
                <div className="w-full h-2 bg-gray-200 rounded-full mb-3">
                  <div
                    className="h-2 rounded-full transition-all"
                    style={{ width: `${Math.min((geoScore / 100) * 100, 100)}%`, backgroundColor: geoColor }}
                  />
                </div>
                {/* Peer context */}
                <div className="flex flex-wrap gap-x-4 gap-y-1 text-xs text-gray-500 mb-3">
                  {geo?.peer_avg != null && <span>Peer avg: <strong className="text-gray-700">{geo.peer_avg}</strong></span>}
                  {geo?.top_peer_score != null && <span>Top peer: <strong className="text-gray-700">{geo.top_peer_score}</strong></span>}
                  {geo?.percentile != null && geo?.peer_count != null && geo?.peer_state && (
                    <span>Rank: <strong className="text-gray-700">Top {Math.max(1, Math.round(100 - geo.percentile))}%</strong> of {geo.peer_count} {geo.peer_state} peers</span>
                  )}
                </div>
                {/* Competitor gap warning */}
                {geoGap != null && geoGap > 15 && (
                  <div className="rounded p-2.5 mb-3" style={{ backgroundColor: '#FEF3C7', border: '1px solid #F59E0B' }}>
                    <p className="text-xs text-amber-800 leading-relaxed">
                      <strong>\u26A0\uFE0F Top competitor{geo?.top_peer_name ? ` (${geo.top_peer_name})` : ''} scores {geo?.top_peer_score}</strong> &mdash; a {geoGap}-point gap.
                      Institutions with higher AI SEO scores capture more AI search results when customers search for banking services in your market.
                    </p>
                  </div>
                )}
                {/* AI context toggle */}
                <button
                  onClick={() => setShowAiContext(!showAiContext)}
                  className="text-xs text-bf-navy hover:underline cursor-pointer"
                >
                  {showAiContext ? '\u25B2 Hide' : '\u25BC What does this score measure?'}
                </button>
                {showAiContext && (
                  <div className="mt-2 text-xs text-gray-600 leading-relaxed space-y-2">
                    <p className="font-medium text-gray-700">BankForge tests AI visibility across three platforms:</p>
                    <div className="space-y-1 pl-1">
                      <p>\uD83E\uDD16 <strong>ChatGPT</strong> &mdash; When a customer asks &ldquo;best bank near Miami&rdquo;</p>
                      <p>\uD83D\uDD0D <strong>Perplexity</strong> &mdash; When a prospect researches &ldquo;community banks in Florida&rdquo;</p>
                      <p>\u2726 <strong>Google AI</strong> &mdash; When someone searches &ldquo;banking services Coconut Grove&rdquo;</p>
                    </div>
                    <p>
                      A score of {geo?.score ?? '—'} means your institution appears in AI responses for roughly {geo?.score != null ? Math.round(geo.score / 2) : '—'}% of relevant local banking queries.
                      Institutions scoring below 40 are effectively invisible &mdash; AI systems answer without mentioning them.
                    </p>
                    <p className="font-medium text-gray-700">Five factors that drive your score:</p>
                    <ul className="list-disc pl-4 space-y-0.5">
                      <li>Schema markup (JSON-LD structured data)</li>
                      <li>Google Business Profile completeness and review volume</li>
                      <li>Content authority and freshness</li>
                      <li>AI crawler access (are bots allowed to index your pages?)</li>
                      <li>Web archive history and update frequency</li>
                    </ul>
                  </div>
                )}
              </div>

              {/* Section C — Compliance Snapshot */}
              {compliance && compliance.total > 0 && (
                <div className="mb-4">
                  <p className="text-xs font-medium text-gray-500 uppercase tracking-wide mb-2">Compliance Signals</p>
                  <div className="flex gap-3 mb-3">
                    {compliance.high > 0 && (
                      <span className="text-xs"><span className="inline-block w-2 h-2 rounded-full mr-1" style={{ backgroundColor: '#DC2626' }} />{compliance.high} High</span>
                    )}
                    {compliance.medium > 0 && (
                      <span className="text-xs"><span className="inline-block w-2 h-2 rounded-full mr-1" style={{ backgroundColor: '#D97706' }} />{compliance.medium} Medium</span>
                    )}
                    {compliance.low > 0 && (
                      <span className="text-xs"><span className="inline-block w-2 h-2 rounded-full mr-1" style={{ backgroundColor: '#9CA3AF' }} />{compliance.low} Low</span>
                    )}
                  </div>
                  {compliance.top_flags.length > 0 && (
                    <div className="space-y-2">
                      {compliance.top_flags.map((f, i) => (
                        <div key={i} className="flex items-start gap-2">
                          <span
                            className="text-[10px] font-medium uppercase tracking-wider px-1.5 py-0.5 rounded mt-0.5 shrink-0"
                            style={{ backgroundColor: '#FEE2E2', color: '#991B1B' }}
                          >
                            {f.category ?? 'HIGH'}
                          </span>
                          <div>
                            <p className="text-sm text-gray-700">{f.summary}</p>
                            {f.location && <p className="text-xs text-gray-400">{f.location}</p>}
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                  {compliance.total > 2 && (
                    <p className="text-xs text-gray-400 mt-2">
                      Full report includes {compliance.total - 2} more findings &rarr;
                    </p>
                  )}
                </div>
              )}

              {/* Section D — Technical Signals Grid */}
              <div className="mb-4">
                <p className="text-xs font-medium text-gray-500 uppercase tracking-wide mb-2">Technical Signals</p>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                  <SignalCell
                    label="GBP"
                    status={signals?.gbp_claimed === true ? '\u2705' : signals?.gbp_claimed === false ? '\u26A0\uFE0F' : '\u2014'}
                    value={signals?.gbp_claimed ? `${signals.gbp_rating ?? '—'}\u2605 \u00B7 ${signals.gbp_reviews ?? 0} reviews` : 'Unclaimed'}
                    good={signals?.gbp_claimed === true}
                    explainer="Primary AI data source for local search. Claimed profiles with reviews rank higher in ChatGPT and Perplexity local queries."
                  />
                  <SignalCell
                    label="DMARC"
                    status={!signals?.dmarc_present ? '\u274C' : signals?.dmarc_policy === 'reject' ? '\u2705' : '\u26A0\uFE0F'}
                    value={!signals?.dmarc_present ? 'Missing' : `Policy: ${signals.dmarc_policy ?? 'unknown'}`}
                    good={signals?.dmarc_present === true && signals?.dmarc_policy === 'reject'}
                    explainer="Prevents email spoofing. 'Reject' policy blocks fraudulent emails. Missing = FFIEC IT examination flag."
                  />
                  <SignalCell
                    label="DKIM"
                    status={signals?.dkim_present ? '\u2705' : '\u26A0\uFE0F'}
                    value={signals?.dkim_present ? 'Configured' : 'Not configured'}
                    good={signals?.dkim_present === true}
                    explainer="Cryptographic email authentication. Missing DKIM means outbound emails can't be verified."
                  />
                  <SignalCell
                    label="SPF"
                    status={signals?.spf_present ? '\u2705' : '\u26A0\uFE0F'}
                    value={signals?.spf_present ? 'Configured' : 'Missing'}
                    good={signals?.spf_present === true}
                    explainer="Authorizes which servers can send on your behalf. Required alongside DMARC for complete email security."
                  />
                  <SignalCell
                    label="SSL / TLS"
                    status={signals?.ssl_health === 'strong' ? '\u2705' : signals?.ssl_health === 'weak' ? '\u274C' : '\u26A0\uFE0F'}
                    value={signals?.tls_version ?? signals?.ssl_health ?? 'Unknown'}
                    good={signals?.ssl_health === 'strong' || signals?.ssl_health === 'adequate'}
                    explainer="Encrypts website traffic. TLS 1.3 is gold standard. Expiring certs are an FFIEC cybersecurity examination flag."
                    extra={signals?.cert_expiry_days != null && signals.cert_expiry_days < 90 ? `\u26A0\uFE0F Cert expires in ${signals.cert_expiry_days} days` : undefined}
                  />
                  <SignalCell
                    label="Web Activity"
                    status={signals?.web_velocity === 'active' ? '\u2705' : signals?.web_velocity ? '\u26A0\uFE0F' : '\u2014'}
                    value={signals?.web_velocity ? `${signals.web_velocity.charAt(0).toUpperCase() + signals.web_velocity.slice(1)} activity` : 'No data'}
                    good={signals?.web_velocity === 'active'}
                    explainer="Content freshness signal for AI engines. Stale sites rank lower. Also flags whether rate disclosures are being updated."
                  />
                </div>
              </div>

              {/* Section E — Footer */}
              <div className="rounded-lg p-3 mb-4" style={{ backgroundColor: '#F8FAFC', border: '1px solid #E2E8F0' }}>
                <p className="text-xs text-gray-500 leading-relaxed">
                  This preview is based on BankForge&apos;s {result.repdte ?? 'March 2026'} corpus scan.
                  A live real-time scan is available with a compliance review engagement.
                </p>
              </div>

              <a
                href="mailto:outreach@bankforge.ai?subject=Full%20Findings%20Report%20Request"
                className="block w-full text-center bg-bf-navy text-white font-medium py-3 rounded-lg hover:bg-bf-navy-deep transition-colors text-sm"
              >
                Request your full findings report &rarr;
              </a>
            </div>
          )}
    </div>
  );

  if (inline) {
    return <div className="w-full max-w-2xl mx-auto bg-white rounded-xl border border-gray-200">{innerContent}</div>;
  }

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/60" onClick={onClose} />
      <div className="relative bg-white rounded-xl shadow-2xl max-w-lg w-full max-h-[90vh] overflow-y-auto">
        {innerContent}
      </div>
    </div>
  );
}

// ─── Signal Cell Component ────────────────────────────────────────────────

function SignalCell({ label, status, value, good, explainer, extra }: {
  label: string;
  status: string;
  value: string;
  good: boolean;
  explainer: string;
  extra?: string;
}) {
  return (
    <div
      className="rounded-lg p-2.5"
      style={{ backgroundColor: good ? '#F0FDF4' : '#FAFAFA', border: `1px solid ${good ? '#BBF7D0' : '#E5E7EB'}` }}
    >
      <div className="flex items-center gap-1 mb-1">
        <span className="text-sm">{status}</span>
        <span className="text-xs font-medium text-gray-700">{label}</span>
      </div>
      <p className="text-xs text-gray-600 mb-1">{value}</p>
      {extra && <p className="text-xs text-amber-600 mb-1">{extra}</p>}
      <p className="text-[10px] text-gray-400 leading-relaxed">{explainer}</p>
    </div>
  );
}

// ─── Not Found Component ──────────────────────────────────────────────────

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
        setSubmitError('Something went wrong \u2014 email us directly at outreach@bankforge.ai');
      }
    } catch {
      setSubmitError('Something went wrong \u2014 email us directly at outreach@bankforge.ai');
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
      <h2 className="text-xl text-gray-900 mb-4" style={{ fontFamily: 'var(--font-display)' }}>
        Scan Preview
      </h2>
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
