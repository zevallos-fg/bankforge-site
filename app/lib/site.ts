/**
 * Single source of truth for the site's own identity and base URL.
 *
 * Every canonical, OpenGraph, sitemap, robots and llms.txt URL is built from
 * SITE_URL. No page may hard-code a hostname — that is what produced the 68
 * `bankforge.ai` literals this module replaces (TW1.A.1 recon Q5).
 *
 * The product brand is Tiqsi.ai. The legal entity is BankForge.ai LLC, per the
 * EIN (D-TW-11, cc_decision_universe bf34ac8e). Those are two different facts
 * and both are rendered: the brand in the header and content, the entity in the
 * footer copyright. No "d/b/a" or "a brand of" line is rendered — no fictitious
 * name filing is established.
 */

/** Base URL for the public site. Override per environment with NEXT_PUBLIC_SITE_URL. */
export const SITE_URL: string = (
  process.env.NEXT_PUBLIC_SITE_URL ?? 'https://tiqsi.ai'
).replace(/\/+$/, '');

/** Product brand, shown in the header, titles and content. */
export const BRAND_NAME = 'Tiqsi.ai';

/** Legal entity, shown in the footer copyright only (D-TW-11). */
export const LEGAL_ENTITY = 'BankForge.ai LLC';

/** Copyright year — the site launched in 2026. */
export const COPYRIGHT_YEAR = '2026';

/**
 * Contact address. Still on the bankforge.ai domain: no ruling moves it, and
 * changing a live mailbox is not this track's call. Carried as an open item.
 */
export const CONTACT_EMAIL = 'outreach@bankforge.ai';

/** Absolute URL for a site-relative path. */
export function absoluteUrl(path = '/'): string {
  const suffix = path.startsWith('/') ? path : `/${path}`;
  return `${SITE_URL}${suffix === '/' ? '' : suffix}`;
}

/**
 * The answer engines measured, named exactly as the live data supports.
 * Source: public.ai_visibility_msa_queries carries exactly three engine values
 * — chatgpt, perplexity, dataforseo (Google AI Overviews) — read 2026-09-25.
 * `gemini` is admitted by the CHECK constraint (migration 454) but has zero
 * rows, so it is NOT named here. Never add an engine this list cannot evidence.
 */
export const ANSWER_ENGINES = [
  'ChatGPT',
  'Perplexity',
  'Google AI Overviews',
] as const;

/**
 * Corpus reach, with the denominator and the read date attached. Every figure
 * here came from a live count on 2026-09-25 and none may be restated without
 * its date (COPY CLAIMS GATE rule 2).
 */
export const MEASURED = {
  readOn: 'September 2026',
  rias: 23011,
  banks: 4312,
  creditUnions: 4374,
  /** AI-visibility queries executed since 2026-09-01, across the three engines. */
  aiVisibilityQueriesThisMonth: 15015,
} as const;

/** The public route list, used by sitemap, robots and llms.txt generation. */
export const ROUTES = [
  { path: '/', changeFrequency: 'weekly', priority: 1.0, title: 'Home' },
  { path: '/rias', changeFrequency: 'weekly', priority: 0.9, title: 'For Investment Advisers' },
  { path: '/rias/compliance', changeFrequency: 'monthly', priority: 0.8, title: 'RIA Marketing Rule Review' },
  { path: '/rias/ai-visibility', changeFrequency: 'monthly', priority: 0.8, title: 'RIA AI Visibility' },
  { path: '/banks', changeFrequency: 'weekly', priority: 0.9, title: 'For Banks and Credit Unions' },
  { path: '/banks/compliance', changeFrequency: 'monthly', priority: 0.8, title: 'Bank Compliance Review' },
  { path: '/banks/ai-visibility', changeFrequency: 'monthly', priority: 0.8, title: 'Bank AI Visibility' },
  { path: '/pricing', changeFrequency: 'weekly', priority: 0.9, title: 'Pricing' },
  { path: '/insights', changeFrequency: 'monthly', priority: 0.7, title: 'Insights' },
  { path: '/insights/bank-ai-score', changeFrequency: 'monthly', priority: 0.7, title: 'Why a bank AI visibility score is low' },
] as const;

/** Routes that exist but must not be indexed (launch is gated on legal review). */
export const NOINDEX_ROUTES = ['/terms', '/privacy'] as const;
