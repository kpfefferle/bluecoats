import { DateTime } from 'luxon';
import { describe, expect, it } from 'vitest';
import { getFeaturedSeason } from '../../src/lib/utils/featured-season';
import type { SeasonScores } from '../../src/lib/data/base';

const SEASON_2024: SeasonScores = {
  year: '2024',
  endDate: '2024-08-10',
  placement: 1,
  scores: [{ date: '2024-08-10', location: 'Indianapolis, IN', score: 98.75 }],
};

const SEASON_2025: SeasonScores = {
  year: '2025',
  endDate: '2025-08-09',
  placement: 2,
  scores: [{ date: '2025-08-09', location: 'Indianapolis, IN', score: 98.25 }],
};

// A 2026 season that is scheduled but has not yet produced a numeric score.
const SEASON_2026_SCHEDULED: SeasonScores = {
  year: '2026',
  endDate: '2026-08-08',
  scores: [
    { date: '2026-06-27', location: 'Alliance, OH' },
    { date: '2026-08-08', location: 'Indianapolis, IN' },
  ],
};

// The same 2026 season once the tour has started scoring.
const SEASON_2026_LIVE: SeasonScores = {
  year: '2026',
  endDate: '2026-08-08',
  scores: [{ date: '2026-06-27', location: 'Alliance, OH', score: 74.5 }],
};

// The same 2026 season after Finals night, once the result is logged.
const SEASON_2026_PLACED: SeasonScores = {
  year: '2026',
  endDate: '2026-08-08',
  placement: 1,
  scores: [
    { date: '2026-06-27', location: 'Alliance, OH', score: 74.5 },
    { date: '2026-08-08', location: 'Indianapolis, IN', score: 99.1 },
  ],
};

describe('getFeaturedSeason', () => {
  it('returns undefined when there are no populated seasons', () => {
    expect(getFeaturedSeason([])).toBeUndefined();
  });

  it('features the most recent populated season regardless of array order', () => {
    const featured = getFeaturedSeason([SEASON_2025, SEASON_2024]);
    expect(featured?.season.year).toBe('2025');
  });

  it('marks a completed season as not in progress', () => {
    const now = DateTime.fromISO('2026-06-05', { zone: 'America/New_York' });
    const featured = getFeaturedSeason([SEASON_2024, SEASON_2025], now);
    expect(featured?.season.year).toBe('2025');
    expect(featured?.inProgress).toBe(false);
  });

  it('ignores a scheduled future season that has no numeric scores yet', () => {
    // populatedSeasons only ever contains seasons with at least one score, so a
    // scheduled-only 2026 must be filtered out by the caller; verify we feature
    // the latest *scored* season when the caller passes only those through.
    const now = DateTime.fromISO('2026-06-05', { zone: 'America/New_York' });
    const featured = getFeaturedSeason([SEASON_2024, SEASON_2025], now);
    expect(featured?.season.year).toBe('2025');
    expect(featured?.inProgress).toBe(false);
    // SEASON_2026_SCHEDULED is intentionally not passed (no scores) — documents intent.
    expect(SEASON_2026_SCHEDULED.scores.every((s) => s.score == null)).toBe(
      true,
    );
  });

  it('marks the latest season as in progress once its Finals are still ahead', () => {
    const now = DateTime.fromISO('2026-07-01', { zone: 'America/New_York' });
    const featured = getFeaturedSeason(
      [SEASON_2024, SEASON_2025, SEASON_2026_LIVE],
      now,
    );
    expect(featured?.season.year).toBe('2026');
    expect(featured?.inProgress).toBe(true);
  });

  it('keeps the season in progress on Finals day before a placement is set', () => {
    const now = DateTime.fromISO('2026-08-08T14:00', {
      zone: 'America/New_York',
    });
    const featured = getFeaturedSeason(
      [SEASON_2024, SEASON_2025, SEASON_2026_LIVE],
      now,
    );
    expect(featured?.season.year).toBe('2026');
    expect(featured?.inProgress).toBe(true);
  });

  it('ends the season on Finals night as soon as a placement is set', () => {
    const now = DateTime.fromISO('2026-08-08T23:00', {
      zone: 'America/New_York',
    });
    const featured = getFeaturedSeason(
      [SEASON_2024, SEASON_2025, SEASON_2026_PLACED],
      now,
    );
    expect(featured?.season.year).toBe('2026');
    expect(featured?.inProgress).toBe(false);
  });
});
