import { test, expect } from '@playwright/test';
import { EvincedSDK } from '@evinced/js-playwright-sdk';

// Test 1: simple navigation to the home page.
// The home page has only one state, so one snapshot scan (evAnalyze) is enough.
test('home page loads and is scanned for accessibility issues', async ({ page }) => {
  // Connect Evinced to the browser page Playwright controls
  const evinced = new EvincedSDK(page);

  // Open the site
  await page.goto('https://a11y-audits.com/');

  // Check we really are on the home page
  await expect(page).toHaveTitle(/Love & Minter/);

  // Scan the page for accessibility issues
  const issues = await evinced.evAnalyze();
  console.log(`Home page: ${issues.length} accessibility issues found`);

  // Save the results as an HTML report
  evinced.evSaveFile(issues, 'html', 'evinced-reports/home-page.html');
});