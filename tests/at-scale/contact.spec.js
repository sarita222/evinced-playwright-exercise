// Another ordinary test - scanned automatically via the fixture.
import { test, expect } from '../../fixtures/evinced.js';

test('contact page shows the contact form', async ({ page }) => {
  await page.goto('https://a11y-audits.com/');
  await page.getByRole('navigation').first().getByRole('link', { name: 'Contact' }).click();
  await expect(page).toHaveURL(/pages\/contact/);
  await expect(page.locator('form[action*="contact"]').first()).toBeVisible();
});