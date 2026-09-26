/**
 * The ONLY place the site learns what anything costs.
 *
 * Prices are read at build time from `public.v_sku_catalog_public`, the view
 * fixed by the TW1 CONTRACT. There is deliberately no literal price anywhere in
 * this repo: the previous site carried them in five files and they drifted into
 * two different founding-rate expiries, one of which had already lapsed while
 * still being advertised (TD-SITE-FOUNDING-RATE-EXPIRY-CONTRADICTS-AND-HAS-LAPSED,
 * 0a63cda0).
 *
 * If the view cannot be read, the pricing sections say so and invite a
 * conversation. They NEVER fall back to a remembered number — a stale price
 * rendered confidently is the exact failure this module exists to prevent.
 */

/** One displayable SKU row. Mirrors the CONTRACT column list, in order. */
export interface SkuRow {
  sku_code: string;
  family: 'edge' | 'forge' | string;
  lane: 'ria' | 'bd' | 'bank' | string;
  slot: number;
  product_name: string;
  tier_key: string | null;
  tier_label: string | null;
  billing_unit: 'one_time' | 'month' | 'quarter' | 'year' | string;
  price_founding_usd: number | null;
  price_standard_usd: number | null;
  display_rule: 'exact' | 'starts_at' | 'by_quote' | string;
  site_status: 'early_access' | 'book_walkthrough' | 'waitlist' | 'live' | string;
  display_order: number;
  effective_from: string;
}

/** The CONTRACT column list, in order. Used to detect a contract drift. */
export const CONTRACT_COLUMNS: readonly (keyof SkuRow)[] = [
  'sku_code',
  'family',
  'lane',
  'slot',
  'product_name',
  'tier_key',
  'tier_label',
  'billing_unit',
  'price_founding_usd',
  'price_standard_usd',
  'display_rule',
  'site_status',
  'display_order',
  'effective_from',
] as const;

export interface PricingResult {
  /** True only when the view was read AND returned at least one row. */
  bound: boolean;
  rows: SkuRow[];
  /** Human-readable reason when `bound` is false. Rendered nowhere; logged. */
  reason: string | null;
  /** Column names the view returned that the contract does not name, and vice versa. */
  columnDiff: { missing: string[]; unexpected: string[] } | null;
}

/** Shown wherever a price would be, when the registry could not be read. */
export const PRICING_UNAVAILABLE_MESSAGE =
  'Pricing is being updated — book a walkthrough';

const EMPTY: PricingResult = {
  bound: false,
  rows: [],
  reason: null,
  columnDiff: null,
};

/**
 * Fetch the catalogue. Server-side only, at build time.
 *
 * Reads with the ANON key over PostgREST, which is the same path a browser
 * would take — so a policy or grant that is missing fails here rather than
 * silently succeeding under a privileged key.
 */
export async function getPricing(): Promise<PricingResult> {
  const url =
    process.env.NEXT_PUBLIC_SUPABASE_URL ?? process.env.SUPABASE_URL ?? '';
  const anonKey =
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ?? process.env.SUPABASE_ANON_KEY ?? '';

  if (!url || !anonKey) {
    const reason =
      'NEXT_PUBLIC_SUPABASE_URL and/or NEXT_PUBLIC_SUPABASE_ANON_KEY are not set in this environment';
    console.warn(`[pricing] WARNING: ${reason}. Rendering the unavailable message.`);
    return { ...EMPTY, reason };
  }

  const endpoint =
    `${url.replace(/\/+$/, '')}/rest/v1/v_sku_catalog_public` +
    `?select=*&order=lane.asc,family.asc,display_order.asc`;

  try {
    const res = await fetch(endpoint, {
      headers: { apikey: anonKey, Authorization: `Bearer ${anonKey}` },
      // Build-time read; revalidate hourly so a price ruling reaches the site
      // without a code change.
      next: { revalidate: 3600 },
    });

    if (!res.ok) {
      const body = await res.text().catch(() => '');
      // A privilege error is the signal T1's HALT-ANON-READS-ZERO owns.
      const reason = `v_sku_catalog_public returned HTTP ${res.status}. ${body.slice(0, 300)}`;
      console.warn(`[pricing] WARNING: ${reason}`);
      return { ...EMPTY, reason };
    }

    const rows = (await res.json()) as SkuRow[];

    if (!Array.isArray(rows) || rows.length === 0) {
      const reason = 'v_sku_catalog_public read successfully but returned 0 rows';
      console.warn(`[pricing] WARNING: ${reason}`);
      return { ...EMPTY, reason };
    }

    // Contract check. We do NOT adapt to a changed view: a column change is a
    // new contract version and needs a ruling, so a drift renders the fallback.
    const got = Object.keys(rows[0]);
    const missing = CONTRACT_COLUMNS.filter((c) => !got.includes(c as string));
    const unexpected = got.filter(
      (c) => !(CONTRACT_COLUMNS as readonly string[]).includes(c),
    );

    if (missing.length > 0) {
      const reason = `v_sku_catalog_public does not match CONTRACT. missing=[${missing.join(
        ', ',
      )}] unexpected=[${unexpected.join(', ')}]`;
      console.warn(`[pricing] WARNING: ${reason}`);
      return { ...EMPTY, reason, columnDiff: { missing: missing as string[], unexpected } };
    }

    return {
      bound: true,
      rows,
      reason: null,
      columnDiff: unexpected.length ? { missing: [], unexpected } : null,
    };
  } catch (err) {
    const reason = `fetch of v_sku_catalog_public threw: ${
      err instanceof Error ? err.message : String(err)
    }`;
    console.warn(`[pricing] WARNING: ${reason}`);
    return { ...EMPTY, reason };
  }
}

// ─── Presentation helpers ──────────────────────────────────────────────────

const UNIT_LABEL: Record<string, string> = {
  one_time: 'one-time',
  month: 'per month',
  quarter: 'per quarter',
  year: 'per year',
};

export function unitLabel(unit: string): string {
  return UNIT_LABEL[unit] ?? unit;
}

export function formatUsd(amount: number): string {
  return `$${amount.toLocaleString('en-US')}`;
}

/**
 * The headline price string for a row, per the display rule.
 * `starts_at` carries an asterisk; the footnote is rendered by the caller.
 */
export function headlinePrice(row: SkuRow): string {
  // A row whose only ruled price is the founding one headlines THAT price.
  if (foundingIsOnlyPrice(row)) return formatUsd(row.price_founding_usd);

  if (row.display_rule === 'by_quote' || row.price_standard_usd == null) {
    return 'Custom pricing';
  }
  const money = formatUsd(row.price_standard_usd);
  if (row.display_rule === 'starts_at') return `Starts at ${money}*`;
  return money;
}

/**
 * The founding-rate line, or null when no founding price is ruled.
 * Deliberately carries NO expiry date: two contradictory expiries on the old
 * site are why this module exists, and an expiry is a commercial term that
 * belongs in a conversation, not in cached HTML.
 */
export function foundingLine(row: SkuRow): string | null {
  if (row.price_founding_usd == null) return null;
  // The headline already IS this number, so the line qualifies it instead of
  // repeating it. One price, said once.
  if (foundingIsOnlyPrice(row)) return 'Founding rate for our first 5 clients';
  return `Founding rate for our first 5 clients: ${formatUsd(row.price_founding_usd)}`;
}

/**
 * True when the ONLY price ruled for a row is its founding rate.
 *
 * THE DEFECT THIS CLOSES. `forge-ria-bundle-exam-readiness` (Exam Readiness
 * Bundle) is ruled `display_rule: 'exact'` with `price_standard_usd` NULL and
 * `price_founding_usd` set. The old reader had no branch for that shape, so the
 * row fell through `price_standard_usd == null` and headlined "Custom pricing"
 * while `foundingLine` printed a specific founding rate immediately beneath it.
 * The page quoted a number and said in the same breath that it was not quoting
 * one (TD-SKU-EXAM-READINESS-BUNDLE-RENDERS-CUSTOM-PRICING-BESIDE-A-FOUNDING-RATE).
 *
 * FIXED IN THE READER, NOT THE REGISTRY. The row is not wrong: that bundle
 * genuinely has one ruled price and it is the founding one. The reader was the
 * thing with no way to say so, and the registry is a ruling surface this leg
 * does not write.
 *
 * `by_quote` STILL WINS. A row explicitly ruled quote-only is quoted whatever
 * else it carries, so adding a founding rate to such a row can never silently
 * turn a quote into a printed price.
 */
export function foundingIsOnlyPrice(
  row: SkuRow,
): row is SkuRow & { price_founding_usd: number } {
  return (
    row.display_rule !== 'by_quote' &&
    row.price_standard_usd == null &&
    row.price_founding_usd != null
  );
}

/** The call to action implied by the row's status (D-TW-10). */
export function ctaFor(status: string): { label: string; kind: 'walkthrough' | 'early' | 'waitlist' } {
  switch (status) {
    case 'early_access':
      return { label: 'Join early access', kind: 'early' };
    case 'waitlist':
      return { label: 'Join the waitlist', kind: 'waitlist' };
    default:
      return { label: 'Book a walkthrough', kind: 'walkthrough' };
  }
}

export const STARTS_AT_FOOTNOTE =
  '*Plus an increment for each additional $5B in assets; quoted.';

/** Rows for one lane, ordered for display. */
export function rowsForLane(rows: SkuRow[], lane: string): SkuRow[] {
  return rows
    .filter((r) => r.lane === lane)
    .sort(
      (a, b) =>
        a.family.localeCompare(b.family) || a.display_order - b.display_order,
    );
}
