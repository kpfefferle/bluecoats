/** Canonical production origin (no trailing slash). */
export const SITE_ORIGIN = 'https://bluecoatsscores.com';

/** Human-readable site name, used as the title suffix and og:site_name. */
export const SITE_NAME = 'Bluecoats Scores';

/** Path (relative to the origin) of the static social share image. */
export const OG_IMAGE_PATH = '/og-image.png';

/**
 * Full document title for a page. The home page passes the bare site name and
 * must not become "Bluecoats Scores | Bluecoats Scores".
 */
export function siteTitle(title: string): string {
  return title === SITE_NAME ? SITE_NAME : `${title} | ${SITE_NAME}`;
}

/** Absolute URL for a root-relative pathname (e.g. "/tour/2024"). */
export function absoluteUrl(pathname: string): string {
  return `${SITE_ORIGIN}${pathname}`;
}
