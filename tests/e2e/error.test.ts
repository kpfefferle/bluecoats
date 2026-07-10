import { expect, test } from '@playwright/test';

test('an unknown path renders the branded 404 page', async ({ page }) => {
  const response = await page.goto('/definitely-not-a-page');
  expect(response?.status()).toBe(404);
  await expect(page).toHaveTitle('Page not found | Bluecoats Scores');
  await expect(
    page.getByRole('heading', { name: 'Page not found' }),
  ).toBeVisible();
  await expect(
    page.getByText('This page never made it past prelims.'),
  ).toBeVisible();
});

test('the error page keeps the nav with no active item', async ({ page }) => {
  await page.goto('/definitely-not-a-page');
  await expect(
    page.getByRole('navigation', { name: 'Primary' }).first(),
  ).toBeVisible();
  // page.route.id is null on error pages, so no nav item (or chip) is current.
  await expect(page.locator('[aria-current="page"]')).toHaveCount(0);
});

test('Back to Today returns home', async ({ page }) => {
  await page.goto('/definitely-not-a-page');
  await page.getByRole('link', { name: 'Back to Today →' }).click();
  await expect(page).toHaveURL(/^http:\/\/[^/]+\/$/);
});

test('an invalid tour year shows the branded 404', async ({ page }) => {
  await page.goto('/tour/banana');
  await expect(
    page.getByRole('heading', { name: 'Page not found' }),
  ).toBeVisible();
});
