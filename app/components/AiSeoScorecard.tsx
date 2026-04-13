'use client';

import { useState } from 'react';
import { toAiReadinessScore } from '@/app/lib/score-utils';

/* ─── Types ─────────────────────────────────────────────────────────── */

interface AiSeoScorecardProps {
  entityName: string;
  geoScore: number;
  peerMedianScore: number | null;
  signals: {
    https: boolean | null;
    pageTitle: boolean | null;
    metaDescription: boolean | null;
    h1Tag: boolean | null;
    schemaMarkup: boolean | null;
    brandVisibility: boolean | null;
    gbpListed: boolean | null;
  };
  complianceCount: {
    high: number;
    medium: number;
    low: number;
  };
}

/* ─── Score ring colors ─────────────────────────────────────────────── */

function getScoreColor(score: number): string {
  if (score >= 60) return '#10b981';
  if (score >= 40) return '#2563eb';
  return '#f59e0b';
}

function getTierLabel(score: number): { label: string; color: string } {
  if (score >= 60) return { label: 'Strong', color: '#10b981' };
  if (score >= 40) return { label: 'Moderate', color: '#2563eb' };
  if (score >= 25) return { label: 'Developing', color: '#f59e0b' };
  return { label: 'Needs Work', color: '#ef4444' };
}

/* ─── Tooltip ───────────────────────────────────────────────────────── */

function Tooltip({ text }: { text: string }) {
  const [show, setShow] = useState(false);
  return (
    <span
      className="relative inline-flex cursor-help ml-1"
      onMouseEnter={() => setShow(true)}
      onMouseLeave={() => setShow(false)}
    >
      <svg width="14" height="14" viewBox="0 0 16 16" fill="none" className="text-white/30 hover:text-white/60 transition-colors">
        <circle cx="8" cy="8" r="7" stroke="currentColor" strokeWidth="1.5" />
        <text x="8" y="11.5" textAnchor="middle" fill="currentColor" fontSize="9" fontWeight="600">?</text>
      </svg>
      {show && (
        <span className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 z-50 bg-slate-800 text-white text-xs rounded-lg p-2 max-w-[200px] shadow-lg whitespace-normal leading-relaxed pointer-events-none">
          {text}
        </span>
      )}
    </span>
  );
}

/* ─── Score Ring (SVG) ──────────────────────────────────────────────── */

function ScoreRing({ score }: { score: number }) {
  const radius = 54;
  const circumference = 2 * Math.PI * radius;
  const pct = Math.min(score / 65, 1);
  const dashOffset = circumference * (1 - pct);
  const color = getScoreColor(score);
  const tier = getTierLabel(score);
  const displayScore = toAiReadinessScore(score);

  return (
    <div className="flex flex-col items-center">
      <svg width="140" height="140" viewBox="0 0 128 128">
        {/* Track */}
        <circle cx="64" cy="64" r={radius} fill="none" stroke="rgba(255,255,255,0.08)" strokeWidth="8" />
        {/* Progress */}
        <circle
          cx="64" cy="64" r={radius}
          fill="none"
          stroke={color}
          strokeWidth="8"
          strokeLinecap="round"
          strokeDasharray={circumference}
          strokeDashoffset={dashOffset}
          transform="rotate(-90 64 64)"
          style={{ transition: 'stroke-dashoffset 0.6s ease-out' }}
        />
        {/* Score number */}
        <text x="64" y="60" textAnchor="middle" fill="white" fontSize="32" fontWeight="300" style={{ fontFamily: 'var(--font-display)' }}>
          {displayScore}
        </text>
        <text x="64" y="78" textAnchor="middle" fill="rgba(255,255,255,0.4)" fontSize="11">
          / 100
        </text>
      </svg>
      <span className="text-sm font-medium mt-1" style={{ color: tier.color }}>
        {tier.label}
      </span>
    </div>
  );
}

/* ─── Signal definitions ────────────────────────────────────────────── */

const SIGNAL_DEFS: Array<{
  key: keyof AiSeoScorecardProps['signals'];
  label: string;
  tooltip: string;
}> = [
  { key: 'https', label: 'HTTPS', tooltip: 'Secure connection required. AI engines deprioritize HTTP sites.' },
  { key: 'pageTitle', label: 'Page Title', tooltip: 'Descriptive title tag helps AI engines categorize your institution.' },
  { key: 'metaDescription', label: 'Meta Description', tooltip: 'Summary snippet AI engines use to describe your page in results.' },
  { key: 'h1Tag', label: 'H1 Tag', tooltip: 'Primary heading signals your page topic to AI crawlers.' },
  { key: 'brandVisibility', label: 'Brand Visibility', tooltip: 'Whether your institution appears in the top 10 organic search results.' },
  { key: 'schemaMarkup', label: 'Schema Markup', tooltip: 'Structured data that tells AI exactly what products you offer.' },
  { key: 'gbpListed', label: 'GBP Listed', tooltip: 'Google Business Profile \u2014 the primary source for local AI search answers.' },
];

const COMPLIANCE_TOOLTIPS: Record<string, string> = {
  high: "Likely on an examiner\u2019s checklist. Compliance counsel review recommended.",
  medium: 'On an examiner\u2019s radar. Review before your next exam cycle.',
  low: 'Best-practice gap. Lower priority but worth addressing.',
};

/* ─── Main component ────────────────────────────────────────────────── */

export default function AiSeoScorecard({
  entityName,
  geoScore,
  peerMedianScore,
  signals,
  complianceCount,
}: AiSeoScorecardProps) {
  const passCount = Object.values(signals).filter((v) => v === true).length;
  const totalSignals = Object.values(signals).filter((v) => v !== null).length;

  return (
    <div className="animate-fadeIn rounded-xl overflow-hidden" style={{ border: '1px solid rgba(255,255,255,0.10)', backgroundColor: 'rgba(15,35,65,0.6)' }}>
      {/* Header */}
      <div className="px-6 pt-5 pb-3" style={{ borderBottom: '1px solid rgba(255,255,255,0.06)' }}>
        <p className="text-xs uppercase tracking-widest" style={{ color: 'rgba(255,255,255,0.35)' }}>AI SEO Scorecard</p>
        <h3 className="text-lg text-white mt-1" style={{ fontFamily: 'var(--font-display)' }}>{entityName}</h3>
      </div>

      {/* Two-column body */}
      <div className="grid grid-cols-1 md:grid-cols-2">
        {/* ─── LEFT: Score + Hygiene ────────────────────────────── */}
        <div className="px-6 py-6" style={{ borderRight: '1px solid rgba(255,255,255,0.06)' }}>
          <p className="text-xs uppercase tracking-widest mb-4" style={{ color: 'rgba(255,255,255,0.35)' }}>AI SEO Score</p>

          <div className="flex justify-center mb-4">
            <ScoreRing score={geoScore} />
          </div>

          {peerMedianScore != null && (
            <p className="text-center text-xs mb-5" style={{ color: 'rgba(255,255,255,0.45)' }}>
              FDIC-Insured Bank avg: <span className="text-white/70 font-medium">{toAiReadinessScore(peerMedianScore)}</span>
            </p>
          )}

          <div style={{ borderTop: '1px solid rgba(255,255,255,0.06)', paddingTop: '16px' }}>
            <div className="flex items-center justify-between">
              <p className="text-xs uppercase tracking-widest" style={{ color: 'rgba(255,255,255,0.35)' }}>SEO Hygiene</p>
              <span className="text-sm font-medium" style={{ color: '#7EB3E8' }}>
                {passCount} / {totalSignals} signals
              </span>
            </div>
          </div>
        </div>

        {/* ─── RIGHT: Signals + Compliance ──────────────────────── */}
        <div className="px-6 py-6">
          <p className="text-xs uppercase tracking-widest mb-4" style={{ color: 'rgba(255,255,255,0.35)' }}>SEO Signals</p>

          <div className="space-y-2.5 mb-6">
            {SIGNAL_DEFS.map((def) => {
              const val = signals[def.key];
              const pass = val === true;
              const unknown = val === null;
              return (
                <div key={def.key} className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    {unknown ? (
                      <span className="text-white/20 text-sm">&mdash;</span>
                    ) : pass ? (
                      <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                        <path d="M3.5 8.5L6.5 11.5L12.5 4.5" stroke="#10b981" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                      </svg>
                    ) : (
                      <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                        <path d="M4 4l8 8M12 4l-8 8" stroke="#ef4444" strokeWidth="2" strokeLinecap="round" />
                      </svg>
                    )}
                    <span className="text-sm" style={{ color: unknown ? 'rgba(255,255,255,0.3)' : 'rgba(255,255,255,0.75)' }}>
                      {def.label}
                    </span>
                  </div>
                  <Tooltip text={def.tooltip} />
                </div>
              );
            })}
          </div>

          {/* Compliance signals */}
          <div style={{ borderTop: '1px solid rgba(255,255,255,0.06)', paddingTop: '16px' }}>
            <p className="text-xs uppercase tracking-widest mb-3" style={{ color: 'rgba(255,255,255,0.35)' }}>Compliance Signals</p>

            <div className="flex gap-2">
              {complianceCount.high > 0 && (
                <span className="inline-flex items-center gap-1 text-xs font-medium px-2.5 py-1 rounded-md" style={{ backgroundColor: 'rgba(127,29,29,0.4)', color: '#fca5a5', border: '1px solid rgba(153,27,27,0.4)' }}>
                  High {complianceCount.high}
                  <Tooltip text={COMPLIANCE_TOOLTIPS.high} />
                </span>
              )}
              {complianceCount.medium > 0 && (
                <span className="inline-flex items-center gap-1 text-xs font-medium px-2.5 py-1 rounded-md" style={{ backgroundColor: 'rgba(120,53,15,0.4)', color: '#fcd34d', border: '1px solid rgba(146,64,14,0.4)' }}>
                  Medium {complianceCount.medium}
                  <Tooltip text={COMPLIANCE_TOOLTIPS.medium} />
                </span>
              )}
              {complianceCount.low > 0 && (
                <span className="inline-flex items-center gap-1 text-xs font-medium px-2.5 py-1 rounded-md" style={{ backgroundColor: 'rgba(30,58,138,0.4)', color: '#93c5fd', border: '1px solid rgba(30,64,175,0.4)' }}>
                  Low {complianceCount.low}
                  <Tooltip text={COMPLIANCE_TOOLTIPS.low} />
                </span>
              )}
              {complianceCount.high === 0 && complianceCount.medium === 0 && complianceCount.low === 0 && (
                <p className="text-xs italic" style={{ color: 'rgba(255,255,255,0.3)' }}>No compliance data available for preview.</p>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Footer */}
      <div className="px-6 py-3 text-center" style={{ borderTop: '1px solid rgba(255,255,255,0.06)', backgroundColor: 'rgba(255,255,255,0.02)' }}>
        <p className="text-[10px] leading-relaxed" style={{ color: 'rgba(255,255,255,0.25)' }}>
          Source: BankForge March 2026 corpus &middot; Updated monthly &middot; PageSpeed and performance scores available after April 2026 sweep
        </p>
      </div>
    </div>
  );
}
