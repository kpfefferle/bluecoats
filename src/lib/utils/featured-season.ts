import { DateTime } from 'luxon';
import type { SeasonScores } from '$data/base';
import { FINALS_ZONE } from './time';

export interface FeaturedSeason {
  /** The season to highlight as the chart's protagonist. */
  season: SeasonScores;
  /**
   * True while a tour is underway: the season's Finals are still ahead *and* no
   * final placement has been recorded yet. The chart pins a "Today" marker to
   * the latest result only in this case.
   */
  inProgress: boolean;
}

/**
 * Pick the season to feature as the Score History chart's protagonist: the most
 * recent season that has competed. Pass `POPULATED_SEASONS` (already filtered to
 * seasons with at least one numeric score) so an upcoming, scores-yet schedule
 * doesn't get featured before the tour begins.
 */
export function getFeaturedSeason(
  populatedSeasons: SeasonScores[],
  now: DateTime = DateTime.now(),
): FeaturedSeason | undefined {
  if (populatedSeasons.length === 0) return undefined;

  const season = populatedSeasons.reduce((latest, candidate) =>
    candidate.year > latest.year ? candidate : latest,
  );

  // Finals night runs late: the season's end date is still "today" for hours
  // after the placement is announced, so a recorded placement — not the
  // calendar alone — is what ends the season.
  const finalsDate = DateTime.fromISO(season.endDate, { zone: FINALS_ZONE });
  const inProgress =
    season.placement == null && finalsDate >= now.startOf('day');

  return { season, inProgress };
}
