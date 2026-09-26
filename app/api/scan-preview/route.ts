import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

/**
 * Domain scan preview — RESTORED, through a bounded public read.
 *
 * HISTORY. This route used to read `public.entity_registry` and
 * `public.bank_monthly_baseline` with the privileged server key that bypasses RLS,
 * and return the result to any unauthenticated caller who passed `?domain=`
 * (TD-MARKETING-SITE-API-USES-SERVICE-ROLE-KEY, 550d7616). Its only rate limit was
 * an in-process Map, per-instance and reset on every cold start. TW1.E.1 withdrew
 * it to HTTP 410 rather than leave it reading with that key.
 *
 * That key's exact env-var name is deliberately NOT spelled out in this file, so
 * grepping the routes for it returns a hit only where the key is actually used —
 * nowhere. A history note that trips the audit it describes makes the audit
 * useless.
 *
 * WHY THE OBVIOUS FIX WAS WRONG, WHICH IS WHY THIS ROUTE WAITED. The route only
 * ever SELECTed, so swapping to the anon key looked free. MEASURED 2026-09-26
 * against both tables with the publishable key, BEFORE migration 470:
 *
 *      GET /rest/v1/entity_registry?select=*&limit=1        -> HTTP 200  []
 *      GET /rest/v1/bank_monthly_baseline?select=*&limit=1  -> HTTP 200  []
 *
 * Both tables have RLS on and no policy admitting `anon`, so an anon read was
 * refused as an EMPTY RESULT AT HTTP 200 rather than as an error. A plain anon-key
 * swap would therefore have answered `{found:false}` for every bank on earth, at
 * 200, indistinguishable from "we hold nothing for you". A silent wrong is worse
 * than an outage, because nobody gets paged for it. After migration 470 revoked
 * anon's eight table privileges the same read returns:
 *
 *      -> HTTP 401  {"code":"42501","message":"permission denied for table ..."}
 *
 * WHAT IT READS NOW. `public.scan_preview_lookup(p_domain text) RETURNS jsonb`
 * (migrations 471 + 472, TW1.F.1): SECURITY DEFINER, search_path pinned to
 * pg_catalog/public/pg_temp, `REVOKE ALL FROM PUBLIC` then `GRANT EXECUTE` to
 * `anon` only. It owns domain normalisation, the projection — only the fields this
 * UI draws, never `select *` over a corpus table — and a durable rate limit of 30
 * calls per fixed minute against its own ledger, rather than an in-process Map.
 * Same shape as `public.submit_walkthrough_request`, which is how the sibling
 * demo-request route stopped needing the privileged key.
 *
 * This route holds NO privileged credential and performs NO table read. It passes
 * one string to one function and maps the result to a status code. A direct anon
 * read of either table is still refused by privilege, which is the control that
 * makes this safe rather than the code in this file.
 *
 * ABSENT IS NOT ZERO. `compliance` comes back as `null` when the month carries no
 * compliance scan, and `geo.score` can be `null`. Neither is rewritten to 0 here
 * or downstream — see app/lib/score-utils.ts, and
 * TD-SITE-SCANDEMO-RENDERS-A-FABRICATED-ZERO-ON-A-FOUND-FALSE-BODY. Recent months
 * carry a score and no peer context at all
 * (TD-BANK-BASELINE-ENRICHMENT-ABSENT-ON-EVERY-LATEST-SCORED-MONTH), so the null
 * path is the common path, not the edge case.
 */

/** Shape returned by the RPC. Nulls are meaningful and are never coerced. */
export type ScanPreviewResult = {
  found: boolean;
  reason?: string;
  entity?: {
    name: string | null;
    domain: string | null;
    asset_tier: string | null;
    location: string | null;
  };
  geo?: {
    score: number | null;
    peer_avg: number | null;
    percentile: number | null;
    peer_count: number | null;
    peer_state: string | null;
    top_peer_score: number | null;
    top_peer_name: string | null;
  };
  signals?: Record<string, string | number | boolean | null>;
  compliance:
    | {
        total: number;
        high: number;
        medium: number;
        low: number;
        top_flags: { category: string | null; location: string | null; summary: string }[];
      }
    | null;
  repdte?: string | null;
};

/** Reasons that are the caller's fault, and are safe to report as 400. */
const INVALID_REASONS = new Set(['invalid_domain']);

function readDomain(raw: unknown): string {
  return typeof raw === 'string' ? raw.trim() : '';
}

async function lookup(domain: string) {
  if (domain.length === 0) {
    return NextResponse.json(
      { found: false, reason: 'invalid_domain' },
      { status: 400 },
    );
  }

  const url = process.env.NEXT_PUBLIC_SUPABASE_URL ?? '';
  const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ?? '';

  if (!url || !anonKey) {
    // Say which name is missing, never its value.
    console.warn(
      '[scan-preview] WARNING: NEXT_PUBLIC_SUPABASE_URL and/or ' +
        'NEXT_PUBLIC_SUPABASE_ANON_KEY are not set in this environment.',
    );
    return NextResponse.json(
      { found: false, reason: 'not_configured' },
      { status: 503 },
    );
  }

  const supabase = createClient(url, anonKey, {
    auth: { persistSession: false, autoRefreshToken: false },
  });

  const { data, error } = await supabase.rpc('scan_preview_lookup', {
    p_domain: domain,
  });

  if (error) {
    console.warn(`[scan-preview] WARNING: RPC failed. ${error.message}`);
    return NextResponse.json(
      { found: false, reason: 'unavailable' },
      { status: 502 },
    );
  }

  const result = (data ?? null) as ScanPreviewResult | null;

  // A null body is not a miss. The RPC always returns an object, so null means
  // the contract moved or the row could not be read — which is a 502, not a
  // found:false the UI would draw as "we do not cover this domain".
  if (result === null || typeof result.found !== 'boolean') {
    console.warn('[scan-preview] WARNING: RPC returned no usable body.');
    return NextResponse.json(
      { found: false, reason: 'unavailable' },
      { status: 502 },
    );
  }

  if (result.found === true) {
    return NextResponse.json(result, { status: 200 });
  }

  const reason = result.reason;

  // A plain miss. 200 is correct: the question was answered, and the answer is
  // that we hold nothing for this domain.
  if (reason === undefined) {
    return NextResponse.json(result, { status: 200 });
  }

  if (reason === 'rate_limited') {
    return NextResponse.json(result, { status: 429 });
  }

  if (INVALID_REASONS.has(reason)) {
    return NextResponse.json(result, { status: 400 });
  }

  // An unrecognised reason is a contract change, not a client error. Do not
  // guess a status that flatters it.
  console.warn(`[scan-preview] WARNING: unrecognised RPC reason "${reason}".`);
  return NextResponse.json(result, { status: 502 });
}

export async function GET(request: Request) {
  const domain = readDomain(new URL(request.url).searchParams.get('domain'));
  return lookup(domain);
}

export async function POST(request: Request) {
  let body: Record<string, unknown> = {};
  try {
    body = (await request.json()) as Record<string, unknown>;
  } catch {
    return NextResponse.json(
      { found: false, reason: 'invalid_domain' },
      { status: 400 },
    );
  }
  return lookup(readDomain(body.domain));
}
