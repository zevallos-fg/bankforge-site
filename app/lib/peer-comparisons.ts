/**
 * Peer comparison selector for the AI SEO score box.
 *
 * Computes up to 4 candidate comparisons against an entity's local peer
 * group (same state + asset tier) and national asset-tier cohort, then
 * returns the top 2 by urgency weight. Never names an institution
 * (Hard Rule 56). Never references corpus architecture (Hard Rule 55).
 * Never says "GEO" in user-facing strings (Hard Rule 57).
 *
 * All scores passed in MUST be normalized to the 0–100 AI Readiness
 * scale. Callers are responsible for normalization via
 * toAiReadinessScore() before invoking this helper.
 */

export interface PeerComparisonInput {
  entityScore: number;
  topLocalScore: number;
  localRank: number;
  totalLocalPeers: number;
  nationalAvg: number;
  nationalP75: number;
  stateName: string;
  assetTierLabel: string;
}

export interface PeerComparison {
  urgencyWeight: number;
  label: string;
  body: string;
}

type CandidateKind =
  | 'GAP_TOP_LOCAL'
  | 'LOCAL_RANK'
  | 'NATIONAL_P75_GAP'
  | 'NATIONAL_AVG_GAP';

interface Candidate extends PeerComparison {
  kind: CandidateKind;
  tiebreakRank: number;
}

const TIEBREAK_ORDER: Record<CandidateKind, number> = {
  LOCAL_RANK: 0,
  GAP_TOP_LOCAL: 1,
  NATIONAL_P75_GAP: 2,
  NATIONAL_AVG_GAP: 3,
};

export function selectTopComparisons(
  input: PeerComparisonInput,
): PeerComparison[] {
  const {
    entityScore,
    topLocalScore,
    localRank,
    totalLocalPeers,
    nationalAvg,
    nationalP75,
    stateName,
    assetTierLabel,
  } = input;

  const candidates: Candidate[] = [];

  const gapTopLocal = topLocalScore - entityScore;
  if (gapTopLocal > 0 && entityScore !== topLocalScore) {
    candidates.push({
      kind: 'GAP_TOP_LOCAL',
      urgencyWeight: gapTopLocal,
      label: `${gapTopLocal}-point gap to the top-scoring ${stateName} peer`,
      body: `A peer in your state and asset tier scores ${topLocalScore}/100`,
      tiebreakRank: TIEBREAK_ORDER.GAP_TOP_LOCAL,
    });
  }

  if (localRank > 1 && totalLocalPeers > 0) {
    candidates.push({
      kind: 'LOCAL_RANK',
      urgencyWeight: Math.round((localRank / totalLocalPeers) * 100),
      label: `Ranked #${localRank} of ${totalLocalPeers} ${stateName} peers`,
      body: `In your asset tier (${assetTierLabel}) across ${stateName}`,
      tiebreakRank: TIEBREAK_ORDER.LOCAL_RANK,
    });
  }

  const p75Gap = nationalP75 - entityScore;
  if (p75Gap > 0 && entityScore < nationalP75) {
    candidates.push({
      kind: 'NATIONAL_P75_GAP',
      urgencyWeight: p75Gap,
      label: `${p75Gap} points below the national top quartile`,
      body: `Top-quartile banks in your asset tier score ${nationalP75}+`,
      tiebreakRank: TIEBREAK_ORDER.NATIONAL_P75_GAP,
    });
  }

  const avgGap = Math.round(nationalAvg - entityScore);
  if (avgGap > 0 && entityScore < nationalAvg) {
    candidates.push({
      kind: 'NATIONAL_AVG_GAP',
      urgencyWeight: avgGap,
      label: `${avgGap} points below the national average`,
      body: `National average for ${assetTierLabel} banks is ${Math.round(nationalAvg)}`,
      tiebreakRank: TIEBREAK_ORDER.NATIONAL_AVG_GAP,
    });
  }

  if (candidates.length === 0) {
    return [
      {
        urgencyWeight: 0,
        label: `Top-ranked in your ${stateName} peer group`,
        body: `Scores higher than all other ${stateName} peers in your asset tier`,
      },
    ];
  }

  candidates.sort((a, b) => {
    if (b.urgencyWeight !== a.urgencyWeight) {
      return b.urgencyWeight - a.urgencyWeight;
    }
    return a.tiebreakRank - b.tiebreakRank;
  });

  return candidates.slice(0, 2).map(({ urgencyWeight, label, body }) => ({
    urgencyWeight,
    label,
    body,
  }));
}
