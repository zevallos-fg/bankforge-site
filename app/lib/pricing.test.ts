import { describe, it, expect } from 'vitest';
import {
  headlinePrice,
  foundingLine,
  foundingIsOnlyPrice,
  type SkuRow,
} from './pricing';

/**
 * Locks TD-SKU-EXAM-READINESS-BUNDLE-RENDERS-CUSTOM-PRICING-BESIDE-A-FOUNDING-RATE.
 *
 * The fixture values are the LIVE shapes read from `v_sku_catalog_public` on
 * 2026-09-26, not invented ones.
 */
const base: SkuRow = {
  sku_code: 'x',
  family: 'forge',
  lane: 'ria',
  slot: 1,
  product_name: 'X',
  tier_key: null,
  tier_label: null,
  billing_unit: 'year',
  price_founding_usd: null,
  price_standard_usd: null,
  display_rule: 'exact',
  site_status: 'book_walkthrough',
  display_order: 1,
  effective_from: '2026-01-01',
};

/** The live Exam Readiness Bundle row. */
const examReadiness: SkuRow = {
  ...base,
  sku_code: 'forge-ria-bundle-exam-readiness',
  product_name: 'Exam Readiness Bundle',
  display_rule: 'exact',
  price_standard_usd: null,
  price_founding_usd: 14000,
  display_order: 100,
};

describe('Exam Readiness Bundle — founding rate is the only ruled price', () => {
  it('headlines the founding price, not "Custom pricing"', () => {
    expect(headlinePrice(examReadiness)).toBe('$14,000');
  });

  it('never renders "Custom pricing" for this row', () => {
    expect(headlinePrice(examReadiness)).not.toContain('Custom pricing');
  });

  it('keeps the founding line but stops repeating the number', () => {
    expect(foundingLine(examReadiness)).toBe('Founding rate for our first 5 clients');
  });

  it('is recognised by the predicate', () => {
    expect(foundingIsOnlyPrice(examReadiness)).toBe(true);
  });
});

describe('by_quote still wins', () => {
  it('a quote-only row stays "Custom pricing" even carrying a founding rate', () => {
    const row = { ...base, display_rule: 'by_quote', price_founding_usd: 9000 };
    expect(headlinePrice(row)).toBe('Custom pricing');
    expect(foundingIsOnlyPrice(row)).toBe(false);
  });

  it('a quote-only row with no prices at all stays "Custom pricing"', () => {
    // forge-bank-2 "Above $25B" and edge-*-6 are the live instances.
    expect(headlinePrice({ ...base, display_rule: 'by_quote' })).toBe('Custom pricing');
  });
});

describe('rows with a standard price are untouched by the fix', () => {
  it('exact renders the standard price and a qualified founding line', () => {
    // The live forge-ria-2 "Comprehensive" shape.
    const row = { ...base, price_standard_usd: 18000, price_founding_usd: 12000 };
    expect(headlinePrice(row)).toBe('$18,000');
    expect(foundingLine(row)).toBe('Founding rate for our first 5 clients: $12,000');
  });

  it('starts_at keeps its asterisk', () => {
    // The live forge-bank-2 "$5-25B" shape.
    const row = {
      ...base,
      display_rule: 'starts_at',
      price_standard_usd: 102000,
      price_founding_usd: 60000,
    };
    expect(headlinePrice(row)).toBe('Starts at $102,000*');
    expect(foundingLine(row)).toBe('Founding rate for our first 5 clients: $60,000');
  });

  it('a row with no founding rate has no founding line', () => {
    expect(foundingLine({ ...base, price_standard_usd: 599 })).toBeNull();
  });
});
