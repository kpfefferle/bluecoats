import { goto } from '$app/navigation';
import { page } from '$app/state';

export function setParam(key: string, value: string | null) {
  const url = new URL(page.url.href);
  if (value === null || value === '') {
    url.searchParams.delete(key);
  } else {
    url.searchParams.set(key, value);
  }
  return goto(url, { replace: true, reset: false });
}
