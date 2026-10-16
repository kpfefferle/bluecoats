import type { Page } from '@playwright/test';

/**
 * Navigate and wait until SvelteKit has hydrated the page.
 *
 * `page.goto` resolves on the `load` event, but SvelteKit hydrates afterwards
 * (Kit 3 imports its app chunk only after the start chunk loads, leaving an
 * idle gap). Interactions with JS-only controls (range inputs, selects, toggle
 * buttons) in that gap hit elements with no handlers attached and are lost.
 * The root layout sets `data-hydrated` on <html> once hydration completes.
 */
export async function gotoHydrated(page: Page, url: string): Promise<void> {
  await page.goto(url);
  await page.locator('html[data-hydrated]').waitFor({ state: 'attached' });
}
