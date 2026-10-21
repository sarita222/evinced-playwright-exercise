// Integrating Evinced into every test at scale.
// This "auto" fixture runs around every test that imports `test` from this file:
// it starts continuous scanning before the test and saves a report after it.
import { test as base, expect } from '@playwright/test';
import { EvincedSDK } from '@evinced/js-playwright-sdk';

export const test = base.extend({
  evinced: [
    async ({ page }, use, testInfo) => {
      // BEFORE each test
      const evinced = new EvincedSDK(page);
      await evinced.evStart();

      await use(evinced); // <-- the test itself runs here

      // AFTER each test
      const issues = await evinced.evStop();
      const reportPath = testInfo.outputPath('evinced-report.html');
      evinced.evSaveFile(issues, 'html', reportPath);
      await testInfo.attach('Evinced report', { path: reportPath, contentType: 'text/html' });
      console.log(`${testInfo.title}: ${issues.length} accessibility issues found`);
    },
    { auto: true }, // run for every test automatically
  ],
});

export { expect };