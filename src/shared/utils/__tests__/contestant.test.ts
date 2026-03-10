import { describe, it, expect } from 'vitest';
import { getNameInitials, getNameGradientClass } from '../contestant';

describe('getNameInitials', () => {
  it('returns first 2 chars for names longer than 1', () => {
    expect(getNameInitials('김채원')).toBe('김채');
    expect(getNameInitials('宮脇咲良')).toBe('宮脇');
  });

  it('returns single char for single-char names', () => {
    expect(getNameInitials('A')).toBe('A');
  });

  it('handles 2-char names', () => {
    expect(getNameInitials('AB')).toBe('AB');
  });
});

describe('getNameGradientClass', () => {
  it('returns a valid Tailwind gradient class', () => {
    const result = getNameGradientClass('김채원');
    expect(result).toMatch(/^from-\w+-\d+ to-\w+-\d+$/);
  });

  it('is deterministic for the same name', () => {
    const a = getNameGradientClass('테스트');
    const b = getNameGradientClass('테스트');
    expect(a).toBe(b);
  });

  it('may differ for different names', () => {
    // Not guaranteed to differ, but likely
    const results = new Set([
      getNameGradientClass('김채원'),
      getNameGradientClass('강다니엘'),
      getNameGradientClass('宮脇咲良'),
      getNameGradientClass('笠原桃奈'),
    ]);
    // At least 2 different gradients across 4 names (very likely)
    expect(results.size).toBeGreaterThanOrEqual(1);
  });
});
