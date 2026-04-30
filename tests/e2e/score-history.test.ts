import { expect, test } from '@playwright/test';

test('renders chart, season select, and fit-all toggle', async ({ page }) => {
  await page.goto('/');
  await expect(
    page.getByRole('heading', { name: 'Score History' }),
  ).toBeVisible();
  await expect(page.getByLabel('Season', { exact: true })).toBeVisible();
  await expect(page.getByLabel('Fit all seasons')).toBeVisible();
  // ECharts renders into a <canvas> inside the chart container
  await expect(page.locator('canvas')).toBeVisible();
});

test('selecting a year and toggling fitAll updates the URL', async ({
  page,
}) => {
  await page.goto('/');
  await page.getByLabel('Season', { exact: true }).selectOption('2014');
  await expect(page).toHaveURL(/[?&]years=2014\b/);

  await page.getByLabel('Fit all seasons').check();
  await expect(page).toHaveURL(/[?&]fitAll=true\b/);
});

test('reads selectedYears and fitAll from the URL on load', async ({
  page,
}) => {
  await page.goto('/?years=2018&fitAll=true');
  await expect(page.getByLabel('Season', { exact: true })).toHaveValue('2018');
  await expect(page.getByLabel('Fit all seasons')).toBeChecked();
});
