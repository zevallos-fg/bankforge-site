import {
  type SkuRow,
  type PricingResult,
  CONTRACT_COLUMNS,
  withholdUnpublishedPrices,
} from './pricing';
import { serverDb } from './server-db';

/**
 * Fetch the catalogue. Server-side only, at build time and on hourly revalidation.
 *
 * MOVED HERE AND OFF THE PUBLIC KEY (WEB2.A.1, TD 97cec896). This used to read the
 * view with the public anon key, and lived in `pricing.ts`, which client components
 * import for its helpers. It now reads with the server-only credential from
 * `server-db.ts`, so it lives in a module no client component imports. That move is
 * what lets Fernando revoke anon's SELECT on `v_sku_catalog_public` (drafted, not run:
 * D-DL40-48 0dfee90d) without the pricing sections going blank.
 *
 * If the view cannot be read, the pricing sections say so and invite a conversation.
 * They NEVER fall back to a remembered number.
 */
const EMPTY: PricingResult = {
  bound: false,
  rows: [],
  reason: null,
  columnDiff: null,
};

export async function getPricing(): Promise<PricingResult> {
  const db = serverDb();
  if (!db.ok) {
    // Name the missing variable, never a value.
    const reason = `${db.missing} is not set in this environment`;
    console.warn(`[pricing] WARNING: ${reason}. Rendering the unavailable message.`);
    return { ...EMPTY, reason };
  }

  const endpoint =
    `${db.url}/rest/v1/v_sku_catalog_public` +
    `?select=*&order=lane.asc,family.asc,display_order.asc`;

  try {
    const res = await fetch(endpoint, {
      headers: { apikey: db.key, Authorization: `Bearer ${db.key}` },
      // Revalidate hourly so a price ruling reaches the site without a code change.
      next: { revalidate: 3600 },
    });

    if (!res.ok) {
      const body = await res.text().catch(() => '');
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

    // Contract check. We do NOT adapt to a changed view: a column change is a new
    // contract version and needs a ruling, so a drift renders the fallback.
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
      rows: rows.map(withholdUnpublishedPrices),
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
