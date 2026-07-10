import { redirect } from '@sveltejs/kit';
import { resolve } from '$app/paths';
import { ALL_SEASONS_INCLUDING_SCHEDULED, POPULATED_SEASONS } from '$data';
import {
  currentDayUntilFinals,
  maxDayBeforeFinals,
  parseCanonicalDay,
} from '$lib/utils/daily-ranking';
import type { PageLoad } from './$types';

// Served dynamically (by the Cloudflare worker in production, by SvelteKit's
// preview/dev server locally). This cannot be prerendered: the default
// target depends on today's date via currentDayUntilFinals and changes
// daily with no deploy, and legacy /daily-ranking?day=N links need their
// query string read at request time.
export const prerender = false;

export const load: PageLoad = ({ url }) => {
  const maxDay = maxDayBeforeFinals(POPULATED_SEASONS);
  const day =
    parseCanonicalDay(url.searchParams.get('day'), maxDay) ??
    currentDayUntilFinals(ALL_SEASONS_INCLUDING_SCHEDULED, maxDay);
  redirect(302, resolve('/daily-ranking/[day]', { day: String(day) }));
};
