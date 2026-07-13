import { describe, expect, it } from 'vitest';
import { sitemapUrls } from '../../src/lib/utils/sitemap';
import { POPULATED_SEASONS } from '../../src/lib/data';
import { maxDayBeforeFinals } from '../../src/lib/utils/daily-ranking';

const urls = sitemapUrls();

describe('sitemapUrls', () => {
  it('includes the home and score-history pages', () => {
    expect(urls).toContain('https://bluecoatsscores.com/');
    expect(urls).toContain('https://bluecoatsscores.com/score-history');
  });

  it('includes one URL per populated season tour page', () => {
    for (const season of POPULATED_SEASONS) {
      expect(urls).toContain(`https://bluecoatsscores.com/tour/${season.year}`);
    }
  });

  it('includes every daily-ranking day from 0 to maxDay', () => {
    const maxDay = maxDayBeforeFinals(POPULATED_SEASONS);
    expect(urls).toContain('https://bluecoatsscores.com/daily-ranking/0');
    expect(urls).toContain(
      `https://bluecoatsscores.com/daily-ranking/${maxDay}`,
    );
    expect(urls).not.toContain(
      `https://bluecoatsscores.com/daily-ranking/${maxDay + 1}`,
    );
  });

  it('excludes the redirect stubs', () => {
    expect(urls).not.toContain('https://bluecoatsscores.com/tour');
    expect(urls).not.toContain('https://bluecoatsscores.com/daily-ranking');
  });

  it('emits only absolute origin URLs', () => {
    expect(
      urls.every((u) => u.startsWith('https://bluecoatsscores.com/')),
    ).toBe(true);
  });
});
