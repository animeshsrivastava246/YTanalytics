import { describe, it, expect } from 'bun:test';
import { formatStat } from '../format';

describe('format utilities', () => {
  describe('formatStat', () => {
    it('formats 1,200,000 as 1.2M', () => {
      expect(formatStat(1_200_000)).toBe('1.2M');
    });

    it('formats 12,000 as 12.0K', () => {
      // Current implementation uses .toFixed(1) for both K and M
      expect(formatStat(12_000)).toBe('12.0K');
    });

    it('formats 999 as "999"', () => {
      expect(formatStat(999)).toBe('999');
    });

    it('returns "0" for undefined or 0', () => {
      expect(formatStat(undefined)).toBe('0');
      expect(formatStat(0)).toBe('0');
    });

    it('formats 1,500,000 as 1.5M', () => {
      expect(formatStat(1_500_000)).toBe('1.5M');
    });
  });
});
