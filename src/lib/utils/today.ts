import { DateTime } from 'luxon';
import type { SeasonScores } from '$data/base';
import { buildDailyRankings, type DailyRankingItem } from './daily-ranking';
import type { FeaturedSeason } from './featured-season';
import { FINALS_ZONE } from './time';
import { finalsScore } from './tour';

export interface LatestResult {
  date: string;
  location: string;
  name?: string;
  score: number;
}

/** The most recent numeric-scored entry of a season, else undefined. */
export function latestScoredEntry(
  season: SeasonScores,
): LatestResult | undefined {
  const scored = season.scores.filter(
    (s): s is typeof s & { score: number } => typeof s.score === 'number',
  );
  return scored.at(-1);
}

export interface BestFinals {
  year: string;
  score: number;
  show?: string;
}

/** The highest finals-night score across all seasons. */
export function bestFinals(seasons: SeasonScores[]): BestFinals | undefined {
  let best: BestFinals | undefined;
  for (const season of seasons) {
    const score = finalsScore(season);
    if (score === null) continue;
    if (!best || score > best.score) {
      best = { year: season.year, score, show: season.show };
    }
  }
  return best;
}

/** Whole calendar days elapsed since `date`, in the Finals time zone. */
export function daysAgo(date: string, now: DateTime = DateTime.now()): number {
  const then = DateTime.fromISO(date, { zone: FINALS_ZONE }).startOf('day');
  const today = now.setZone(FINALS_ZONE).startOf('day');
  return Math.max(0, Math.round(today.diff(then, 'days').days));
}

export interface TodayHeroData {
  year: string;
  show?: string;
  inProgress: boolean;
  latest: LatestResult;
  /** Rank of the featured season among all seasons as of `day`. */
  rank: number;
  totalSeasons: number;
  /** Up to two years ranked directly above the featured season, best first. */
  behindYears: string[];
  best?: BestFinals;
}

export interface TodayPageData {
  hero: TodayHeroData;
  /** Full leaderboard at `day`, best score first. */
  rankings: DailyRankingItem[];
}

/**
 * Everything the Today page derives from season data: hero stats plus the
 * day's leaderboard. Pass `day = 0` for a completed featured season (rank on
 * finals night) and the live days-until-finals while a tour is underway.
 * Returns undefined when the featured season has no score as of `day`.
 */
export function buildTodayPage(
  seasons: SeasonScores[],
  featured: FeaturedSeason,
  day: number,
): TodayPageData | undefined {
  const latest = latestScoredEntry(featured.season);
  if (!latest) return undefined;
  const rankings = buildDailyRankings(seasons, day);
  const index = rankings.findIndex(
    (item) => item.year === featured.season.year,
  );
  if (index === -1) return undefined;
  return {
    hero: {
      year: featured.season.year,
      show: featured.season.show,
      inProgress: featured.inProgress,
      latest,
      rank: rankings[index].rank,
      totalSeasons: rankings.length,
      behindYears: rankings
        .slice(Math.max(0, index - 2), index)
        .map((item) => item.year),
      best: bestFinals(seasons),
    },
    rankings,
  };
}
