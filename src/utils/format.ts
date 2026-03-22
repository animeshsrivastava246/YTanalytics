/**
 * Formats a raw number into an abbreviated string (e.g. 1200000 → "1.2M").
 * Centralised to avoid duplication across feature modules.
 */
export function formatStat(num?: number): string {
  if (!num) return '0';
  if (num >= 1_000_000) return (num / 1_000_000).toFixed(1) + 'M';
  if (num >= 1_000) return (num / 1_000).toFixed(1) + 'K';
  return num.toString();
}
