'use client';

import { useState } from 'react';
import Link from 'next/link';
import { toAiReadinessScore } from '@/app/lib/score-utils';
import type { ScanPreviewResult } from '@/app/api/scan-preview/route';

/**
 * The free scan entry point, restored on the preview branch (TW1.F.2 Part B).
 *
 * It calls /api/scan-preview, which calls public.scan_preview_lookup with the anon
 * key. Nothing here holds a credential and nothing here reads a table.
 *
 * WHAT THIS COMPONENT REFUSES TO DO, and it is the reason it was rewritten rather
 * than ported: it never draws a number for something that was not measured. The
 * component it replaces did `const geoScore = geo?.score ?? 0`, so an institution
 * with no reading rendered a score of 0 — which reads as a measured floor
 * (TD-SITE-SCANDEMO-RENDERS-A-FABRICATED-ZERO-ON-A-FOUND-FALSE-BODY). Three states
 * are kept distinct here, because they are three different facts:
 *
 *   found:false                  we hold nothing for this domain
 *   found:true, score null       we hold the institution, not a reading
 *   found:true, score present    a reading, with the month it was taken in
 *
 * The peer and compliance blocks are absent for recent months
 * (TD-BANK-BASELINE-ENRICHMENT-ABSENT-ON-EVERY-LATEST-SCORED-MONTH), so their
 * absence is the common case and is labelled rather than hidden or zero-filled.
 */

type State =
  | { kind: 'idle' }
  | { kind: 'loading' }
  | { kind: 'result'; data: ScanPreviewResult }
  | { kind: 'error'; message: string };

const MESSAGES: Record<string, string> = {
  invalid_domain:
    'That does not look like a web address. Enter a domain, for example yourbank.com.',
  rate_limited:
    'The preview is busy right now. Wait a moment and try again, or request a walkthrough and we will run it with you.',
  not_configured:
    'The preview is not available in this environment. Request a walkthrough and we will run the review with you.',
  unavailable:
    'The preview could not be reached. Request a walkthrough and we will run the review with you.',
};

export default function ScanPreview() {
  const [domain, setDomain] = useState('');
  const [state, setState] = useState<State>({ kind: 'idle' });

  async function run(event: React.FormEvent) {
    event.preventDefault();
    const entered = domain.trim();
    if (entered.length === 0) return;

    setState({ kind: 'loading' });
    try {
      const res = await fetch(
        `/api/scan-preview?domain=${encodeURIComponent(entered)}`,
        { headers: { Accept: 'application/json' } },
      );
      const body = (await res.json()) as ScanPreviewResult;

      // A non-2xx is never rendered as a result. The old component set the result
      // regardless of status, which is how an error body became a score of 0.
      if (!res.ok) {
        setState({
          kind: 'error',
          message:
            MESSAGES[body?.reason ?? ''] ??
            'The preview could not be completed. Request a walkthrough and we will run the review with you.',
        });
        return;
      }
      setState({ kind: 'result', data: body });
    } catch {
      setState({ kind: 'error', message: MESSAGES.unavailable });
    }
  }

  return (
    <section className="bg-white px-6 py-14" id="scan">
      <div className="mx-auto max-w-3xl">
        <h2
          className="text-xl text-bf-navy-deep"
          style={{ fontFamily: 'var(--font-display)' }}
        >
          Look up an institution
        </h2>
        <p className="mt-3 text-base leading-relaxed text-gray-600">
          Enter a bank&apos;s web address to see what we hold for it: its AI readiness
          reading, the month that reading was taken in, and how it sits against
          institutions in its asset tier and state. If we hold nothing for a domain,
          this says so rather than showing a figure.
        </p>

        <form onSubmit={run} className="mt-6 flex flex-wrap gap-3">
          <label htmlFor="scan-domain" className="sr-only">
            Bank web address
          </label>
          <input
            id="scan-domain"
            type="text"
            inputMode="url"
            autoComplete="url"
            value={domain}
            onChange={(e) => setDomain(e.target.value)}
            placeholder="yourbank.com"
            className="min-w-0 flex-1 rounded border border-gray-300 px-3 py-2 text-base text-gray-900"
          />
          <button
            type="submit"
            disabled={state.kind === 'loading' || domain.trim().length === 0}
            className="rounded bg-bf-navy-deep px-5 py-2 text-base text-white disabled:opacity-50"
          >
            {state.kind === 'loading' ? 'Looking up…' : 'Look up'}
          </button>
        </form>

        {state.kind === 'error' && (
          <p className="mt-5 text-base text-gray-700" role="status">
            {state.message}{' '}
            <Link href="/#walkthrough" className="underline">
              Request a walkthrough
            </Link>
            .
          </p>
        )}

        {state.kind === 'result' && <Result data={state.data} />}
      </div>
    </section>
  );
}

function Result({ data }: { data: ScanPreviewResult }) {
  // STATE 1 — we hold nothing for this domain. Not an error, and not a zero.
  if (!data.found) {
    return (
      <div className="mt-6 rounded border border-gray-200 bg-bf-slate p-5" role="status">
        <p className="text-base text-gray-800">
          We do not cover this domain yet, so there is nothing to show for it. That is a
          gap in what we have measured, not a reading about the institution.
        </p>
        <p className="mt-3 text-sm text-gray-600">
          <Link href="/#walkthrough" className="underline">
            Request a walkthrough
          </Link>{' '}
          and we will add it and run the review with you.
        </p>
      </div>
    );
  }

  const entity = data.entity;
  const geo = data.geo;
  const readiness = toAiReadinessScore(geo?.score);
  const month = data.repdte;

  return (
    <div className="mt-6 rounded border border-gray-200 bg-bf-slate p-5">
      <h3 className="text-lg text-bf-navy-deep">{entity?.name ?? 'This institution'}</h3>
      <p className="mt-1 text-sm text-gray-500">
        {[entity?.asset_tier, entity?.location ?? entity?.domain]
          .filter(Boolean)
          .join(' · ')}
      </p>

      {/* STATE 2 vs 3 — a reading, or the institution without one. */}
      {readiness === null ? (
        <p className="mt-4 text-base text-gray-800">
          We hold this institution but no AI readiness reading for it. Nothing is shown
          in place of one.
        </p>
      ) : (
        <>
          <p className="mt-4 text-2xl text-bf-navy-deep">{readiness} / 100</p>
          <p className="mt-1 text-sm text-gray-600">
            AI readiness{month ? `, as measured in ${month}` : ''}.
          </p>
        </>
      )}

      {/* Peer context, only when it exists. */}
      {geo?.peer_count !== null && geo?.peer_count !== undefined ? (
        <p className="mt-4 text-sm text-gray-600">
          Compared with {geo.peer_count} institutions
          {geo.peer_state ? ` in ${geo.peer_state}` : ''}
          {geo.percentile !== null && geo.percentile !== undefined
            ? `, placing it at the ${geo.percentile} percentile of that group`
            : ''}
          .
        </p>
      ) : (
        <p className="mt-4 text-sm text-gray-500">
          The peer comparison is not part of this month&apos;s reading, so no percentile
          or peer average is shown.
        </p>
      )}

      {/* Compliance, only when the month carries a scan. null is not zero. */}
      {data.compliance === null ? (
        <p className="mt-4 text-sm text-gray-500">
          A compliance review is not part of this month&apos;s reading. This is not a
          finding of zero — it means that check was not run for this month.
        </p>
      ) : (
        <div className="mt-4">
          <p className="text-sm text-gray-700">
            {data.compliance.total === 0
              ? 'The compliance review for this month recorded no findings.'
              : `The compliance review for this month recorded ${data.compliance.total} findings: ${data.compliance.high} high, ${data.compliance.medium} medium, ${data.compliance.low} low.`}
          </p>
          {data.compliance.top_flags.length > 0 && (
            <ul className="mt-3 space-y-2">
              {data.compliance.top_flags.map((f, i) => (
                <li key={i} className="text-sm text-gray-700">
                  {f.category ? <span className="font-medium">{f.category}: </span> : null}
                  {f.summary}
                  {f.location ? (
                    <span className="block text-xs text-gray-400">{f.location}</span>
                  ) : null}
                </li>
              ))}
            </ul>
          )}
          {data.compliance.total > data.compliance.top_flags.length && (
            <p className="mt-2 text-xs text-gray-500">
              The full review covers the remaining findings.
            </p>
          )}
        </div>
      )}

      <p className="mt-5 text-sm text-gray-600">
        <Link href="/#walkthrough" className="underline">
          Request a walkthrough
        </Link>{' '}
        to go through this with us.
      </p>
    </div>
  );
}
