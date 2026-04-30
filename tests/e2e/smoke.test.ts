import { expect, test } from '@playwright/test';

test('home renders nav and stub heading', async ({ page }) => {
  await page.goto('/');
  await expect(
    page.getByRole('heading', { name: 'Score History' }),
  ).toBeVisible();
  await expect(
    page.getByRole('link', { name: 'Bluecoats Scores' }),
  ).toBeVisible();
});

test('daily-rankings renders nav and stub heading', async ({ page }) => {
  await page.goto('/daily-rankings');
  await expect(
    page.getByRole('heading', { name: 'Daily Rankings' }),
  ).toBeVisible();
});
