import { error } from '@sveltejs/kit';
import { POPULATED_SEASONS } from '$data';
import type { EntryGenerator, PageLoad } from './$types';

export const entries: EntryGenerator = () =>
  POPULATED_SEASONS.map((season) => ({ year: season.year }));

export const load: PageLoad = ({ params }) => {
  const season = POPULATED_SEASONS.find((s) => s.year === params.year);
  if (!season) {
    error(404, `No ${params.year} season`);
  }
  return { season };
};
