/**
 * Converts raw geo_visibility_score (0–65) to
 * AI Readiness Score (0–100) for display.
 * The database column and its scale never change.
 * Never expose raw score in customer-facing output.
 */
export function toAiReadinessScore(
  rawScore: number | null | undefined
): number {
  if (rawScore === null || rawScore === undefined) return 0;
  return Math.round((rawScore / 65) * 100);
}

export function formatAiReadinessScore(
  rawScore: number | null | undefined
): string {
  return `${toAiReadinessScore(rawScore)} / 100`;
}
