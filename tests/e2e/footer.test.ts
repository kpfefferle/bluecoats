import { expect, test } from '@playwright/test';

test('the root layout renders the shared footer', async ({ page }) => {
  await page.goto('/daily-ranking');
  const footer = page.locator('footer');
  await expect(footer.getByText(/© \d{4} Kevin Pfefferle/)).toBeVisible();
  await expect(footer.getByText('Independent alumni archive')).toBeVisible();
  const github = footer.getByRole('link', { name: 'GitHub' });
  await expect(github).toBeVisible();
  await expect(github).toHaveAttribute(
    'href',
    'https://github.com/kpfefferle/bluecoats',
  );
});
