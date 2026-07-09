import { DateTime } from 'luxon';
import { describe, expect, it } from 'vitest';
import {
  bestFinals,
  buildTodayPage,
  daysAgo,
  latestScoredEntry,
} from '../../src/lib/utils/today';
import type { SeasonScores } from '../../src/lib/data/base';

const SEASON_2024: SeasonScores = {
  year: '2024',
  endDate: '2024-08-10',
  show: 'Riffs and Revelations',
  placement: 2,
  scores: [
    { date: '2024-07-20', location: 'San Antonio, TX', score: 90.15 },
    { date: '2024-08-10', location: 'Indianapolis, IN', score: 98.75 },
  ],
};

const SEASON_2025: SeasonScores = {
  year: '2025',
  endDate: '2025-08-09',
  show: 'Tongue and Cheek',
  placement: 2,
  scores: [
    { date: '2025-07-19', location: 'San Antonio, TX', score: 89.4 },
    { date: '2025-08-09', location: 'Indianapolis, IN', score: 98.25 },
  ],
};

// In progress: two scored shows, an exhibition, and an unscored finals entry.
const SEASON_2026: SeasonScores = {
  year: '2026',
  endDate: '2026-08-08',
  show: 'Gravity & Grace',
  scores: [
    { date: '2026-06-27', location: 'Alliance, OH', score: null },
    {
      date: '2026-07-03',
      location: 'Sacramento, CA',
      name: 'DCI Capital Classic',
      score: 82.2,
    },
    {
      date: '2026-07-05',
      location: 'Stanford, CA',
      name: 'DCI West',
      score: 83.95,
    },
    { date: '2026-08-08', location: 'Indianapolis, IN' },
  ],
};

const SEASONS = [SEASON_2024, SEASON_2025, SEASON_2026];

describe('latestScoredEntry', () => {
  it('returns the most recent numeric-scored entry', () => {
    const latest = latestScoredEntry(SEASON_2026);
    expect(latest).toMatchObject({
      date: '2026-07-05',
      location: 'Stanford, CA',
      score: 83.95,
    });
  });

  it('returns undefined when a season has no numeric scores', () => {
    const scheduled: SeasonScores = {
      year: '2027',
      endDate: '2027-08-14',
      scores: [{ date: '2027-06-26', location: 'Alliance, OH' }],
    };
    expect(latestScoredEntry(scheduled)).toBeUndefined();
  });
});

describe('bestFinals', () => {
  it('returns the highest finals-night score across seasons', () => {
    expect(bestFinals(SEASONS)).toEqual({
      year: '2024',
      score: 98.75,
      show: 'Riffs and Revelations',
    });
  });

  it('ignores seasons that have not scored on finals night', () => {
    expect(bestFinals([SEASON_2026])).toBeUndefined();
  });
});

describe('daysAgo', () => {
  const now = DateTime.fromISO('2026-07-09T12:00:00', {
    zone: 'America/New_York',
  });

  it('counts whole calendar days since the date', () => {
    expect(daysAgo('2026-07-05', now)).toBe(4);
  });

  it('returns 0 for the same day', () => {
    expect(daysAgo('2026-07-09', now)).toBe(0);
  });

  it('clamps future dates to 0', () => {
    expect(daysAgo('2026-07-12', now)).toBe(0);
  });
});

describe('buildTodayPage', () => {
  it('ranks an in-progress featured season at the given day', () => {
    const result = buildTodayPage(
      SEASONS,
      { season: SEASON_2026, inProgress: true },
      21,
    );
    // At 21 days out: 2024 → 90.15, 2025 → 89.4, 2026 → 83.95 (its latest).
    expect(result?.hero).toMatchObject({
      year: '2026',
      show: 'Gravity & Grace',
      inProgress: true,
      rank: 3,
      totalSeasons: 3,
      behindYears: ['2024', '2025'],
      best: { year: '2024', score: 98.75 },
    });
    expect(result?.hero.latest).toMatchObject({
      score: 83.95,
      location: 'Stanford, CA',
    });
    expect(result?.rankings.map((r) => r.year)).toEqual([
      '2024',
      '2025',
      '2026',
    ]);
  });

  it('ranks a completed featured season on finals night (day 0)', () => {
    const result = buildTodayPage(
      SEASONS,
      { season: SEASON_2025, inProgress: false },
      0,
    );
    expect(result?.hero).toMatchObject({
      year: '2025',
      inProgress: false,
      rank: 2,
      behindYears: ['2024'],
    });
    expect(result?.hero.latest.score).toBe(98.25);
  });

  it('returns undefined when the featured season has no score by that day', () => {
    // At 45 days out no fixture season has produced a score yet.
    expect(
      buildTodayPage(SEASONS, { season: SEASON_2026, inProgress: true }, 45),
    ).toBeUndefined();
  });
});
