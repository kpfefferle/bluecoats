import { expect, test } from '@playwright/test';

test('the window scrolls and navigation resets to the top', async ({
  page,
}) => {
  // Score History is a tall page (the chart alone is 50rem), so the
  // document overflows the viewport and the window can scroll.
  await page.goto('/score-history');
  await expect(
    page.getByRole('heading', { name: 'Score History' }),
  ).toBeVisible();

  // Scrolling the WINDOW must actually move the page. With the old custom
  // scroll container, <html>/<body> were overflow-hidden, so window.scrollY
  // stayed 0 and this assertion failed.
  await page.evaluate(() => window.scrollTo(0, 600));
  await expect
    .poll(() => page.evaluate(() => window.scrollY))
    .toBeGreaterThan(0);

  // Client-side navigation should land at the top of the new page.
  await page.getByRole('link', { name: 'Today' }).click();
  await expect(page).toHaveURL(/\/$/);
  await expect.poll(() => page.evaluate(() => window.scrollY)).toBe(0);
});

test('the header stays pinned to the top while the page scrolls', async ({
  page,
}) => {
  await page.goto('/score-history');
  const header = page.getByRole('banner');
  await expect(header).toBeVisible();

  await page.evaluate(() => window.scrollTo(0, 600));
  await expect
    .poll(() => page.evaluate(() => window.scrollY))
    .toBeGreaterThan(0);

  // A sticky header keeps its top edge at the top of the viewport.
  const box = await header.boundingBox();
  expect(box).not.toBeNull();
  expect(box!.y).toBeLessThanOrEqual(1);
});
