import { expect, test } from '@playwright/test';

test('/tour redirects to the latest populated season', async ({ page }) => {
  await page.goto('/tour');
  await expect(page).toHaveURL(/\/tour\/\d{4}$/);
  await expect(page.getByRole('heading', { name: /·/ })).toBeVisible();
  await expect(page.getByText('Tour log · every show')).toBeVisible();
  await expect(page.locator('tbody tr').first()).toBeVisible();
});

test('legacy ?year= links redirect to that season page', async ({ page }) => {
  await page.goto('/tour?year=2010');
  await expect(page).toHaveURL(/\/tour\/2010$/);
  await expect(page.getByRole('heading', { name: /^2010 ·/ })).toBeVisible();
});

test('an unpopulated ?year= falls back to the latest season', async ({
  page,
}) => {
  // 1979 has no season data.
  await page.goto('/tour?year=1979');
  await expect(page).toHaveURL(/\/tour\/\d{4}$/);
  await expect(page).not.toHaveURL(/1979/);
});

test('a season page renders directly with its own title', async ({ page }) => {
  await page.goto('/tour/2024');
  await expect(page).toHaveTitle('2024 Tour | Bluecoats Scores');
  await expect(page.getByRole('heading', { name: /^2024 ·/ })).toBeVisible();
});

test('the picker navigates to another season page', async ({ page }) => {
  await page.goto('/tour/2024');
  // Jump to 2023 via the scrubber tick (aria-label "2023 season").
  // NOTE: this is a button in Task 1; Task 2 turns it into a link.
  await page.getByRole('button', { name: '2023 season' }).click();
  await expect(page).toHaveURL(/\/tour\/2023$/);
  await expect(page.getByRole('heading', { name: /^2023 ·/ })).toBeVisible();
});

test('renders a season with same-date shows (doubleheader) without crashing', async ({
  page,
}) => {
  // 1986 has prelims+finals on the same date — a duplicate-key hazard that
  // previously blanked the page. The heading and table rows must render.
  await page.goto('/tour/1986');
  await expect(page.getByRole('heading', { name: /^1986 ·/ })).toBeVisible();
  const rows = page.locator('tbody tr');
  expect(await rows.count()).toBeGreaterThan(0);
});

test('an unknown year returns 404', async ({ page }) => {
  const response = await page.goto('/tour/banana');
  expect(response?.status()).toBe(404);
});
