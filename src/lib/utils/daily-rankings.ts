import { DateTime } from 'luxon';
import type { Score, SeasonScores } from '$data/base';

export interface DailyRankingsItem {
  daysOld: number;
  location: Score['location'];
  rank: number;
  score: Score['score'];
  year: SeasonScores['year'];
}

function rankingsItemForSelectedDay(
  season: SeasonScores,
  selectedDay: number,
): Omit<DailyRankingsItem, 'rank'> | undefined {
  const finalsDateTime = DateTime.fromISO(season.endDate);
  const scores = season.scores.filter((score) => {
    const scoreDateTime = DateTime.fromISO(score.date);
    const daysToFinals = Math.ceil(
      finalsDateTime.diff(scoreDateTime, 'days').days,
    );
    return daysToFinals >= selectedDay;
  });
  const latestScore = scores.at(-1);
  if (latestScore === undefined) return undefined;
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

export function currentDayUntilFinals(seasons: SeasonScores[]): number {
  const latestSeason = seasons.at(-1);
  if (!latestSeason) return 0;
  const latestFinalsDate = DateTime.fromISO(latestSeason.endDate);
  const now = DateTime.now();
  if (now > latestFinalsDate) return 0;
  return Math.ceil(latestFinalsDate.diff(now, 'days').days);
}

export function maxDayBeforeFinals(seasons: SeasonScores[]): number {
  const seasonDays = seasons
    .map((season) => {
      const firstScore = season.scores[0];
      if (!firstScore) return undefined;
      const firstScoreDate = DateTime.fromISO(firstScore.date);
      const finalsDate = DateTime.fromISO(season.endDate);
      return finalsDate.diff(firstScoreDate, 'days').days;
    })
    .filter((days): days is number => days !== undefined);
  return Math.max(...seasonDays);
}
