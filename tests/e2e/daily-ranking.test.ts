import { expect, test } from '@playwright/test';

test('renders rankings table and slider', async ({ page }) => {
  // Pin to day=0 so every populated season is included regardless of the
  // calendar date. Without a day param the page defaults to the current day
  // until the next finals, which early in a season surfaces only the few
  // seasons that had scored that early — making the row count time-dependent.
  await page.goto('/daily-ranking?day=0');
  await expect(
    page.getByRole('heading', { name: 'Daily ranking' }),
  ).toBeVisible();
  await expect(page.getByLabel('Days before Finals')).toBeVisible();
  // 46 ranked seasons means 46 data rows in the tbody
  const rows = page.locator('tbody tr');
  await expect(rows).toHaveCount(46);
});

test('day param drives the leaderboard and chips update the URL', async ({
  page,
}) => {
  await page.goto('/daily-ranking?day=10');
  await expect(page).toHaveURL(/[?&]day=10\b/);
  await expect(
    page.getByText(/Leaderboard at 10 days before Finals/),
  ).toBeVisible();
  await page.getByRole('button', { name: '45d' }).click();
  await expect(page).toHaveURL(/[?&]day=45\b/);
});
