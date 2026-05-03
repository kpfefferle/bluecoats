import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import {
  buildDailyRankings,
  currentDayUntilFinals,
  maxDayBeforeFinals,
} from '../../src/lib/utils/daily-rankings';
import type { SeasonScores } from '../../src/lib/data/base';

const SEASON_2023: SeasonScores = {
  year: '2023',
  endDate: '2023-08-12',
  scores: [
    { date: '2023-06-22', location: 'Akron, OH', score: 70.0 },
    { date: '2023-07-15', location: 'Atlanta, GA', score: 85.0 },
    { date: '2023-08-12', location: 'Indianapolis, IN', score: 92.5 },
  ],
};

const SEASON_2024: SeasonScores = {
  year: '2024',
  endDate: '2024-08-10',
  scores: [
    { date: '2024-06-21', location: 'Akron, OH', score: 65.0 },
    { date: '2024-07-13', location: 'Atlanta, GA', score: 92.5 },
    { date: '2024-08-10', location: 'Indianapolis, IN', score: 95.0 },
  ],
};

const SEASON_2025: SeasonScores = {
  year: '2025',
  endDate: '2025-08-09',
  scores: [
    { date: '2025-07-12', location: 'Atlanta, GA', score: 80.0 },
    { date: '2025-08-09', location: 'Indianapolis, IN', score: 90.0 },
  ],
};

describe('buildDailyRankings', () => {
  it('returns [] when no seasons match', () => {
    expect(buildDailyRankings([], 0)).toEqual([]);
  });

  it('on Finals Day, ranks seasons by their finals score descending', () => {
    const ranked = buildDailyRankings(
      [SEASON_2023, SEASON_2024, SEASON_2025],
      0,
    );
    expect(ranked.map((r) => [r.rank, r.year, r.score])).toEqual([
      [1, '2024', 95.0],
      [2, '2023', 92.5],
      [3, '2025', 90.0],
    ]);
  });

  it('shares ranks on ties and skips numbers after the tie', () => {
    // At day 28, latest qualifying scores are:
    //   2023: 7/15 (28d before finals) → 85.0
    //   2024: 7/13 (28d before finals) → 92.5
    //   2025: 7/12 (28d before finals) → 80.0
    const tieSeason: SeasonScores = {
      year: '2099',
      endDate: '2099-08-10',
      scores: [{ date: '2099-07-13', location: 'Tied, ZZ', score: 92.5 }],
    };
    const ranked = buildDailyRankings(
      [SEASON_2023, SEASON_2024, SEASON_2025, tieSeason],
      28,
    );
    expect(ranked.map((r) => [r.rank, r.year, r.score])).toEqual([
      [1, '2024', 92.5],
      [1, '2099', 92.5],
      [3, '2023', 85.0],
      [4, '2025', 80.0],
    ]);
  });

  it('drops seasons whose scores all fall after the selected day', () => {
    // 2025's earliest score is 28 days before finals.
    // selectedDay=40 means "show what we knew with ≥40 days to go" — 2025 had no scores yet.
    const ranked = buildDailyRankings(
      [SEASON_2023, SEASON_2024, SEASON_2025],
      40,
    );
    // 2023's only qualifying score (70.0) outranks 2024's (65.0); 2025 has none.
    expect(ranked.map((r) => r.year)).toEqual(['2023', '2024']);
  });

  it('reports daysOld when the latest qualifying score is older than the selected day', () => {
    // selectedDay=40: 2024's latest qualifying score is 6/21 (50 days before finals)
    // daysOld = 50 - 40 = 10
    const ranked = buildDailyRankings([SEASON_2024], 40);
    expect(ranked).toHaveLength(1);
    expect(ranked[0].daysOld).toBe(10);
    expect(ranked[0].location).toBe('Akron, OH');
  });

  it('reports daysOld of 0 when the latest score lands on the selected day', () => {
    // selectedDay=0 → finals day → 2024's latest score IS the finals score
    const ranked = buildDailyRankings([SEASON_2024], 0);
    expect(ranked[0].daysOld).toBe(0);
  });

  it('ignores entries whose score is null', () => {
    const partial: SeasonScores = {
      year: '2026',
      endDate: '2026-08-08',
      scores: [
        { date: '2026-07-25', location: 'Atlanta, GA', score: 88.0 },
        { date: '2026-08-08', location: 'Indianapolis, IN', score: null },
      ],
    };
    const ranked = buildDailyRankings([partial], 0);
    expect(ranked).toHaveLength(1);
    expect(ranked[0].score).toBe(88.0);
    expect(ranked[0].location).toBe('Atlanta, GA');
  });
});

describe('currentDayUntilFinals', () => {
  beforeEach(() => {
    vi.useFakeTimers();
  });
  afterEach(() => {
    vi.useRealTimers();
  });

  it('returns 0 when there are no seasons', () => {
    expect(currentDayUntilFinals([], 60)).toBe(0);
  });

  it('returns 0 when every finals date has passed', () => {
    vi.setSystemTime(new Date('2025-09-01T12:00:00Z'));
    expect(currentDayUntilFinals([SEASON_2025], 60)).toBe(0);
  });

  it('returns the days remaining until the next upcoming finals', () => {
    // 30 days before 2025-08-09 → 2025-07-10
    vi.setSystemTime(new Date('2025-07-10T12:00:00Z'));
    expect(currentDayUntilFinals([SEASON_2025], 60)).toBe(30);
  });

  it('pivots to the next season once the prior finals has passed', () => {
    const SEASON_2026: SeasonScores = {
      year: '2026',
      endDate: '2026-08-08',
      scores: [],
    };
    // 30 days before 2026-08-08 → 2026-07-09
    vi.setSystemTime(new Date('2026-07-09T12:00:00Z'));
    expect(currentDayUntilFinals([SEASON_2025, SEASON_2026], 60)).toBe(30);
  });

  it('falls back to 0 when the next finals is further away than maxDay', () => {
    const SEASON_2026: SeasonScores = {
      year: '2026',
      endDate: '2026-08-08',
      scores: [],
    };
    // Off-season: 2025 finals just passed, 2026 finals is ~360 days out.
    vi.setSystemTime(new Date('2025-08-15T12:00:00Z'));
    expect(currentDayUntilFinals([SEASON_2025, SEASON_2026], 60)).toBe(0);
  });

  it('returns 0 on the exact finals date', () => {
    // Midnight at the start of finals day — diff is ~0 days, ceil to 0.
    vi.setSystemTime(new Date('2025-08-09T00:00:00Z'));
    expect(currentDayUntilFinals([SEASON_2025], 60)).toBe(0);
  });

  it('picks the earliest upcoming finals when multiple are in the future', () => {
    const SEASON_2026: SeasonScores = {
      year: '2026',
      endDate: '2026-08-08',
      scores: [],
    };
    const SEASON_2027: SeasonScores = {
      year: '2027',
      endDate: '2027-08-14',
      scores: [],
    };
    // 30 days before 2026-08-08; 2027 finals is much further out.
    vi.setSystemTime(new Date('2026-07-09T12:00:00Z'));
    expect(
      currentDayUntilFinals([SEASON_2025, SEASON_2026, SEASON_2027], 60),
    ).toBe(30);
  });

  it('falls back to 0 when maxDay is 0', () => {
    // No populated seasons → maxDay is 0; any future finals exceeds the bound.
    vi.setSystemTime(new Date('2025-07-10T12:00:00Z'));
    expect(currentDayUntilFinals([SEASON_2025], 0)).toBe(0);
  });
});

describe('maxDayBeforeFinals', () => {
  it('returns the longest season span across seasons', () => {
    // 2023: 6/22 → 8/12 = 51 days
    // 2024: 6/21 → 8/10 = 50 days
    // 2025: 7/12 → 8/9  = 28 days
    expect(maxDayBeforeFinals([SEASON_2023, SEASON_2024, SEASON_2025])).toBe(
      51,
    );
  });

  it('skips seasons with no scores', () => {
    const empty: SeasonScores = {
      year: '1979',
      endDate: '1979-08-12',
      scores: [],
    };
    expect(maxDayBeforeFinals([empty, SEASON_2025])).toBe(28);
  });

  it('ignores trailing entries whose score is null', () => {
    const partial: SeasonScores = {
      year: '2026',
      endDate: '2026-08-08',
      scores: [
        { date: '2026-07-25', location: 'Atlanta, GA', score: 90.0 },
        { date: '2026-08-08', location: 'Indianapolis, IN', score: null },
      ],
    };
    // Should measure from 2026-07-25 (14 days).
    expect(maxDayBeforeFinals([partial])).toBe(14);
  });

  it('returns 0 when no seasons have any scored entries', () => {
    const empty: SeasonScores = {
      year: '2026',
      endDate: '2026-08-08',
      scores: [
        { date: '2026-08-08', location: 'Indianapolis, IN', score: null },
      ],
    };
    expect(maxDayBeforeFinals([empty])).toBe(0);
  });
});
