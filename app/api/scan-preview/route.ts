import { NextResponse } from 'next/server';

/**
 * Domain scan preview — WITHDRAWN (410 Gone).
 *
 * HISTORY (why this route is a stub):
 *  - It read `public.entity_registry` and `public.bank_monthly_baseline` with the
 *    privileged server key that bypasses RLS, and returned the result to any
 *    unauthenticated caller who passed `?domain=`
 *    (TD-MARKETING-SITE-API-USES-SERVICE-ROLE-KEY, 550d7616). Its only rate limit
 *    was an in-process Map, which is per-instance and resets on every cold start.
 *
 *    That key's exact env-var name is deliberately NOT spelled out in this file,
 *    so grepping the public routes for it returns a hit only where the key is
 *    actually still used — nowhere, as of this commit. A history note that trips
 *    the audit it is describing makes the audit useless.
 *
 * WHY 410 AND NOT AN ANON-KEY SWAP. The route only ever SELECTed — it never wrote
 * — so swapping to the anon key looks like a free fix. It is not. MEASURED
 * 2026-09-26 against both tables with the publishable key:
 *
 *      GET /rest/v1/entity_registry?select=*&limit=1        -> HTTP 200  []
 *      GET /rest/v1/bank_monthly_baseline?select=*&limit=1  -> HTTP 200  []
 *
 * Both tables have RLS enabled and NO policy admitting `anon` (the policies are
 * for `service_role`, `probe_executor` and `cc_governance`). An anon read is
 * therefore refused as an EMPTY RESULT AT HTTP 200, not as an error. Under the
 * anon key this route would have answered `{found:false}` for every bank on
 * earth, at 200, indistinguishable from "we have no data for you" — a silent
 * wrong is worse than an outage, because nobody gets paged for it.
 *
 * WHAT IT WOULD TAKE. A read path that is safe to expose needs DDL this leg was
 * not allowed to author:
 *
 *      public.scan_preview_for_domain(p_domain text) RETURNS jsonb
 *      SECURITY DEFINER, search_path pinned to pg_catalog, public, pg_temp,
 *      EXECUTE granted to anon
 *
 * It must own (a) domain normalisation, (b) the projection — returning only the
 * fields the marketing preview shows, never `select *` over a corpus table, and
 * (c) a durable rate limit, since an in-process Map is not one. That is the same
 * shape as `public.submit_walkthrough_request`, which is how the sibling
 * demo-request route stopped needing the privileged key.
 * Filed as TD-SITE-SCAN-PREVIEW-NEEDS-ANON-CALLABLE-READ-RPC.
 *
 * CALLERS: none. Verified by grep over `app/`, `lib/` and `components/` before
 * withdrawal — no page, component or client fetch referenced this path, so there
 * were no entry points left to hide. It was reachable only by typing the URL.
 */

/** Verbatim so a caller sees why, not just that. */
const WITHDRAWN = {
  error: 'gone',
  message:
    'The instant domain preview has been withdrawn. Request a walkthrough and we will run the review with you.',
} as const;

export async function GET() {
  return NextResponse.json(WITHDRAWN, { status: 410 });
}

export async function POST() {
  return NextResponse.json(WITHDRAWN, { status: 410 });
}
