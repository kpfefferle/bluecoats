import { DateTime } from 'luxon';
import type { SeasonScores } from '$data/base';
import { ALL_SEASONS_INCLUDING_SCHEDULED } from '$data';

export function nextFinalsSeason(
  seasons: SeasonScores[] = ALL_SEASONS_INCLUDING_SCHEDULED,
  now: DateTime = DateTime.now(),
): SeasonScores | undefined {
  const today = now.startOf('day');
  return seasons
    .filter(
      (season) =>
        DateTime.fromISO(season.endDate, { zone: 'America/New_York' }) >= today,
    )
    .sort(
      (a, b) =>
        DateTime.fromISO(a.endDate, { zone: 'America/New_York' }).toMillis() -
        DateTime.fromISO(b.endDate, { zone: 'America/New_York' }).toMillis(),
    )[0];
}

export function daysToFinals(
  seasons: SeasonScores[] = ALL_SEASONS_INCLUDING_SCHEDULED,
  now: DateTime = DateTime.now(),
): number {
  const next = nextFinalsSeason(seasons, now);
  if (!next) return 0;
  const today = now.startOf('day');
  const finalsDate = DateTime.fromISO(next.endDate, {
    zone: 'America/New_York',
  });
  return Math.max(0, Math.ceil(finalsDate.diff(today, 'days').days));
}
