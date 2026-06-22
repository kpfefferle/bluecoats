import { DateTime } from 'luxon';
import type { SeasonScores } from '$data/base';
import { FINALS_ZONE } from './time';

export interface TourStop {
  date: string;
  location: string;
  name?: string;
  daysBeforeFinals: number;
  /** `null` = competed with no registered score (e.g. exhibition). */
  score: number | null;
}

function daysBeforeFinals(season: SeasonScores, date: string): number {
  const finals = DateTime.fromISO(season.endDate, { zone: FINALS_ZONE });
  const day = DateTime.fromISO(date, { zone: FINALS_ZONE });
  return Math.ceil(finals.diff(day, 'days').days);
}

/**
 * Per-show records for a season, earliest → finals. Includes shows that were
 * competed with no registered score (`score: null`); excludes shows that have
 * not yet been competed (`score` omitted/`undefined`).
 */
export function buildTour(season: SeasonScores): TourStop[] {
  return season.scores
    .filter((s) => s.score === null || typeof s.score === 'number')
    .map((s) => ({
      date: s.date,
      location: s.location,
      name: s.name,
      daysBeforeFinals: daysBeforeFinals(season, s.date),
      score: s.score ?? null,
    }));
}

/** Latest numeric score with at least `day` days before finals, else null. */
export function scoreAsOfDay(season: SeasonScores, day: number): number | null {
  let result: number | null = null;
  for (const s of season.scores) {
    if (typeof s.score !== 'number') continue;
    if (daysBeforeFinals(season, s.date) >= day) result = s.score;
  }
  return result;
}

/** A season with both competed shows and still-scheduled (uncompeted) shows. */
export function isInProgress(season: SeasonScores): boolean {
  const hasScheduled = season.scores.some((s) => s.score === undefined);
  const hasNumeric = season.scores.some((s) => typeof s.score === 'number');
  return hasScheduled && hasNumeric;
}

export interface TourLogRow extends TourStop {
  /** Rank among seasons *before* this one at this day. `null` for null-score rows. */
  rankThen: number | null;
  /** Rank among *all other* seasons at this day. `null` for null-score rows. */
  rankNow: number | null;
}

function rankAmong(
  seasons: SeasonScores[],
  day: number,
  score: number,
): number {
  const ahead = seasons.filter((s) => {
    const peer = scoreAsOfDay(s, day);
    return peer !== null && peer > score;
  }).length;
  return ahead + 1;
}

/** Rank of `score` at `day` among seasons that came before `year`. */
export function rankThen(
  seasons: SeasonScores[],
  year: string,
  day: number,
  score: number,
): number {
  const peers = seasons.filter((s) => Number(s.year) < Number(year));
  return rankAmong(peers, day, score);
}

/** Rank of `score` at `day` among all seasons except `excludeYear`. */
export function rankNow(
  seasons: SeasonScores[],
  day: number,
  score: number,
  excludeYear: string,
): number {
  const peers = seasons.filter((s) => s.year !== excludeYear);
  return rankAmong(peers, day, score);
}

/** Per-show tour log for `season`, enriched with rank-then / rank-now. */
export function buildTourLog(
  seasons: SeasonScores[],
  season: SeasonScores,
): TourLogRow[] {
  return buildTour(season).map((stop) => {
    if (stop.score === null) {
      return { ...stop, rankThen: null, rankNow: null };
    }
    return {
      ...stop,
      rankThen: rankThen(
        seasons,
        season.year,
        stop.daysBeforeFinals,
        stop.score,
      ),
      rankNow: rankNow(seasons, stop.daysBeforeFinals, stop.score, season.year),
    };
  });
}
