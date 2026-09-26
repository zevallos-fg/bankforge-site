import { NextResponse } from 'next/server';

/**
 * Domain scan preview — WITHDRAWN (410 Gone).
 *
 * HISTORY (why this route is a stub):
 *  - It read `public.entity_registry` and `public.bank_monthly_baseline` with the
 *    privileged server key that bypasses RLS, and returned the result to any
 *    unauthenticated caller who passed `?domain=`
 *    (TD-MARKETING-SITE-API-USES-SERVICE-ROLE-KEY, 550d7616).
 *
 *    Its only rate limit was an in-process `Map`, which is per-instance and resets
 *    on every cold start — and it could be switched off entirely by an environment
 *    variable (`DISABLE_SCAN_RATE_LIMIT`), so the limit was configuration, not a
 *    control. It also paginated `bank_monthly_baseline` in 1,000-row pages up to
 *    20,000 rows per request, under that same privileged key.
 *
 *    That key's exact env-var name is deliberately NOT spelled out in this file,
 *    so grepping the public routes for it returns a hit only where the key is
 *    actually still used — nowhere, as of this commit. A history note that trips
 *    the audit it is describing makes the audit useless.
 *
 * WHY 410 AND NOT AN ANON-KEY SWAP. The route only ever SELECTed — it never wrote
 * — so swapping to the publishable (anon) key looks like a free fix. It is not.
 * MEASURED 2026-09-26 against the live project with the publishable key:
 *
 *      GET /rest/v1/v_sku_catalog_public?select=*     -> HTTP 200  21 rows
 *      GET /rest/v1/entity_registry?select=...&limit=1 -> HTTP 200  []
 *
 * Both corpus tables have RLS enabled and NO policy admitting `anon`. An anon read
 * is therefore refused as an EMPTY RESULT AT HTTP 200, not as an error. Under the
 * anon key this route would have answered `{found:false}` for every bank on earth,
 * at 200, indistinguishable from "we have no data for you" — a silent wrong is
 * worse than an outage, because nobody gets paged for it. The 21-row control on
 * the same key in the same request pair is what proves the key itself works, so
 * the empty result is a policy decision and not a broken credential.
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
 * CALLERS ON THIS BRANCH — and this is where production differed from the preview
 * rebuild, which had none. Three call sites referenced this path:
 *
 *      app/compliance-review/ComplianceReviewClient.tsx:122
 *      app/components/GeoScanInput.tsx:22
 *      app/components/ScanDemo.tsx:88
 *
 * The first two read `data.found`, which is absent from the 410 body, so each
 * falls to its existing `not_found` branch and renders no scan result. The third
 * called `setResult(data)` unconditionally and then derived `geoScore = geo?.score
 * ?? 0`, so a 410 would have drawn a score-0 result card — a fabricated number,
 * the exact silent-wrong class described above. It is guarded in the same commit.
 * `ScanDemo` is not mounted by any page on this branch, so that path was not
 * reachable in production; it is guarded anyway because it is a live call site.
 *
 * BODY SHAPE. `{ok:false, reason:'withdrawn'}` is the contract this leg was given.
 * It differs from the preview rebuild's `{error:'gone', message}`; the human
 * `message` is carried across because production, unlike the rebuild, has callers
 * that surface text to a person.
 */

/** Verbatim so a caller sees why, not just that. */
const WITHDRAWN = {
  ok: false,
  reason: 'withdrawn',
  message:
    'The instant domain preview has been withdrawn. Request a walkthrough and we will run the review with you.',
} as const;

function gone() {
  return NextResponse.json(WITHDRAWN, { status: 410 });
}

// Every method, so there is no verb left that reaches a database client.
export async function GET() {
  return gone();
}
export async function POST() {
  return gone();
}
export async function PUT() {
  return gone();
}
export async function PATCH() {
  return gone();
}
export async function DELETE() {
  return gone();
}
export async function HEAD() {
  return gone();
}
export async function OPTIONS() {
  return gone();
}
