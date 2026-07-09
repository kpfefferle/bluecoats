import { DateTime } from 'luxon';
import type { SeasonScores } from '$data/base';
import { FINALS_ZONE } from './time';
import { finalsScore, scoreAsOfDay } from './tour';

/**
 * First season year of the training era. Scoring regimes drifted enormously
 * across decades (1980 finals: 52.05), so older seasons would poison the
 * climb distribution.
 */
export const PROJECTION_ERA_START = 2010;
/** Minimum qualifying peer seasons — below this the model returns null. */
export const MIN_PEER_SEASONS = 8;
/**
 * The all-time DCI record score. Additive climb can overshoot for a
 * record-pace season; the clamp keeps projections inside scores that have
 * actually existed.
 */
export const PROJECTION_CEILING = 99.65;

export interface ProjectedFinals {
  /** Projected finals score (clamped to PROJECTION_CEILING). */
  score: number;
  /** Where this score would land among every recorded Bluecoats finals score. */
  allTimeRank: number;
}

function median(values: number[]): number {
  const sorted = [...values].sort((a, b) => a - b);
  const mid = Math.floor(sorted.length / 2);
  return sorted.length % 2 ? sorted[mid] : (sorted[mid - 1] + sorted[mid]) / 2;
}

/**
 * The featured season's latest numeric score and its days-before-finals.
 * Kept local rather than importing `latestScoredEntry`: `today.ts` imports
 * this module, so importing back would create a cycle.
 */
function latestScoredDay(
  season: SeasonScores,
): { score: number; day: number } | null {
  const scored = season.scores.filter(
    (s): s is typeof s & { score: number } => typeof s.score === 'number',
  );
  const latest = scored.at(-1);
  if (!latest) return null;
  const finals = DateTime.fromISO(season.endDate, { zone: FINALS_ZONE });
  const date = DateTime.fromISO(latest.date, { zone: FINALS_ZONE });
  return {
    score: latest.score,
    day: Math.ceil(finals.diff(date, 'days').days),
  };
}

/**
 * Project the featured season's finals score from its latest result: the
 * score plus the median climb modern-era seasons managed from the same
 * days-before-finals. Anchored to the score's posted date, so the value only
 * moves when a new score posts. Returns null when the featured season has no
 * numeric score yet or fewer than MIN_PEER_SEASONS peers qualify.
 */
export function projectFinals(
  seasons: SeasonScores[],
  featured: SeasonScores,
): ProjectedFinals | null {
  const latest = latestScoredDay(featured);
  if (!latest) return null;
  const climbs = seasons
    .filter(
      (season) =>
        season.year !== featured.year &&
        Number(season.year) >= PROJECTION_ERA_START,
    )
    .map((season) => {
      const finals = finalsScore(season);
      const asOf = scoreAsOfDay(season, latest.day);
      return finals === null || asOf === null ? null : finals - asOf;
    })
    .filter((climb): climb is number => climb !== null);
  if (climbs.length < MIN_PEER_SEASONS) return null;
  const score = Math.min(latest.score + median(climbs), PROJECTION_CEILING);
  const allTimeRank =
    seasons.filter((season) => {
      if (season.year === featured.year) return false;
      const finals = finalsScore(season);
      return finals !== null && finals >= score;
    }).length + 1;
  return { score, allTimeRank };
}
