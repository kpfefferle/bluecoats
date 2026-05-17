import { expect, test } from '@playwright/test';

test('renders rankings table and slider', async ({ page }) => {
  await page.goto('/daily-ranking');
  await expect(
    page.getByRole('heading', { name: 'Daily ranking' }),
  ).toBeVisible();
  await expect(page.getByLabel('Days before Finals')).toBeVisible();
  // 45 ranked seasons means 45 data rows in the tbody
  const rows = page.locator('tbody tr');
  await expect(rows).toHaveCount(45);
});

test('slider updates URL and "Reset to Today" clears it', async ({ page }) => {
  await page.goto('/daily-ranking?day=10');
  await expect(page).toHaveURL(/[?&]day=10\b/);
  await expect(
    page.getByText(/Leaderboard at 10 days before Finals/),
  ).toBeVisible();
  await page.getByRole('button', { name: 'Reset to Today' }).click();
  await expect(page).not.toHaveURL(/[?&]day=/);
});
