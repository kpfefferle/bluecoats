import { expect, test } from '@playwright/test';

test('renders the hero, context chart, and closest-seasons card', async ({
  page,
}) => {
  await page.goto('/');
  await expect(page.getByRole('heading', { level: 1 })).toBeVisible();
  // ECharts renders into a <canvas> inside the chart card
  await expect(page.locator('canvas')).toBeVisible();
  await expect(
    page.getByRole('link', { name: 'Open full chart →' }),
  ).toBeVisible();
});

test('open full chart navigates to the score history page', async ({
  page,
}) => {
  await page.goto('/');
  await page.getByRole('link', { name: 'Open full chart →' }).click();
  await expect(page).toHaveURL(/\/score-history$/);
  await expect(
    page.getByRole('heading', { name: 'Score History' }),
  ).toBeVisible();
});

test('view full ranking navigates to the daily ranking page', async ({
  page,
}) => {
  await page.goto('/');
  await page.getByRole('link', { name: 'View full ranking →' }).click();
  await expect(page).toHaveURL(/\/daily-ranking\/\d+$/);
  await expect(
    page.getByRole('heading', { name: 'Daily ranking' }),
  ).toBeVisible();
});

test('drops the delta column at phone width', async ({ page }) => {
  await page.setViewportSize({ width: 393, height: 852 });
  await page.goto('/');
  await expect(page.getByRole('columnheader', { name: /Δ vs\./ })).toBeHidden();
  await expect(page.getByRole('columnheader', { name: 'Score' })).toBeVisible();
});

test('hero shows a projection in season or the all-time best otherwise', async ({
  page,
}) => {
  await page.goto('/');
  await expect(
    page.getByText(/Projected finals score|All-time best finals score/),
  ).toBeVisible();
});
