import { error } from '@sveltejs/kit';
import { POPULATED_SEASONS } from '$data';
import { maxDayBeforeFinals } from '$lib/utils/daily-ranking';
import type { EntryGenerator, PageLoad } from './$types';

const MAX_DAY = maxDayBeforeFinals(POPULATED_SEASONS);

export const entries: EntryGenerator = () =>
  Array.from({ length: MAX_DAY + 1 }, (_, day) => ({ day: String(day) }));

export const load: PageLoad = ({ params }) => {
  const day = Number(params.day);
  // Canonical non-negative integers only: rejects "banana", "07", "-1",
  // "3.5", and anything beyond the earliest first-show day.
  if (
    !Number.isInteger(day) ||
    day < 0 ||
    day > MAX_DAY ||
    String(day) !== params.day
  ) {
    error(404, `No day ${params.day}`);
  }
  return { day };
};
