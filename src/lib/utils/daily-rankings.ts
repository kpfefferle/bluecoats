import { DateTime } from 'luxon';
import type { Score, SeasonScores } from '$data/base';

export interface DailyRankingsItem {
  daysOld: number;
  location: Score['location'];
  rank: number;
  score: number;
  year: SeasonScores['year'];
}

function rankingsItemForSelectedDay(
  season: SeasonScores,
  selectedDay: number,
): Omit<DailyRankingsItem, 'rank'> | undefined {
  const finalsDateTime = DateTime.fromISO(season.endDate);
  const scores = season.scores.filter((score) => {
    if (score.score === null) return false;
    const scoreDateTime = DateTime.fromISO(score.date);
    const daysToFinals = Math.ceil(
      finalsDateTime.diff(scoreDateTime, 'days').days,
    );
    return daysToFinals >= selectedDay;
  });
  const latestScore = scores.at(-1);
  if (latestScore === undefined || latestScore.score === null) return undefined;
  return {
    daysOld:
      Math.ceil(
        finalsDateTime.diff(DateTime.fromISO(latestScore.date), 'days').days,
      ) - selectedDay,
    location: latestScore.location,
    score: latestScore.score,
    year: season.year,
  };
}

export function buildDailyRankings(
  seasons: SeasonScores[],
  selectedDay: number,
): DailyRankingsItem[] {
  const sorted = seasons
    .map((season) => rankingsItemForSelectedDay(season, selectedDay))
    .filter(
      (item): item is Omit<DailyRankingsItem, 'rank'> => item !== undefined,
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
  const now = DateTime.now();
  const upcomingFinals = seasons
    .map((season) => DateTime.fromISO(season.endDate))
    .filter((finalsDate) => finalsDate >= now)
    .sort((a, b) => a.toMillis() - b.toMillis())[0];
  if (!upcomingFinals) return 0;
  const days = Math.ceil(upcomingFinals.diff(now, 'days').days);
  return days > maxDay ? 0 : days;
}

export function maxDayBeforeFinals(seasons: SeasonScores[]): number {
  const seasonDays = seasons
    .map((season) => {
      const firstScored = season.scores.find(({ score }) => score !== null);
      if (!firstScored) return undefined;
      const firstScoreDate = DateTime.fromISO(firstScored.date);
      const finalsDate = DateTime.fromISO(season.endDate);
      return finalsDate.diff(firstScoreDate, 'days').days;
    })
    .filter((days): days is number => days !== undefined);
  if (seasonDays.length === 0) return 0;
  return Math.max(...seasonDays);
}
