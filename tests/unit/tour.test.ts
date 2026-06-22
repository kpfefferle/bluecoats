import { describe, expect, it } from 'vitest';
import {
  buildTour,
  scoreAsOfDay,
  isInProgress,
  rankThen,
  rankNow,
  buildTourLog,
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

  it('skips null-score stops when looking back', () => {
    expect(scoreAsOfDay(S2024, 35)).toBe(74);
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

const S2022: SeasonScores = {
  year: '2022',
  endDate: '2022-08-13',
  placement: 3,
  scores: [
    { date: '2022-06-25', location: 'Akron, OH', score: 70 },
    { date: '2022-07-20', location: 'San Antonio, TX', score: 85 },
    { date: '2022-08-13', location: 'Indianapolis, IN', score: 90 },
  ],
};

const S2023: SeasonScores = {
  year: '2023',
  endDate: '2023-08-12',
  placement: 2,
  scores: [
    { date: '2023-06-24', location: 'Akron, OH', score: 72 },
    { date: '2023-07-19', location: 'San Antonio, TX', score: 88 },
    { date: '2023-08-12', location: 'Indianapolis, IN', score: 93 },
  ],
};

const ALL = [S2022, S2023, S2024, S2025_INPROGRESS];

describe('rankThen / rankNow', () => {
  it('rankThen counts only seasons before the given year', () => {
    // At 21 days out, 2024 scored 91. Among prior seasons (2022→85, 2023→88)
    // none reached 91, so it was #1 at the time.
    expect(rankThen(ALL, '2024', 21, 91)).toBe(1);
  });

  it('rankNow counts all other seasons, including later ones', () => {
    // 2025 reaches 92 by 22 days out, which beats 91 → 2024 drops to #2 now.
    expect(rankNow(ALL, 21, 91, '2024')).toBe(2);
  });
});

describe('buildTourLog', () => {
  it('attaches ranks to numeric rows and leaves null rows unranked', () => {
    const log = buildTourLog(ALL, S2024);
    const row21 = log.find((r) => r.daysBeforeFinals === 21)!;
    expect(row21.rankThen).toBe(1);
    expect(row21.rankNow).toBe(2);
    const exhibition = log.find((r) => r.score === null)!;
    expect(exhibition.rankThen).toBeNull();
    expect(exhibition.rankNow).toBeNull();
  });
});
