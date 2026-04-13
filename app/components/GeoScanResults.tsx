'use client';

/* eslint-disable @typescript-eslint/no-explicit-any */

import { toAiReadinessScore } from '@/app/lib/score-utils';

interface Props {
  result: any;
}

export default function GeoScanResults({ result }: Props) {
  const geo = result?.geo;
  const signals = result?.signals;
  const compliance = result?.compliance;
  const geoScore = geo?.score ?? 0;
  const geoColor = geoScore >= 60 ? '#16A34A' : geoScore >= 40 ? '#D97706' : '#DC2626';
  const geoGap = geo?.top_peer_score != null && geo?.score != null ? geo.top_peer_score - geo.score : null;
  const displayScore = toAiReadinessScore(geo?.score);
  const displayGap = geoGap != null ? toAiReadinessScore(geo?.top_peer_score) - toAiReadinessScore(geo?.score) : null;

  return (
    <div>
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-2 mb-6">
        <div>
          <h3 className="text-xl font-medium text-gray-900">{result.entity?.name}</h3>
          <p className="text-sm text-gray-500">
            {result.entity?.asset_tier && `${result.entity.asset_tier} \u00B7 `}
            {result.entity?.location ?? result.entity?.domain}
          </p>
        </div>
        <p className="text-xs text-gray-400">{result.repdte ? `${result.repdte} corpus scan` : ''}</p>
      </div>

      {/* Two-column: GEO + Compliance */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
        {/* AI SEO Score */}
        <div className="rounded-lg p-5" style={{ backgroundColor: '#F8FAFC', border: '1px solid #E2E8F0' }}>
          <p className="text-xs font-medium text-gray-500 uppercase tracking-wide mb-3">AI SEO Score</p>
          <div className="flex items-end gap-2 mb-2">
            <span className="text-5xl font-bold" style={{ color: geoColor, fontFamily: 'var(--font-display)' }}>
              {geo?.score != null ? displayScore : 'N/A'}
            </span>
            <span className="text-gray-400 text-xl mb-1">/ 100</span>
          </div>
          <div className="w-full h-2.5 bg-gray-200 rounded-full mb-3">
            <div className="h-2.5 rounded-full" style={{ width: `${Math.min(displayScore, 100)}%`, backgroundColor: geoColor }} />
          </div>
          <div className="space-y-1 text-sm text-gray-600">
            {geo?.peer_avg != null && <p>Peer avg: <strong className="text-gray-800">{toAiReadinessScore(geo.peer_avg)}</strong></p>}
            {geo?.percentile != null && geo?.peer_count != null && geo?.peer_state && (
              <p>Top <strong className="text-gray-800">{Math.max(1, Math.round(100 - geo.percentile))}%</strong> of {geo.peer_count} {geo.peer_state} peers</p>
            )}
          </div>
          {displayGap != null && displayGap > 15 && (
            <div className="mt-3 rounded p-2.5" style={{ backgroundColor: '#FEF3C7', border: '1px solid #F59E0B' }}>
              <p className="text-xs text-amber-800 leading-relaxed">
                <strong>{'\u26A0\uFE0F'} Top competitor{geo?.top_peer_name ? ` (${geo.top_peer_name})` : ''} scores {toAiReadinessScore(geo?.top_peer_score)}</strong> &mdash; a {displayGap}-point gap.
              </p>
            </div>
          )}
        </div>

        {/* Compliance Signals */}
        <div className="rounded-lg p-5" style={{ backgroundColor: '#F8FAFC', border: '1px solid #E2E8F0' }}>
          <p className="text-xs font-medium text-gray-500 uppercase tracking-wide mb-3">Compliance Signals</p>
          {compliance && compliance.total > 0 ? (
            <>
              <div className="flex gap-4 mb-4">
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
              {compliance.top_flags.length > 0 && (
                <div className="space-y-3">
                  <p className="text-xs text-gray-500">Top flags:</p>
                  {compliance.top_flags.map((f: any, i: number) => (
                    <div key={i} className="flex items-start gap-2">
                      <span className="text-[10px] font-medium uppercase tracking-wider px-1.5 py-0.5 rounded mt-0.5 shrink-0" style={{ backgroundColor: '#FEE2E2', color: '#991B1B' }}>
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
                <p className="text-xs text-gray-400 mt-3">Full report includes {compliance.total - 2} more findings</p>
              )}
            </>
          ) : (
            <p className="text-sm text-gray-500 italic">No compliance data available for preview.</p>
          )}
        </div>
      </div>

      {/* Technical Signals */}
      <div className="mb-6">
        <p className="text-xs font-medium text-gray-500 uppercase tracking-wide mb-3">Technical Signals</p>
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
          <SigCell
            label="GBP" status={signals?.gbp_claimed === true ? '\u2705' : signals?.gbp_claimed === false ? '\u26A0\uFE0F' : '\u2014'}
            value={signals?.gbp_claimed ? `${signals.gbp_rating ?? '\u2014'}\u2605 \u00B7 ${signals.gbp_reviews ?? 0} reviews` : 'Unclaimed'}
            good={signals?.gbp_claimed === true}
            tip="Primary AI data source for local search."
          />
          <SigCell
            label="DMARC" status={!signals?.dmarc_present ? '\u274C' : signals?.dmarc_policy === 'reject' ? '\u2705' : '\u26A0\uFE0F'}
            value={!signals?.dmarc_present ? 'Missing' : `Policy: ${signals.dmarc_policy ?? 'unknown'}`}
            good={!!signals?.dmarc_present && signals?.dmarc_policy === 'reject'}
            tip="Prevents email spoofing. Missing = FFIEC flag."
          />
          <SigCell
            label="DKIM" status={signals?.dkim_present ? '\u2705' : '\u26A0\uFE0F'}
            value={signals?.dkim_present ? 'Configured' : 'Not configured'}
            good={signals?.dkim_present === true}
            tip="Cryptographic email authentication."
          />
          <SigCell
            label="SPF" status={signals?.spf_present ? '\u2705' : '\u26A0\uFE0F'}
            value={signals?.spf_present ? 'Configured' : 'Missing'}
            good={signals?.spf_present === true}
            tip="Authorizes email sending servers."
          />
          <SigCell
            label="SSL / TLS" status={signals?.ssl_health === 'strong' ? '\u2705' : '\u26A0\uFE0F'}
            value={signals?.tls_version ?? signals?.ssl_health ?? 'Unknown'}
            good={signals?.ssl_health === 'strong' || signals?.ssl_health === 'adequate'}
            tip="Encrypts traffic. TLS 1.3 = gold standard."
            extra={signals?.cert_expiry_days != null && signals.cert_expiry_days < 90 ? `Cert: ${signals.cert_expiry_days}d` : undefined}
          />
          <SigCell
            label="Web Activity" status={signals?.web_velocity === 'active' ? '\u2705' : '\u26A0\uFE0F'}
            value={signals?.web_velocity ? `${signals.web_velocity.charAt(0).toUpperCase() + signals.web_velocity.slice(1)}` : 'No data'}
            good={signals?.web_velocity === 'active'}
            tip="Content freshness signal for AI engines."
          />
        </div>
      </div>

      {/* CTA */}
      <div className="text-center pt-4 border-t border-gray-100">
        <p className="text-sm text-gray-600 mb-3">Ready to fix this?</p>
        <button
          onClick={() => document.getElementById('what-we-deliver')?.scrollIntoView({ behavior: 'smooth' })}
          className="text-bf-navy font-medium text-sm hover:underline cursor-pointer"
        >
          See what we deliver &darr;
        </button>
      </div>
    </div>
  );
}

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
