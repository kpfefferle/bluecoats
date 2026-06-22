import { describe, expect, it } from 'vitest';
import {
  buildTour,
  scoreAsOfDay,
  isInProgress,
} from '../../src/lib/utils/tour';
import type { SeasonScores } from '../../src/lib/data/base';

// Completed championship season. Includes one exhibition (null score) stop.
const S2024: SeasonScores = {
  year: '2024',
  endDate: '2024-08-10',
  placement: 1,
  show: 'Test Show',
  scores: [
    { date: '2024-06-22', location: 'Akron, OH', name: 'Opener', score: 74 },
    { date: '2024-07-06', location: 'Whitewater, WI', score: null }, // exhibition
    { date: '2024-07-20', location: 'San Antonio, TX', score: 91 },
    { date: '2024-08-10', location: 'Indianapolis, IN', score: 95 },
  ],
};

// Mid-season: two competed shows + a still-scheduled finals (undefined score).
const S2025_INPROGRESS: SeasonScores = {
  year: '2025',
  endDate: '2025-08-09',
  scores: [
    { date: '2025-06-23', location: 'Akron, OH', score: 75 },
    { date: '2025-07-18', location: 'San Antonio, TX', score: 92 },
    { date: '2025-08-09', location: 'Indianapolis, IN' }, // not competed yet
  ],
};

describe('buildTour', () => {
  it('includes numeric and null scores, excludes not-yet-competed', () => {
    const tour = buildTour(S2024);
    expect(tour.map((s) => s.daysBeforeFinals)).toEqual([49, 35, 21, 0]);
    expect(tour.map((s) => s.score)).toEqual([74, null, 91, 95]);
    expect(tour[0].name).toBe('Opener');
  });

  it('drops undefined-score (scheduled) stops', () => {
    const tour = buildTour(S2025_INPROGRESS);
    expect(tour.map((s) => s.daysBeforeFinals)).toEqual([47, 22]);
    expect(tour.map((s) => s.score)).toEqual([75, 92]);
  });
});

describe('scoreAsOfDay', () => {
  it('returns the latest numeric score at or before the given day', () => {
    expect(scoreAsOfDay(S2024, 21)).toBe(91);
    expect(scoreAsOfDay(S2024, 22)).toBe(74);
    expect(scoreAsOfDay(S2024, 0)).toBe(95);
  });

  it('returns null when no scored show is that early', () => {
    expect(scoreAsOfDay(S2024, 60)).toBeNull();
  });
});

describe('isInProgress', () => {
  it('is true when a season has both competed and still-scheduled shows', () => {
    expect(isInProgress(S2025_INPROGRESS)).toBe(true);
  });

  it('is false for a fully completed season', () => {
    expect(isInProgress(S2024)).toBe(false);
  });
});
