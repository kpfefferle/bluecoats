import { DateTime } from 'luxon';
import type { SeasonScores } from '$data/base';
import { FINALS_ZONE } from './time';
import { ordinalSuffix } from './ordinal';

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

export interface TourSummary {
  seasonHigh: number | null;
  /** Last numeric score − first numeric score. */
  climb: number | null;
  /** Shows whose rank-now is 5 or better. */
  topFiveDays: number;
  /** Shows whose rank-now is exactly 1 (still the all-time best at that day). */
  allTimeBestDays: number;
  /** Finals-night score (day 0), or null if the season has not reached finals. */
  finalsScore: number | null;
  /** All-time rank of this season's finals score, or null when there is none. */
  finalsRank: number | null;
}

/** The numeric score on finals night (0 days before finals), else null. */
function finalsScore(season: SeasonScores): number | null {
  const finalsStops = buildTour(season).filter(
    (s) => s.daysBeforeFinals === 0 && s.score !== null,
  );
  return finalsStops.length ? finalsStops[finalsStops.length - 1].score : null;
}

/** Latest numeric score of the season, else null. */
function latestScore(season: SeasonScores): number | null {
  const numeric = season.scores.filter(
    (s): s is typeof s & { score: number } => typeof s.score === 'number',
  );
  return numeric.length ? numeric[numeric.length - 1].score : null;
}

/** Finals score when finished, otherwise the latest in-season score. */
export function finalsOrLatestScore(season: SeasonScores): number | null {
  return finalsScore(season) ?? latestScore(season);
}

function finalsRank(
  seasons: SeasonScores[],
  season: SeasonScores,
): number | null {
  const mine = finalsScore(season);
  if (mine === null) return null;
  const ahead = seasons.filter((s) => {
    if (s.year === season.year) return false;
    const other = finalsScore(s);
    // `>=` (not `>`): a season tied at the best-ever finals score does not get
    // sole credit for #1 — unlike the per-day rank-then/rank-now helpers, which
    // share a rank on ties. Intentional asymmetry for the all-time finals stat.
    return other !== null && other >= mine;
  }).length;
  return ahead + 1;
}

export function tourSummary(
  seasons: SeasonScores[],
  season: SeasonScores,
): TourSummary {
  const log = buildTourLog(seasons, season);
  const numeric = log.filter(
    (r): r is TourLogRow & { score: number } => r.score !== null,
  );
  if (numeric.length === 0) {
    return {
      seasonHigh: null,
      climb: null,
      topFiveDays: 0,
      allTimeBestDays: 0,
      finalsScore: null,
      finalsRank: null,
    };
  }
  return {
    seasonHigh: Math.max(...numeric.map((r) => r.score)),
    climb: numeric[numeric.length - 1].score - numeric[0].score,
    topFiveDays: numeric.filter((r) => r.rankNow !== null && r.rankNow <= 5)
      .length,
    allTimeBestDays: numeric.filter((r) => r.rankNow === 1).length,
    finalsScore: finalsScore(season),
    finalsRank: finalsRank(seasons, season),
  };
}

/** Human label for a DCI placement, or null when unplaced. */
export function placementLabel(placement: number | undefined): string | null {
  if (placement == null) return null;
  if (placement === 1) return 'DCI World Champion';
  if (placement === 2) return 'DCI Silver Medalist';
  if (placement === 3) return 'DCI Bronze Medalist';
  if (placement <= 6)
    return `Top 6 · ${placement}${ordinalSuffix(placement)} place`;
  if (placement <= 12)
    return `Top 12 · ${placement}${ordinalSuffix(placement)} place`;
  return `${placement}${ordinalSuffix(placement)} place`;
}
