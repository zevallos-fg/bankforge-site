'use client';

import { useState } from 'react';

/* eslint-disable @typescript-eslint/no-explicit-any */

/* ─── Tooltip ───────────────────────────────────────────────────────── */

function Tip({ text }: { text: string }) {
  const [show, setShow] = useState(false);
  return (
    <span
      className="relative inline-flex cursor-help ml-1"
      onMouseEnter={() => setShow(true)}
      onMouseLeave={() => setShow(false)}
    >
      <svg width="13" height="13" viewBox="0 0 16 16" fill="none" className="text-gray-400 hover:text-gray-600 transition-colors">
        <circle cx="8" cy="8" r="7" stroke="currentColor" strokeWidth="1.5" />
        <text x="8" y="11.5" textAnchor="middle" fill="currentColor" fontSize="9" fontWeight="600">?</text>
      </svg>
      {show && (
        <span className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 z-50 bg-slate-800 text-white text-xs rounded-lg p-2 max-w-[220px] shadow-lg whitespace-normal leading-relaxed pointer-events-none">
          {text}
        </span>
      )}
    </span>
  );
}

/* ─── Regulation tag pill colors ────────────────────────────────────── */

const REG_COLORS: Record<string, string> = {
  'REG DD': 'bg-blue-100 text-blue-800',
  'UDAAP': 'bg-red-100 text-red-800',
  'ECOA': 'bg-purple-100 text-purple-800',
  'REG P': 'bg-slate-100 text-slate-700',
  'FFIEC': 'bg-green-100 text-green-800',
  'FFIEC IT': 'bg-green-100 text-green-800',
  'SAFE ACT': 'bg-indigo-100 text-indigo-800',
  'ADA': 'bg-amber-100 text-amber-800',
  'CRA': 'bg-teal-100 text-teal-800',
  'FDIC': 'bg-sky-100 text-sky-800',
};

function getRegPillClass(regTag: string): string {
  return REG_COLORS[regTag] ?? 'bg-slate-100 text-slate-600';
}

/* ─── Signal cell ───────────────────────────────────────────────────── */

function SigCell({ label, status, value, good, tip, extra }: {
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

/* ─── Severity badge colors ─────────────────────────────────────────── */

const SEV_STYLE: Record<string, { bg: string; color: string }> = {
  HIGH: { bg: '#FEE2E2', color: '#991B1B' },
  MEDIUM: { bg: '#FEF3C7', color: '#92400E' },
  LOW: { bg: '#E0E7FF', color: '#3730A3' },
};

/* ─── Main component ────────────────────────────────────────────────── */

interface Props {
  result: any;
}

export default function ComplianceScanResult({ result }: Props) {
  const entity = result.entity;
  const compliance = result.compliance;
  const signals = result.signals;
  const enforcement = result.enforcement;
  const examCycle = result.examCycleSignal;
  const riskTier = result.riskTier;
  const enriched = compliance?.enrichedFindings ?? [];
  const topFindings = enriched.slice(0, 3);
  const remaining = Math.max(0, enriched.length - 3);
  const gbp = signals;

  return (
    <div className="animate-fadeIn">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-2 mb-6">
        <div>
          <h3 className="text-xl font-medium text-gray-900" style={{ fontFamily: 'var(--font-display)' }}>{entity?.name}</h3>
          <p className="text-sm text-gray-500">
            {entity?.asset_tier && `${entity.asset_tier} \u00B7 `}
            {entity?.location ?? entity?.domain}
          </p>
        </div>
        <div className="flex items-center gap-2">
          {riskTier === 'elevated' && (
            <span className="text-[10px] font-medium px-2.5 py-1 rounded" style={{ backgroundColor: '#FEE2E2', color: '#991B1B' }}>
              Elevated Risk Tier
              <Tip text="Derived from FFIEC Call Report ratios: NPL, CRE concentration, Tier 1 capital." />
            </span>
          )}
          {riskTier === 'watch' && (
            <span className="text-[10px] font-medium px-2.5 py-1 rounded" style={{ backgroundColor: '#FEF3C7', color: '#92400E' }}>
              Watch
              <Tip text="Derived from FFIEC Call Report ratios: NPL, CRE concentration, Tier 1 capital." />
            </span>
          )}
          <p className="text-xs text-gray-400">{result.repdte ? `${result.repdte} corpus scan` : ''}</p>
        </div>
      </div>

      {/* Two-column: Compliance + Top Flags */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
        {/* LEFT — Compliance Signals */}
        <div className="rounded-lg p-5" style={{ backgroundColor: '#F8FAFC', border: '1px solid #E2E8F0' }}>
          <p className="text-xs font-medium text-gray-500 uppercase tracking-wide mb-3">Compliance Signals</p>

          {compliance && compliance.total > 0 ? (
            <>
              <div className="flex gap-4 mb-4">
                {compliance.high > 0 && (
                  <span className="text-sm"><span className="inline-block w-2.5 h-2.5 rounded-full mr-1.5" style={{ backgroundColor: '#DC2626' }} />{compliance.high} High
                    <Tip text="Likely on an examiner\u2019s checklist. Compliance counsel review recommended." />
                  </span>
                )}
                {compliance.medium > 0 && (
                  <span className="text-sm"><span className="inline-block w-2.5 h-2.5 rounded-full mr-1.5" style={{ backgroundColor: '#D97706' }} />{compliance.medium} Medium
                    <Tip text="On an examiner\u2019s radar. Review before your next exam cycle." />
                  </span>
                )}
                {compliance.low > 0 && (
                  <span className="text-sm"><span className="inline-block w-2.5 h-2.5 rounded-full mr-1.5" style={{ backgroundColor: '#9CA3AF' }} />{compliance.low} Low
                    <Tip text="Best-practice gap. Lower priority but worth addressing." />
                  </span>
                )}
              </div>

              {/* Peer context */}
              <div className="space-y-1 text-sm text-gray-600 mb-4">
                {compliance.peerAvgFindingCount != null && (
                  <p>Peer avg: <strong className="text-gray-800">{compliance.peerAvgFindingCount}</strong> findings</p>
                )}
                {compliance.peerPercentile != null && (
                  <p>Top <strong className="text-gray-800">{Math.max(1, Math.round(100 - compliance.peerPercentile))}%</strong> of peers</p>
                )}
              </div>
            </>
          ) : (
            <p className="text-sm text-gray-500 italic mb-4">No compliance data available for preview.</p>
          )}

          {/* Exam cycle badge */}
          {examCycle?.tier && (
            <div className="mb-3">
              <span className="text-[10px] font-medium px-2.5 py-1 rounded" style={{
                backgroundColor: examCycle.tier === 'imminent' ? '#FEE2E2' : examCycle.tier === 'near' ? '#FEF3C7' : examCycle.tier === 'approaching' ? '#DBEAFE' : '#F1F5F9',
                color: examCycle.tier === 'imminent' ? '#991B1B' : examCycle.tier === 'near' ? '#92400E' : examCycle.tier === 'approaching' ? '#1E40AF' : '#475569',
              }}>
                Exam window: {examCycle.tier === 'imminent' ? '<60 days' : examCycle.tier === 'near' ? '60\u2013120 days' : examCycle.tier === 'approaching' ? '120\u2013270 days' : '>270 days'}
                <Tip text="Estimated based on CRA examination cycle. BankForge flags for counsel — never concludes a schedule." />
              </span>
            </div>
          )}

          {/* Enforcement badge */}
          <div>
            {enforcement?.hasActive ? (
              <span className="text-[10px] font-medium px-2.5 py-1 rounded" style={{ backgroundColor: '#FEE2E2', color: '#991B1B' }}>
                {enforcement.count} active enforcement order{enforcement.count !== 1 ? 's' : ''} on record
                <Tip text="Source: FDIC EDOOrders.csv — 10,548 enforcement actions 1975–2026." />
              </span>
            ) : (
              <span className="text-[10px] font-medium px-2.5 py-1 rounded" style={{ backgroundColor: '#DCFCE7', color: '#166534' }}>
                Clean — no enforcement history
                <Tip text="Source: FDIC EDOOrders.csv — 10,548 enforcement actions 1975–2026." />
              </span>
            )}
          </div>
        </div>

        {/* RIGHT — Top Flags */}
        <div className="rounded-lg p-5" style={{ backgroundColor: '#F8FAFC', border: '1px solid #E2E8F0' }}>
          <p className="text-xs font-medium text-gray-500 uppercase tracking-wide mb-3">Top Flags</p>

          {topFindings.length > 0 ? (
            <div className="space-y-4">
              {topFindings.map((f: any, i: number) => {
                const sev = SEV_STYLE[f.severity] ?? SEV_STYLE.MEDIUM;
                return (
                  <div key={i}>
                    <div className="flex items-start gap-2 mb-1">
                      {f.regTag && (
                        <span className={`text-[9px] font-semibold uppercase tracking-wider px-1.5 py-0.5 rounded shrink-0 mt-0.5 ${getRegPillClass(f.regTag)}`}>
                          {f.regTag}
                        </span>
                      )}
                      <span className="text-[10px] font-medium uppercase tracking-wider px-1.5 py-0.5 rounded shrink-0 mt-0.5" style={{ backgroundColor: sev.bg, color: sev.color }}>
                        {f.severity}
                      </span>
                    </div>
                    <p className="text-sm text-gray-700 leading-relaxed">{f.finding}</p>
                    <p className="text-xs text-gray-400 mt-0.5">{f.regulatoryCitation}{f.location ? ` \u00B7 ${f.location}` : ''}</p>
                    {i < 2 && f.examinerLanguage && (
                      <p className="text-xs text-gray-400 italic leading-relaxed mt-1">{f.examinerLanguage}</p>
                    )}
                  </div>
                );
              })}
              {remaining > 0 && (
                <p className="text-xs text-gray-400">Full report includes {remaining} more finding{remaining !== 1 ? 's' : ''} with complete regulatory citations and peer benchmarks.</p>
              )}
            </div>
          ) : (
            <p className="text-sm text-gray-500 italic">No findings data available for preview.</p>
          )}
        </div>
      </div>

      {/* Technical Signals — 3×2 grid */}
      <div className="mb-6">
        <p className="text-xs font-medium text-gray-500 uppercase tracking-wide mb-3">Technical Signals</p>
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
          <SigCell
            label="GBP" status={gbp?.gbp_claimed === true ? '\u2705' : gbp?.gbp_claimed === false ? '\u26A0\uFE0F' : '\u2014'}
            value={gbp?.gbp_claimed ? `${gbp.gbp_rating ?? '\u2014'}\u2605 \u00B7 ${gbp.gbp_reviews ?? 0} reviews` : 'Unclaimed'}
            good={gbp?.gbp_claimed === true}
            tip="Primary AI data source for local search."
          />
          <SigCell
            label="DMARC" status={!gbp?.dmarc_present ? '\u274C' : gbp?.dmarc_policy === 'reject' ? '\u2705' : '\u26A0\uFE0F'}
            value={!gbp?.dmarc_present ? 'Missing' : `Policy: ${gbp.dmarc_policy ?? 'unknown'}`}
            good={!!gbp?.dmarc_present && gbp?.dmarc_policy === 'reject'}
            tip="Prevents email spoofing. Missing = FFIEC flag."
          />
          <SigCell
            label="DKIM" status={gbp?.dkim_present ? '\u2705' : '\u26A0\uFE0F'}
            value={gbp?.dkim_present ? 'Configured' : 'Not configured'}
            good={gbp?.dkim_present === true}
            tip="Cryptographic email authentication."
          />
          <SigCell
            label="SPF" status={gbp?.spf_present ? '\u2705' : '\u26A0\uFE0F'}
            value={gbp?.spf_present ? 'Configured' : 'Missing'}
            good={gbp?.spf_present === true}
            tip="Authorizes email sending servers."
          />
          <SigCell
            label="SSL / TLS" status={gbp?.ssl_health === 'strong' ? '\u2705' : '\u26A0\uFE0F'}
            value={gbp?.tls_version ?? gbp?.ssl_health ?? 'Unknown'}
            good={gbp?.ssl_health === 'strong' || gbp?.ssl_health === 'adequate'}
            tip="Encrypts traffic. TLS 1.3 = gold standard."
            extra={gbp?.cert_expiry_days != null && gbp.cert_expiry_days < 90 ? `Cert: ${gbp.cert_expiry_days}d` : undefined}
          />
          <SigCell
            label="Web Activity" status={gbp?.web_velocity === 'active' ? '\u2705' : '\u26A0\uFE0F'}
            value={gbp?.web_velocity ? `${gbp.web_velocity.charAt(0).toUpperCase() + gbp.web_velocity.slice(1)}` : 'No data'}
            good={gbp?.web_velocity === 'active'}
            tip="Content freshness signal for AI engines."
          />
        </div>
      </div>

      {/* CTA */}
      <div className="text-center pt-4 border-t border-gray-100">
        <p className="text-sm text-gray-600 mb-3">Ready to fix this?</p>
        <button
          onClick={() => document.getElementById('pricing-section')?.scrollIntoView({ behavior: 'smooth' })}
          className="text-bf-navy font-medium text-sm hover:underline cursor-pointer"
        >
          See what we deliver &darr;
        </button>
      </div>
    </div>
  );
}
