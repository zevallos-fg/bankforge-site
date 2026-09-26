import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

/**
 * Walkthrough request intake.
 *
 * HISTORY (why this route looks like this):
 *  - It originally accepted an unauthenticated POST from anyone on the internet
 *    and INSERTed the caller-supplied body straight into
 *    `public.website_demo_requests` using the privileged server key, which
 *    bypasses RLS. There was no rate limit of any kind
 *    (TD-MARKETING-SITE-API-USES-SERVICE-ROLE-KEY, 550d7616).
 *
 *    That env var's exact name is deliberately NOT spelled out anywhere in this
 *    file, so grepping the public routes for it returns a hit only where the key
 *    is actually still used — nowhere, as of this commit. A history note that
 *    trips the audit it is describing makes the audit useless.
 *
 * WHAT CHANGED: the write no longer goes to the table at all. It goes through
 * `public.submit_walkthrough_request(p_email, p_name, p_institution, p_lane,
 * p_message)` — SECURITY DEFINER with `search_path` pinned to
 * `pg_catalog, public, pg_temp`, EXECUTE granted to anon. The function owns the
 * validation and the rate limits (at most 3 per email per rolling 24h, and a
 * global brake of 60 accepted per rolling hour), so neither is re-implemented
 * here and the two cannot drift apart.
 *
 * CONSEQUENCE: this route holds NO privileged-key reference. It uses the
 * publishable (anon) key only — the same key a browser would carry — so a missing
 * grant or policy fails here loudly instead of succeeding under a privileged key.
 *
 * TABLE PRIVILEGES, CORRECTED. The preview rebuild's copy of this file recorded
 * that `anon` still held table-level `arwdDxtm` on `website_demo_requests` and
 * that revoking it was "filed, not fixed". That is no longer true and the note is
 * not carried forward: migration
 * `20260926030000_revoke_website_demo_requests_privileges_469.sql` revoked ALL
 * from both `anon` and `authenticated` and asserted all fourteen privilege cells
 * false, and it is on `main`. A direct anon INSERT is now refused by PRIVILEGE
 * ("permission denied for table"), where before it was refused by RLS alone
 * ("violates row-level security policy") — the same SQLSTATE 42501 either way,
 * which is why the discriminating proof was a SELECT going from `200 []` to
 * `401`. The RPC is unaffected: it is SECURITY DEFINER and runs as its owner.
 *
 * FIELDS THIS ROUTE NO LONGER PERSISTS. The route it replaces wrote four columns
 * the RPC has no parameter for: `source_page`, `source_cta`, `domain`, and the
 * server-derived `referrer`. It also wrote `audience_type` verbatim, whereas the
 * RPC's lane vocabulary is {ria, bank, bd, other}, so the marketing site's
 * `credit_union` and `unknown` both normalise to `other`. The columns still exist
 * and simply go NULL from here on. This is a real loss of lead attribution, taken
 * knowingly in exchange for removing the privileged key today, and filed as
 * TD-WALKTHROUGH-RPC-DROPS-SEVEN-ATTRIBUTION-COLUMNS rather than papered over
 * by smuggling the values into `p_message`.
 */

/** Verbatim RPC reasons that mean "the caller sent something unusable". */
const INVALID_REASONS = new Set([
  'invalid_email',
  'invalid_lane',
  'name_too_long',
  'institution_too_long',
  'message_too_long',
]);

/** Lanes the RPC accepts. Anything else is normalised to `other` before the call. */
const LANES = new Set(['ria', 'bank', 'bd', 'other']);

type Payload = {
  email?: unknown;
  name?: unknown;
  institution?: unknown;
  lane?: unknown;
  message?: unknown;
  /**
   * HONEYPOT. Rendered as a visually-hidden, `aria-hidden`, `tabIndex={-1}`
   * input that a person never sees and never focuses. A filled value means a
   * bot filled every field it found, so we return 200 and call nothing: a bot
   * that is told it failed comes back adapted, and a 200 costs us nothing
   * because no row is written.
   */
  company_website?: unknown;
};

function asString(v: unknown): string {
  return typeof v === 'string' ? v.trim() : '';
}

export async function POST(request: Request) {
  let body: Payload;
  try {
    body = (await request.json()) as Payload;
  } catch {
    return NextResponse.json(
      { ok: false, reason: 'invalid_json' },
      { status: 400 },
    );
  }

  // ---- honeypot ------------------------------------------------------------
  // Checked before anything else: a bot must not even reach the database.
  if (asString(body.company_website).length > 0) {
    return NextResponse.json({ ok: true }, { status: 200 });
  }

  const url = process.env.NEXT_PUBLIC_SUPABASE_URL ?? '';
  const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ?? '';

  if (!url || !anonKey) {
    // Say which name is missing, never its value.
    console.warn(
      '[demo-request] WARNING: NEXT_PUBLIC_SUPABASE_URL and/or ' +
        'NEXT_PUBLIC_SUPABASE_ANON_KEY are not set in this environment.',
    );
    return NextResponse.json(
      { ok: false, reason: 'not_configured' },
      { status: 503 },
    );
  }

  const rawLane = asString(body.lane).toLowerCase();

  const supabase = createClient(url, anonKey, {
    auth: { persistSession: false, autoRefreshToken: false },
  });

  const { data, error } = await supabase.rpc('submit_walkthrough_request', {
    p_email: asString(body.email),
    p_name: asString(body.name) || null,
    p_institution: asString(body.institution) || null,
    p_lane: LANES.has(rawLane) ? rawLane : 'other',
    p_message: asString(body.message) || null,
  });

  if (error) {
    console.warn(`[demo-request] WARNING: RPC failed. ${error.message}`);
    return NextResponse.json(
      { ok: false, reason: 'unavailable' },
      { status: 502 },
    );
  }

  const result = (data ?? {}) as { ok?: boolean; reason?: string };

  if (result.ok === true) {
    return NextResponse.json({ ok: true }, { status: 200 });
  }

  const reason = result.reason ?? 'unknown';

  if (reason === 'rate_limited') {
    return NextResponse.json({ ok: false, reason }, { status: 429 });
  }

  if (INVALID_REASONS.has(reason)) {
    return NextResponse.json({ ok: false, reason }, { status: 400 });
  }

  // An unrecognised reason is a contract change, not a client error. Do not
  // guess a status that flatters it.
  console.warn(`[demo-request] WARNING: unrecognised RPC reason "${reason}".`);
  return NextResponse.json({ ok: false, reason }, { status: 502 });
}

/** GET is not part of the intake contract. */
export async function GET() {
  return NextResponse.json(
    { ok: false, reason: 'method_not_allowed' },
    { status: 405 },
  );
}
