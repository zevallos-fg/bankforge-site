import { NextResponse } from 'next/server';

/**
 * DISABLED on this branch — HALT-KEY-FIX-NEEDS-DDL, branch C (integrity-finding).
 *
 * What this route used to do: accept an unauthenticated POST from anyone on the
 * internet and INSERT the attacker-supplied body into `public.website_demo_requests`
 * using SUPABASE_SERVICE_ROLE_KEY, which bypasses RLS. There was no rate limit of
 * any kind on this path.
 *
 * Why it could not simply be switched to the anon key (the B6 fix):
 * `website_demo_requests` has RLS enabled and exactly ONE policy —
 * `service_role_all`, FOR ALL, TO service_role. There is no policy granting anon
 * INSERT, so an anon-key write is refused by RLS. Making it work needs a new
 * INSERT policy — a database migration, which this track must not author
 * (T3 scope: never write the database).
 *
 * So the route is disabled here rather than left armed. The new site collects
 * interest by email instead (no signups, no payments — D-TW-10), so nothing in
 * the rebuilt UI calls this endpoint.
 *
 * NOTE FOR THE LAUNCH LEG: production still serves the original route until this
 * branch merges. Tracked as TD-MARKETING-SITE-API-USES-SERVICE-ROLE-KEY (550d7616).
 * The needed policy is named in that TD.
 */
export async function POST() {
  return NextResponse.json(
    {
      error: 'disabled',
      message: 'This endpoint is disabled. Please contact us by email instead.',
    },
    { status: 410 },
  );
}

export async function GET() {
  return NextResponse.json({ error: 'disabled' }, { status: 410 });
}
