import { DateTime } from 'luxon';
import type { Score, SeasonScores } from '$data/base';
import { FINALS_ZONE } from './time';

export interface DailyRankingItem {
  daysOld: number;
  location: Score['location'];
  placement: SeasonScores['placement'];
  rank: number;
  score: number;
  show: SeasonScores['show'];
  year: SeasonScores['year'];
}

function rankingsItemForSelectedDay(
  season: SeasonScores,
  selectedDay: number,
): Omit<DailyRankingItem, 'rank'> | undefined {
  const finalsDateTime = DateTime.fromISO(season.endDate, {
    zone: FINALS_ZONE,
  });
  const scores = season.scores.filter((score) => {
    if (typeof score.score !== 'number') return false;
    const scoreDateTime = DateTime.fromISO(score.date, { zone: FINALS_ZONE });
    const daysToFinals = Math.ceil(
      finalsDateTime.diff(scoreDateTime, 'days').days,
    );
    return daysToFinals >= selectedDay;
  });
  const latestScore = scores.at(-1);
  if (latestScore === undefined || typeof latestScore.score !== 'number') {
    return undefined;
  }
  return {
    daysOld:
      Math.ceil(
        finalsDateTime.diff(
          DateTime.fromISO(latestScore.date, { zone: FINALS_ZONE }),
          'days',
        ).days,
      ) - selectedDay,
    location: latestScore.location,
    placement: season.placement,
    score: latestScore.score,
    show: season.show,
    year: season.year,
  };
}

export function buildDailyRankings(
  seasons: SeasonScores[],
  selectedDay: number,
): DailyRankingItem[] {
  const sorted = seasons
    .map((season) => rankingsItemForSelectedDay(season, selectedDay))
    .filter(
      (item): item is Omit<DailyRankingItem, 'rank'> => item !== undefined,
    )
    .sort((a, b) => b.score - a.score);
  return sorted.map((item) => {
    const firstMatchingScoreIndex = sorted.findIndex(
      (s) => s.score === item.score,
    );
    return { rank: firstMatchingScoreIndex + 1, ...item };
  });
}

export function currentDayUntilFinals(
  seasons: SeasonScores[],
  maxDay: number,
): number {
  const now = DateTime.now().setZone(FINALS_ZONE);
  const upcomingFinals = seasons
    .map((season) => DateTime.fromISO(season.endDate, { zone: FINALS_ZONE }))
    .filter((finalsDate) => finalsDate >= now)
    .sort((a, b) => a.toMillis() - b.toMillis())[0];
  if (!upcomingFinals) return 0;
  const days = Math.ceil(upcomingFinals.diff(now, 'days').days);
  return days > maxDay ? 0 : days;
}

export function currentSeasonYear(seasons: SeasonScores[]): string | undefined {
  if (seasons.length === 0) return undefined;
  return seasons.reduce((newest, season) =>
    Number(season.year) > Number(newest.year) ? season : newest,
  ).year;
}

export function maxDayBeforeFinals(seasons: SeasonScores[]): number {
  const seasonDays = seasons
    .map((season) => {
      const firstScored = season.scores.find(
        ({ score }) => typeof score === 'number',
      );
      if (!firstScored) return undefined;
      const firstScoreDate = DateTime.fromISO(firstScored.date, {
        zone: FINALS_ZONE,
      });
      const finalsDate = DateTime.fromISO(season.endDate, {
        zone: FINALS_ZONE,
      });
      return finalsDate.diff(firstScoreDate, 'days').days;
    })
    .filter((days): days is number => days !== undefined);
  if (seasonDays.length === 0) return 0;
  return Math.max(...seasonDays);
}

/**
 * Human label for a "days before Finals" value. The last three days of the
 * season are DCI championship rounds: Prelims (2 days out), Semis (1 day
 * out), Finals (day 0).
 */
export function dayRankingLabel(day: number): string {
  if (day === 0) return 'Finals';
  if (day === 1) return 'Semis';
  if (day === 2) return 'Prelims';
  return `Day ${day}`;
}

/**
 * Parse a raw day param (from /daily-ranking/[day] or a legacy ?day= query)
 * into a day number. Canonical non-negative integers only: rejects null,
 * "banana", "07", "-1", "3.5", and anything beyond maxDay.
 */
export function parseCanonicalDay(
  raw: string | null,
  maxDay: number,
): number | undefined {
  if (raw === null) return undefined;
  const day = Number(raw);
  if (
    !Number.isInteger(day) ||
    day < 0 ||
    day > maxDay ||
    String(day) !== raw
  ) {
    return undefined;
  }
  return day;
}
