import { error } from '@sveltejs/kit';
import { POPULATED_SEASONS } from '$data';
import {
  maxDayBeforeFinals,
  parseCanonicalDay,
} from '$lib/utils/daily-ranking';
import type { EntryGenerator, PageLoad } from './$types';

const MAX_DAY = maxDayBeforeFinals(POPULATED_SEASONS);

export const entries: EntryGenerator = () =>
  Array.from({ length: MAX_DAY + 1 }, (_, day) => ({ day: String(day) }));

export const load: PageLoad = ({ params }) => {
  const day = parseCanonicalDay(params.day, MAX_DAY);
  if (day === undefined) {
    error(404, `No day ${params.day}`);
  }
  return { day };
};
