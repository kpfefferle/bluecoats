import { expect, test } from '@playwright/test';

function selectedYears(url: string): string | null {
  return new URL(url).searchParams.get('years');
}

test('renders the chart and the decade season picker', async ({ page }) => {
  await page.goto('/');
  await expect(
    page.getByRole('heading', { name: 'Score History' }),
  ).toBeVisible();
  // ECharts renders into a <canvas> inside the chart container
  await expect(page.locator('canvas')).toBeVisible();
  // Season picker exposes each year as a toggle button
  await expect(page.getByRole('button', { name: '2014' })).toBeVisible();
});

test('toggling a year pill adds and removes it from the URL', async ({
  page,
}) => {
  await page.goto('/');
  await page.getByRole('button', { name: '2014' }).click();
  await expect.poll(() => selectedYears(page.url())).toBe('2014');

  await page.getByRole('button', { name: '2014' }).click();
  await expect.poll(() => selectedYears(page.url())).toBeNull();
});

test('selecting multiple years records a sorted list in the URL', async ({
  page,
}) => {
  await page.goto('/');
  await page.getByRole('button', { name: '2016' }).click();
  await page.getByRole('button', { name: '2014' }).click();
  await expect.poll(() => selectedYears(page.url())).toBe('2014,2016');
});

test('reads selected years from the URL on load', async ({ page }) => {
  await page.goto('/?years=2016,2018');
  await expect(page.getByRole('button', { name: '2016' })).toHaveAttribute(
    'aria-pressed',
    'true',
  );
  await expect(page.getByRole('button', { name: '2018' })).toHaveAttribute(
    'aria-pressed',
    'true',
  );
  await expect(page.getByRole('button', { name: '2014' })).toHaveAttribute(
    'aria-pressed',
    'false',
  );
});
