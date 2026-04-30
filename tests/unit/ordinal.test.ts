import { describe, expect, it } from 'vitest';
import { ordinalSuffix } from '../../src/lib/utils/ordinal';

describe('ordinalSuffix', () => {
  it.each([
    [1, 'st'],
    [2, 'nd'],
    [3, 'rd'],
    [4, 'th'],
    [5, 'th'],
    [21, 'st'],
    [22, 'nd'],
    [23, 'rd'],
    [101, 'st'],
    [102, 'nd'],
    [103, 'rd'],
  ])('%d → %s', (rank, expected) => {
    expect(ordinalSuffix(rank)).toBe(expected);
  });

  it.each([11, 12, 13, 14, 15, 19])(
    'returns th for the teen exception (%d)',
    (rank) => {
      expect(ordinalSuffix(rank)).toBe('th');
    },
  );
});
