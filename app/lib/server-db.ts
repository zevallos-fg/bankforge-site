/**
 * The site's ONE server-only database credential, and the only file that names it.
 *
 * WHY THIS EXISTS (WEB2.A.1, TD 97cec896, D-HQ3-20 cbbe258c). On 2026-11-05 Fernando
 * revoked anon and authenticated EXECUTE on every anon-callable SECURITY DEFINER
 * function, including the two this site calls: `submit_walkthrough_request` and
 * `scan_preview_lookup`. Measured on 2026-11-26, both now grant EXECUTE to postgres
 * and service_role only. The walkthrough form and the scan preview were calling them
 * with the public key, so both routes had been answering 502 since that revoke.
 * The go for this fix says: a server-only credential, never a NEXT_PUBLIC_* key, and
 * do NOT re-grant anon. service_role is the only role that can call them, so it is the
 * credential used here.
 *
 * WHAT KEEPS IT SERVER-ONLY.
 *  - The env var has no NEXT_PUBLIC_ prefix, so Next.js never inlines it into a
 *    browser bundle.
 *  - Only three server modules import this file: the two API routes and
 *    `pricing-server.ts`. No 'use client' file may import it, or import anything
 *    that does; `server-db.test.ts` fails the build's test run if one ever does.
 *  - What each caller does with it is narrow: one RPC call per request in each route,
 *    one SELECT of the public price view at build time. No route reads a table.
 *
 * HONEST LIMIT. service_role bypasses RLS. The routes are safe because each passes
 * caller input to exactly one function that owns its own validation and rate limit,
 * not because the key is weak. A narrower dedicated role holding EXECUTE on just those
 * two functions would be better; creating one is a role and grant change, which is
 * Fernando's (HR 102), and is named in the leg report rather than done here.
 */

/** The variable names, so a missing one can be named without ever printing a value. */
export const SERVER_DB_URL_VARS = ['SUPABASE_URL', 'NEXT_PUBLIC_SUPABASE_URL'] as const;
export const SERVER_DB_KEY_VAR = 'SUPABASE_SERVICE_ROLE_KEY' as const;

export type ServerDb =
  | { ok: true; url: string; key: string }
  | { ok: false; missing: string };

/** Read the credential from the environment. Never logs or returns a value on failure. */
export function serverDb(env: Record<string, string | undefined> = process.env): ServerDb {
  const url = (env.SUPABASE_URL || env.NEXT_PUBLIC_SUPABASE_URL || '').replace(/\/+$/, '');
  const key = env[SERVER_DB_KEY_VAR] || '';
  if (!url) return { ok: false, missing: SERVER_DB_URL_VARS.join(' or ') };
  if (!key) return { ok: false, missing: SERVER_DB_KEY_VAR };
  return { ok: true, url, key };
}
