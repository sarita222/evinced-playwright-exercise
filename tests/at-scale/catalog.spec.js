// An ordinary test - no Evinced code. Only the import line is different:
// it uses our fixture, so the page is scanned automatically.
import { test, expect } from '../../fixtures/evinced.js';

test('catalog page lists products', async ({ page }) => {
  await page.goto('https://a11y-audits.com/');
  await page.getByRole('navigation').first().getByRole('link', { name: 'Catalog' }).click();
  await expect(page).toHaveURL(/collections\/all/);
  await expect(page.locator('a[href*="/products/"]').first()).toBeVisible();
});