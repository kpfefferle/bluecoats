import { expect, test, type Page } from '@playwright/test';

const ORIGIN = 'https://bluecoatsscores.com';

function meta(page: Page, selector: string) {
  return page.locator(selector).getAttribute('content');
}

test('home page emits description, canonical, and og tags', async ({
  page,
}) => {
  await page.goto('/');
  await expect(page).toHaveTitle('Bluecoats Scores');
  expect(await meta(page, 'meta[name="description"]')).toBeTruthy();
  expect(await page.locator('link[rel="canonical"]').getAttribute('href')).toBe(
    `${ORIGIN}/`,
  );
  expect(await meta(page, 'meta[property="og:image"]')).toBe(
    `${ORIGIN}/og-image.png`,
  );
  expect(await meta(page, 'meta[name="twitter:card"]')).toBe(
    'summary_large_image',
  );
  expect(await meta(page, 'meta[property="og:image:width"]')).toBe('1200');
  expect(await meta(page, 'meta[property="og:image:height"]')).toBe('630');
  expect(await meta(page, 'meta[property="og:image:alt"]')).toBeTruthy();
  expect(await meta(page, 'meta[name="twitter:image:alt"]')).toBeTruthy();
});

test('score history canonical matches its path', async ({ page }) => {
  await page.goto('/score-history');
  await expect(page).toHaveTitle('Score History | Bluecoats Scores');
  expect(await page.locator('link[rel="canonical"]').getAttribute('href')).toBe(
    `${ORIGIN}/score-history`,
  );
});

test('a tour page interpolates the year into its metadata', async ({
  page,
}) => {
  await page.goto('/tour/2024');
  await expect(page).toHaveTitle('2024 Tour | Bluecoats Scores');
  expect(await page.locator('link[rel="canonical"]').getAttribute('href')).toBe(
    `${ORIGIN}/tour/2024`,
  );
  expect(await meta(page, 'meta[name="description"]')).toContain('2024');
});

test('the error page is marked noindex', async ({ page }) => {
  const res = await page.goto('/this-route-does-not-exist');
  expect(res?.status()).toBe(404);
  await expect(page.locator('meta[name="robots"]')).toHaveAttribute(
    'content',
    'noindex',
  );
});

test('sitemap.xml lists canonical pages and no redirect stubs', async ({
  request,
}) => {
  const res = await request.get('/sitemap.xml');
  expect(res.status()).toBe(200);
  expect(res.headers()['content-type']).toContain('xml');
  const body = await res.text();
  expect(body).toContain('https://bluecoatsscores.com/score-history</loc>');
  expect(body).toContain('https://bluecoatsscores.com/tour/2024</loc>');
  // redirect stubs must not appear as their own <loc>
  expect(body).not.toContain('bluecoatsscores.com/tour</loc>');
  expect(body).not.toContain('bluecoatsscores.com/daily-ranking</loc>');
});
