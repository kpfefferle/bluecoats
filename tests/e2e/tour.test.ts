import { expect, test } from '@playwright/test';

test('renders the default season tour log', async ({ page }) => {
  await page.goto('/tour');
  // Default season is the most recent populated one; its heading is "<year> · <show>".
  await expect(page.getByRole('heading', { name: /·/ })).toBeVisible();
  await expect(page.getByText('Tour log · every show')).toBeVisible();
  // The tour log has at least one show row.
  await expect(page.locator('tbody tr').first()).toBeVisible();
});

test('year param drives the season and the picker updates the URL', async ({
  page,
}) => {
  await page.goto('/tour?year=2024');
  await expect(page).toHaveURL(/[?&]year=2024\b/);
  await expect(page.getByRole('heading', { name: /^2024 ·/ })).toBeVisible();
  // Jump to 2023 via the scrubber tick (aria-label "2023 season").
  await page.getByRole('button', { name: '2023 season' }).click();
  await expect(page).toHaveURL(/[?&]year=2023\b/);
  await expect(page.getByRole('heading', { name: /^2023 ·/ })).toBeVisible();
});

test('renders a season with same-date shows (doubleheader) without crashing', async ({
  page,
}) => {
  // 1986 has prelims+finals on the same date — a duplicate-key hazard that
  // previously blanked the page. The heading and table rows must render.
  await page.goto('/tour?year=1986');
  await expect(page.getByRole('heading', { name: /^1986 ·/ })).toBeVisible();
  const rows = page.locator('tbody tr');
  expect(await rows.count()).toBeGreaterThan(0);
});
