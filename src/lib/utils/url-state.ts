import { goto } from '$app/navigation';
import { page } from '$app/state';

export function setParam(key: string, value: string | null) {
  const url = new URL(page.url);
  if (value === null || value === '') {
    url.searchParams.delete(key);
  } else {
    url.searchParams.set(key, value);
  }
  // eslint-disable-next-line svelte/no-navigation-without-resolve -- same-route nav, only query params change
  return goto(url, { replaceState: true, keepFocus: true, noScroll: true });
}
