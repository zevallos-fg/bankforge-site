/**
 * Returns the repdte string for the corpus month to display.
 * Always 1 month in arrears from today.
 * Format: 'YYYY-MM'
 */
export function getCorpusMonth(): string {
  const now = new Date();
  const year = now.getUTCFullYear();
  const month = now.getUTCMonth(); // 0-indexed, so month=3 = April
  const corpusDate = new Date(Date.UTC(year, month - 1, 1));
  const corpusYear = corpusDate.getUTCFullYear();
  const corpusMonth = String(corpusDate.getUTCMonth() + 1).padStart(2, '0');
  return `${corpusYear}-${corpusMonth}`;
}

/**
 * Returns a human-readable label like "March 2026" for the corpus month.
 */
export function getCorpusMonthLabel(): string {
  const now = new Date();
  const year = now.getUTCFullYear();
  const month = now.getUTCMonth();
  const corpusDate = new Date(Date.UTC(year, month - 1, 1));
  return corpusDate.toLocaleDateString('en-US', { month: 'long', year: 'numeric', timeZone: 'UTC' });
}
