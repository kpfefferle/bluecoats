import { POPULATED_SEASONS } from '../data';
import { maxDayBeforeFinals } from './daily-ranking';
import { absoluteUrl } from './seo';

/**
 * Absolute URLs for every concrete, prerendered canonical page. Excludes the
 * `/tour` and `/daily-ranking` redirect stubs, which are not indexable pages.
 */
export function sitemapUrls(): string[] {
  const maxDay = maxDayBeforeFinals(POPULATED_SEASONS);
  const days = Array.from({ length: maxDay + 1 }, (_, day) => day);

  return [
    absoluteUrl('/'),
    absoluteUrl('/score-history'),
    ...POPULATED_SEASONS.map((season) => absoluteUrl(`/tour/${season.year}`)),
    ...days.map((day) => absoluteUrl(`/daily-ranking/${day}`)),
  ];
}
