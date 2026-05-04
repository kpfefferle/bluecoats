import { DateTime } from 'luxon';
import type { SeasonScores } from '$data/base';
import { ALL_SEASONS_INCLUDING_SCHEDULED } from '$data';

const FINALS_ZONE = 'America/New_York';

export function nextFinalsSeason(
  seasons: SeasonScores[] = ALL_SEASONS_INCLUDING_SCHEDULED,
  now: DateTime = DateTime.now(),
): SeasonScores | undefined {
  const today = now.startOf('day');
  return seasons
    .filter(
      (season) =>
        DateTime.fromISO(season.endDate, { zone: FINALS_ZONE }) >= today,
    )
    .sort(
      (a, b) =>
        DateTime.fromISO(a.endDate, { zone: FINALS_ZONE }).toMillis() -
        DateTime.fromISO(b.endDate, { zone: FINALS_ZONE }).toMillis(),
    )[0];
}

export function daysToFinals(
  seasons: SeasonScores[] = ALL_SEASONS_INCLUDING_SCHEDULED,
  now: DateTime = DateTime.now(),
): number {
  const next = nextFinalsSeason(seasons, now);
  if (!next) return 0;
  const today = now.startOf('day');
  const finalsDate = DateTime.fromISO(next.endDate, { zone: FINALS_ZONE });
  return Math.max(0, Math.ceil(finalsDate.diff(today, 'days').days));
}
