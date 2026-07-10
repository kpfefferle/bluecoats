import { expect, test } from '@playwright/test';
import { POPULATED_SEASONS } from '../../src/lib/data';

test('/daily-ranking redirects to the current day', async ({ page }) => {
  await page.goto('/daily-ranking');
  await expect(page).toHaveURL(/\/daily-ranking\/\d+$/);
  await expect(
    page.getByRole('heading', { name: 'Daily ranking' }),
  ).toBeVisible();
  await expect(page.getByLabel('Days before Finals')).toBeVisible();
});

test('/daily-ranking issues a real server-side 302', async ({ request }) => {
  const res = await request.get('/daily-ranking?day=28', { maxRedirects: 0 });
  expect(res.status()).toBe(302);
  expect(res.headers()['location']).toMatch(/\/daily-ranking\/28$/);
});

test('legacy ?day= links redirect to that day page', async ({ page }) => {
  await page.goto('/daily-ranking?day=10');
  await expect(page).toHaveURL(/\/daily-ranking\/10$/);
  await expect(page.getByText(/Day 10 Leaderboard/)).toBeVisible();
});

test('an invalid ?day= falls back to the current day', async ({ page }) => {
  await page.goto('/daily-ranking?day=banana');
  await expect(page).toHaveURL(/\/daily-ranking\/\d+$/);
});

test('day 0 renders every ranked season with the Finals title', async ({
  page,
}) => {
  // Pinned to day 0 so every populated season is included regardless of the
  // calendar date (the same determinism rationale as the old suite).
  await page.goto('/daily-ranking/0');
  await expect(page).toHaveTitle('Finals Ranking | Bluecoats Scores');
  // One row per populated season — derived from the data so the assertion
  // stays exact when a new season records its first score.
  const rows = page.locator('tbody tr');
  await expect(rows).toHaveCount(POPULATED_SEASONS.length);
});

test('a day page has its own countdown title', async ({ page }) => {
  await page.goto('/daily-ranking/28');
  await expect(page).toHaveTitle('Day 28 Ranking | Bluecoats Scores');
});

test('chips navigate between day pages', async ({ page }) => {
  await page.goto('/daily-ranking/10');
  // Locate the chip by href, not label: the label reads "45d" except on the
  // one day a year when currentDay === 45, when it relabels to "Today".
  await page.locator('a[href="/daily-ranking/45"]').click();
  await expect(page).toHaveURL(/\/daily-ranking\/45$/);
  await expect(page.getByText(/Day 45 Leaderboard/)).toBeVisible();
});

test('the active chip is marked as the current page', async ({ page }) => {
  await page.goto('/daily-ranking/0');
  // Day 0's chip is always labeled "Finals" (never "Today").
  await expect(page.getByRole('link', { name: 'Finals' })).toHaveAttribute(
    'aria-current',
    'page',
  );
});

test('the last three days use championship round titles', async ({ page }) => {
  await page.goto('/daily-ranking/2');
  await expect(page).toHaveTitle('Prelims Ranking | Bluecoats Scores');
  await page.goto('/daily-ranking/1');
  await expect(page).toHaveTitle('Semis Ranking | Bluecoats Scores');
});

test('the slider navigates and replaces history', async ({ page }) => {
  // Two full loads create two history entries: [/28, /10].
  await page.goto('/daily-ranking/28');
  await page.goto('/daily-ranking/10');
  // Range input: value is negated days (min=-maxDay, max=0).
  await page.getByLabel('Days before Finals').fill('-7');
  await expect(page).toHaveURL(/\/daily-ranking\/7$/);
  await expect(page.getByText(/Day 7 Leaderboard/)).toBeVisible();
  // replaceState semantics: /7 replaced /10, so back lands on /28 — the /10
  // entry must be gone.
  await page.goBack();
  await expect(page).toHaveURL(/\/daily-ranking\/28$/);
});

for (const path of [
  '/daily-ranking/banana',
  '/daily-ranking/99',
  '/daily-ranking/07',
]) {
  test(`invalid day path ${path} returns 404`, async ({ page }) => {
    const response = await page.goto(path);
    expect(response?.status()).toBe(404);
  });
}

test('the Daily ranking nav item is highlighted on a day page', async ({
  page,
}) => {
  await page.goto('/daily-ranking/10');
  // Default viewport is desktop-width, so only the desktop nav link is visible.
  await expect(
    page.getByRole('link', { name: 'Daily ranking' }),
  ).toHaveAttribute('aria-current', 'page');
});
