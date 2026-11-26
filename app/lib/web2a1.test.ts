import { describe, it, expect } from 'vitest';
import { readFileSync, readdirSync, statSync } from 'node:fs';
import { join, relative, sep } from 'node:path';
import {
  headlinePrice,
  foundingLine,
  availabilityLabel,
  withholdUnpublishedPrices,
  ctaFor,
  type SkuRow,
} from './pricing';
import { serverDb, SERVER_DB_KEY_VAR } from './server-db';
import { taggedMessage } from './request-tags';
import { ROUTES, NOINDEX_ROUTES } from './site';

/**
 * WEB2.A.1 (D-WEB2-1 63aa7a80): forge-ria-3 on sale, forge-bd-1 coming soon, bank
 * coming later, the two routes on a server-only credential, sitemap complete.
 * Fixtures are the shapes migration 675 left in v_sku_catalog_public on 2026-11-26.
 */
const base: SkuRow = {
  sku_code: 'x',
  family: 'forge',
  lane: 'ria',
  slot: 1,
  product_name: 'X',
  tier_key: null,
  tier_label: null,
  billing_unit: 'one_time',
  price_founding_usd: null,
  price_standard_usd: null,
  display_rule: 'exact',
  site_status: 'book_walkthrough',
  display_order: 1,
  effective_from: '2026-11-26',
};

const ria3: SkuRow = {
  ...base,
  sku_code: 'forge-ria-3',
  product_name: 'Dual Registrant Simple',
  price_founding_usd: 6500,
  price_standard_usd: 9000,
};
const bd1: SkuRow = {
  ...base,
  sku_code: 'forge-bd-1',
  lane: 'bd',
  product_name: 'Broker-Dealer Simple',
  display_rule: 'by_quote',
  site_status: 'waitlist',
};
const bank: SkuRow = {
  ...base,
  sku_code: 'forge-bank-2',
  lane: 'bank',
  product_name: 'Compliance Review',
  tier_key: 'community',
  tier_label: 'Community',
  display_rule: 'by_quote',
  site_status: 'waitlist',
};

describe('availability', () => {
  it('forge-ria-3 is on sale at the ruled prices', () => {
    expect(availabilityLabel(ria3)).toBeNull();
    expect(headlinePrice(ria3)).toBe('$9,000');
    expect(foundingLine(ria3)).toBe('Founding rate for our first 5 clients: $6,500');
  });

  it('forge-bd-1 says coming soon, never a price or "Custom pricing"', () => {
    expect(headlinePrice(bd1)).toBe('Coming soon');
    expect(foundingLine(bd1)).toBeNull();
    expect(ctaFor(bd1.site_status).kind).toBe('waitlist');
  });

  it('a bank row says coming later, never a price', () => {
    expect(headlinePrice(bank)).toBe('Coming later');
    expect(foundingLine(bank)).toBeNull();
  });

  it('a bank row that somehow carries a price is stripped before rendering', () => {
    const leaked = { ...bank, display_rule: 'exact', price_founding_usd: 21000, price_standard_usd: 36000 };
    const shown = withholdUnpublishedPrices(leaked);
    expect(shown.price_founding_usd).toBeNull();
    expect(shown.price_standard_usd).toBeNull();
    expect(headlinePrice(shown)).toBe('Coming later');
    // An on-sale row passes through untouched.
    expect(withholdUnpublishedPrices(ria3)).toBe(ria3);
  });
});

describe('server-only credential', () => {
  it('names the missing variable and never returns a value', () => {
    const r = serverDb({ NEXT_PUBLIC_SUPABASE_URL: 'https://x.supabase.co', NEXT_PUBLIC_SUPABASE_ANON_KEY: 'public' });
    expect(r).toEqual({ ok: false, missing: SERVER_DB_KEY_VAR });
  });

  it('never accepts a NEXT_PUBLIC_* key as the credential', () => {
    expect(SERVER_DB_KEY_VAR.startsWith('NEXT_PUBLIC_')).toBe(false);
    const r = serverDb({ SUPABASE_URL: 'https://x.supabase.co/', [SERVER_DB_KEY_VAR]: 'k' });
    expect(r).toEqual({ ok: true, url: 'https://x.supabase.co', key: 'k' });
  });

  // Walk app/ once for the import checks.
  const appDir = join(__dirname, '..');
  const files: string[] = [];
  const walk = (d: string) => {
    for (const n of readdirSync(d)) {
      const p = join(d, n);
      if (statSync(p).isDirectory()) walk(p);
      else if (/\.(ts|tsx)$/.test(n) && !/\.test\.ts$/.test(n)) files.push(p);
    }
  };
  walk(appDir);

  it('no client component imports the credential or the server price read', () => {
    const offenders = files.filter((f) => {
      const s = readFileSync(f, 'utf8');
      return /^['"]use client['"]/m.test(s) && /lib\/(server-db|pricing-server)['"]/.test(s);
    });
    expect(offenders).toEqual([]);
  });

  it('pricing.ts, which client components import, does not import the credential', () => {
    const s = readFileSync(join(__dirname, 'pricing.ts'), 'utf8');
    expect(/server-db|pricing-server/.test(s.replace(/^\s*\/\/.*$/gm, ''))).toBe(false);
  });

  it('the two API routes read no NEXT_PUBLIC_* key', () => {
    for (const r of ['api/demo-request/route.ts', 'api/scan-preview/route.ts']) {
      const s = readFileSync(join(appDir, r), 'utf8');
      expect(s).not.toMatch(/process\.env\.NEXT_PUBLIC_SUPABASE_ANON_KEY/);
      expect(s).toMatch(/serverDb\(\)/);
    }
  });
});

describe('bank-waitlist tag', () => {
  it('prefixes only an allowed tag', () => {
    expect(taggedMessage('bank-waitlist', 'hello')).toBe('[bank-waitlist] hello');
    expect(taggedMessage('bank-waitlist', '')).toBe('[bank-waitlist]');
    expect(taggedMessage('anything-else', 'hello')).toBe('hello');
    expect(taggedMessage('', '')).toBeNull();
  });
});

describe('sitemap', () => {
  it('ROUTES lists every page on the site (noindex pages excepted)', () => {
    const appDir = join(__dirname, '..');
    const pages: string[] = [];
    const walk = (d: string) => {
      for (const n of readdirSync(d)) {
        const p = join(d, n);
        if (statSync(p).isDirectory()) walk(p);
        else if (n === 'page.tsx') {
          const rel = relative(appDir, d).split(sep).join('/');
          pages.push(rel === '' ? '/' : `/${rel}`);
        }
      }
    };
    walk(appDir);
    const listed = new Set<string>([...ROUTES.map((r) => r.path), ...NOINDEX_ROUTES]);
    expect(pages.filter((p) => !listed.has(p))).toEqual([]);
  });
});
