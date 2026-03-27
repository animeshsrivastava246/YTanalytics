import { describe, it, expect } from 'bun:test';
import {
  parseISO8601DurationToSeconds,
  sumDurations,
  computeTotalTimeAtSpeed,
  computeTimeSaved,
  formatDuration,
} from '../watchTime';

describe('watchTime utilities', () => {
  describe('parseISO8601DurationToSeconds', () => {
    it('parses PT1H2M10S correctly', () => {
      expect(parseISO8601DurationToSeconds('PT1H2M10S')).toBe(3730);
    });

    it('parses PT59M correctly', () => {
      expect(parseISO8601DurationToSeconds('PT59M')).toBe(3540);
    });

    it('parses PT45S correctly', () => {
      expect(parseISO8601DurationToSeconds('PT45S')).toBe(45);
    });

    it('returns 0 for empty or invalid strings', () => {
      expect(parseISO8601DurationToSeconds('')).toBe(0);
      expect(parseISO8601DurationToSeconds('invalid')).toBe(0);
    });
  });

  describe('sumDurations', () => {
    it('sums an array of seconds correctly', () => {
      expect(sumDurations([10, 20, 30])).toBe(60);
      expect(sumDurations([])).toBe(0);
    });
  });

  describe('computeTotalTimeAtSpeed', () => {
    it('calculates 100s at 2x as 50s', () => {
      expect(computeTotalTimeAtSpeed(100, 2)).toBe(50);
    });

    it('calculates 100s at 0.5x as 200s', () => {
      expect(computeTotalTimeAtSpeed(100, 0.5)).toBe(200);
    });

    it('calculates 100s at 10x as 10s', () => {
      expect(computeTotalTimeAtSpeed(100, 10)).toBe(10);
    });

    it('clamps speed to 0.1 at the low end', () => {
      expect(computeTotalTimeAtSpeed(100, 0.01)).toBe(1000);
    });

    it('clamps speed to 10 at the high end', () => {
      expect(computeTotalTimeAtSpeed(100, 20)).toBe(10);
    });
  });

  describe('computeTimeSaved', () => {
    it('calculates 100s at 2x saves 50s', () => {
      expect(computeTimeSaved(100, 2)).toBe(50);
    });

    it('calculates 100s at 0.5x saves -100s (loses time)', () => {
      expect(computeTimeSaved(100, 0.5)).toBe(-100);
    });
  });

  describe('formatDuration', () => {
    it('formats seconds into HH:MM:SS', () => {
      expect(formatDuration(3730)).toBe('1:02:10');
    });

    it('formats seconds into MM:SS if less than an hour', () => {
      expect(formatDuration(610)).toBe('10:10');
    });

    it('handles negative durations correctly', () => {
      expect(formatDuration(-610)).toBe('-10:10');
    });

    it('pads single digit minutes and seconds correctly', () => {
      expect(formatDuration(3661)).toBe('1:01:01');
      expect(formatDuration(61)).toBe('1:01');
    });
  });
});
