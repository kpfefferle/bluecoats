import { redirect } from '@sveltejs/kit';
import { resolve } from '$app/paths';
import { POPULATED_SEASONS } from '$data';
import type { PageLoad } from './$types';

// This route alone is served dynamically (by the Cloudflare worker in
// production, by SvelteKit's preview/dev server locally) so it can read the
// query string of legacy /tour?year=YYYY links and issue a real HTTP redirect.
export const prerender = false;

export const load: PageLoad = ({ url }) => {
  const yearParam = url.searchParams.get('year');
  const target =
    POPULATED_SEASONS.find((s) => s.year === yearParam) ??
    POPULATED_SEASONS[POPULATED_SEASONS.length - 1];
  redirect(302, resolve('/tour/[year]', { year: target.year }));
};
