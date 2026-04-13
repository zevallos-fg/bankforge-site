import { describe, expect, it } from 'vitest';
import { selectTopComparisons } from './peer-comparisons';

describe('selectTopComparisons', () => {
  it('CNB of FL mid-pack — returns LOCAL_RANK + GAP_TOP_LOCAL', () => {
    const result = selectTopComparisons({
      entityScore: 77,
      topLocalScore: 100,
      localRank: 6,
      totalLocalPeers: 10,
      nationalAvg: 71,
      nationalP75: 77,
      stateName: 'Florida',
      assetTierLabel: '$10B–$50B',
    });
    expect(result).toHaveLength(2);
    const labels = result.map((r) => r.label);
    expect(labels).toContain('23-point gap to the top-scoring Florida peer');
    expect(labels).toContain('Ranked #6 of 10 Florida peers');
  });

  it('bottom-ranked bank — returns LOCAL_RANK + GAP_TOP_LOCAL by weight', () => {
    const result = selectTopComparisons({
      entityScore: 30,
      topLocalScore: 95,
      localRank: 10,
      totalLocalPeers: 10,
      nationalAvg: 71,
      nationalP75: 80,
      stateName: 'Texas',
      assetTierLabel: '$1B–$5B',
    });
    expect(result).toHaveLength(2);
    expect(result[0].urgencyWeight).toBeGreaterThanOrEqual(result[1].urgencyWeight);
    const kinds = result.map((r) => r.label);
    expect(kinds.some((l) => l.includes('gap to the top-scoring'))).toBe(true);
    expect(kinds.some((l) => l.includes('Ranked #10 of 10'))).toBe(true);
  });

  it('top-ranked bank with no gaps — returns edge case message', () => {
    const result = selectTopComparisons({
      entityScore: 100,
      topLocalScore: 100,
      localRank: 1,
      totalLocalPeers: 8,
      nationalAvg: 71,
      nationalP75: 80,
      stateName: 'New York',
      assetTierLabel: '$50B+',
    });
    expect(result).toHaveLength(1);
    expect(result[0].label).toBe('Top-ranked in your New York peer group');
    expect(result[0].body).toBe(
      'Scores higher than all other New York peers in your asset tier',
    );
    expect(result[0].urgencyWeight).toBe(0);
  });

  it('above national avg but below local top — GAP_TOP_LOCAL + LOCAL_RANK', () => {
    const result = selectTopComparisons({
      entityScore: 82,
      topLocalScore: 95,
      localRank: 3,
      totalLocalPeers: 12,
      nationalAvg: 71,
      nationalP75: 80,
      stateName: 'Ohio',
      assetTierLabel: '$5B–$10B',
    });
    expect(result).toHaveLength(2);
    const labels = result.map((r) => r.label);
    expect(labels.some((l) => l.includes('gap to the top-scoring Ohio peer'))).toBe(true);
    expect(labels.some((l) => l.includes('Ranked #3 of 12 Ohio peers'))).toBe(true);
    expect(labels.some((l) => l.includes('below the national top quartile'))).toBe(false);
    expect(labels.some((l) => l.includes('below the national average'))).toBe(false);
  });

  it('tiebreaker — LOCAL_RANK beats GAP_TOP_LOCAL at equal urgency', () => {
    const result = selectTopComparisons({
      entityScore: 50,
      topLocalScore: 70,
      localRank: 4,
      totalLocalPeers: 20,
      nationalAvg: 49,
      nationalP75: 70,
      stateName: 'Illinois',
      assetTierLabel: '$1B–$5B',
    });
    expect(result.length).toBeGreaterThanOrEqual(1);
    expect(result[0].label).toBe('Ranked #4 of 20 Illinois peers');
  });

  it('skips NATIONAL_P75_GAP when entityScore equals P75 (CNB parity case)', () => {
    const result = selectTopComparisons({
      entityScore: 77,
      topLocalScore: 100,
      localRank: 6,
      totalLocalPeers: 10,
      nationalAvg: 71,
      nationalP75: 77,
      stateName: 'Florida',
      assetTierLabel: '$10B–$50B',
    });
    expect(result.every((r) => !r.label.includes('top quartile'))).toBe(true);
  });

  it('skips NATIONAL_AVG_GAP when entityScore above national avg', () => {
    const result = selectTopComparisons({
      entityScore: 77,
      topLocalScore: 100,
      localRank: 6,
      totalLocalPeers: 10,
      nationalAvg: 71,
      nationalP75: 77,
      stateName: 'Florida',
      assetTierLabel: '$10B–$50B',
    });
    expect(result.every((r) => !r.label.includes('national average'))).toBe(true);
  });

  it('returns only 1 comparison if only 1 candidate has urgencyWeight > 0', () => {
    const result = selectTopComparisons({
      entityScore: 99,
      topLocalScore: 100,
      localRank: 1,
      totalLocalPeers: 8,
      nationalAvg: 71,
      nationalP75: 77,
      stateName: 'Georgia',
      assetTierLabel: '$5B–$10B',
    });
    expect(result).toHaveLength(1);
    expect(result[0].label).toBe('1-point gap to the top-scoring Georgia peer');
  });

  it('never names an institution (Hard Rule 56)', () => {
    const result = selectTopComparisons({
      entityScore: 40,
      topLocalScore: 90,
      localRank: 9,
      totalLocalPeers: 10,
      nationalAvg: 71,
      nationalP75: 80,
      stateName: 'California',
      assetTierLabel: '$10B–$50B',
    });
    const text = result.map((r) => `${r.label} ${r.body}`).join(' ').toLowerCase();
    expect(text).not.toMatch(/amerant|bank of america|chase|wells fargo/);
  });

  it('never says "GEO" (Hard Rule 57)', () => {
    const result = selectTopComparisons({
      entityScore: 40,
      topLocalScore: 90,
      localRank: 9,
      totalLocalPeers: 10,
      nationalAvg: 71,
      nationalP75: 80,
      stateName: 'California',
      assetTierLabel: '$10B–$50B',
    });
    const text = result.map((r) => `${r.label} ${r.body}`).join(' ');
    expect(text).not.toMatch(/\bGEO\b/);
  });
});
