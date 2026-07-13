import { describe, expect, it } from 'vitest';
import {
  SITE_ORIGIN,
  SITE_NAME,
  OG_IMAGE_PATH,
  siteTitle,
  absoluteUrl,
} from '../../src/lib/utils/seo';

describe('siteTitle', () => {
  it('appends the site name to a page title', () => {
    expect(siteTitle('Score History')).toBe('Score History | Bluecoats Scores');
  });

  it('does not duplicate the site name for the home title', () => {
    expect(siteTitle(SITE_NAME)).toBe('Bluecoats Scores');
  });
});

describe('absoluteUrl', () => {
  it('joins the origin and a root path', () => {
    expect(absoluteUrl('/')).toBe('https://bluecoatsscores.com/');
  });

  it('joins the origin and a nested path', () => {
    expect(absoluteUrl('/tour/2024')).toBe(
      'https://bluecoatsscores.com/tour/2024',
    );
  });

  it('builds the OG image URL from the exported path', () => {
    expect(absoluteUrl(OG_IMAGE_PATH)).toBe(
      'https://bluecoatsscores.com/og-image.png',
    );
  });

  it('has no trailing slash on the origin', () => {
    expect(SITE_ORIGIN.endsWith('/')).toBe(false);
  });
});
