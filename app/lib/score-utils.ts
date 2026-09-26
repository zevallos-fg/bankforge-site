/**
 * Converts raw geo_visibility_score (0–65) to
 * AI Readiness Score (0–100) for display.
 * The database column and its scale never change.
 * Never expose raw score in customer-facing output.
 *
 * ABSENT IS NOT ZERO (TW1.F.2, folds
 * TD-SITE-SCANDEMO-RENDERS-A-FABRICATED-ZERO-ON-A-FOUND-FALSE-BODY).
 * This function used to answer `0` for a null or undefined raw score, so an
 * institution we had never scored rendered as "0 / 100" — a measured-looking
 * floor for something never measured, and the worst possible reading for the one
 * case where being honest matters most. A missing score is now `null`, and the
 * caller has to decide what to draw for it. That is deliberate: the return type
 * makes the decision unavoidable instead of defaulting it to a number.
 *
 * The same defect existed on the server side. Migration 471 zero-filled the
 * compliance block of public.scan_preview_lookup; migration 472 changed it to
 * null for the same reason.
 */
export function toAiReadinessScore(
  rawScore: number | null | undefined
): number | null {
  if (rawScore === null || rawScore === undefined) return null;
  if (!Number.isFinite(rawScore)) return null;
  return Math.round((rawScore / 65) * 100);
}

/**
 * Display form. A score we do not hold reads as not measured, never as a number.
 * The string is deliberately non-numeric so it cannot be mistaken for a value or
 * parsed back into one.
 */
export function formatAiReadinessScore(
  rawScore: number | null | undefined
): string {
  const score = toAiReadinessScore(rawScore);
  return score === null ? 'not measured' : `${score} / 100`;
}
