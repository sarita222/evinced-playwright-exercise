import { test, expect } from '@playwright/test';
import { EvincedSDK } from '@evinced/js-playwright-sdk';

// Test 2: a multi-step flow with validations - the "Book a Consultation" form.
// The page changes as we click (form opens, errors appear, steps switch), so we use
// continuous mode: evStart() scans every state until evStop().
test('book a consultation: validations, date/time step and review', async ({ page }) => {
  const evinced = new EvincedSDK(page);
  const dialog = page.getByRole('dialog');
  const nextStep2 = page.getByRole('button', { name: 'Go to Step 2' });
  const nextStep3 = page.getByRole('button', { name: 'Go to Step 3' });

  await page.goto('https://a11y-audits.com/');
  await evinced.evStart();

  await test.step('open the booking form', async () => {
    await page.getByRole('button', { name: 'Book a Consultation' }).click();
    await expect(dialog).toBeVisible();
    await expect(page.getByText('Contact information')).toBeVisible();
  });

  await test.step('empty form shows 3 error messages', async () => {
    // Next is marked aria-disabled="true" although it works (accessibility bug),
    // so Playwright treats it as disabled. force: true clicks it anyway.
    await nextStep2.click({ force: true });
    await expect(page.getByText('Full Name is required.')).toBeVisible();
    await expect(page.getByText('Please enter a valid email address.')).toBeVisible();
    await expect(page.getByText('Please enter a valid phone number.')).toBeVisible();
  });

  await test.step('invalid email is rejected', async () => {
    await page.getByRole('textbox', { name: 'Full Name *' }).fill('Ana Brocks');
    await page.locator('#email').fill('abc');
    // The phone field is wrongly labelled "Email Address" for screen readers,
    // so we find it by its id instead.
    await page.locator('#phone').fill('0537782903');
    await nextStep2.click({ force: true });
    await expect(page.getByText('Please enter a valid email address.')).toBeVisible();
    await expect(page.getByText('Full Name is required.')).toBeHidden();
  });

  await test.step('valid details open the date and time step', async () => {
    await page.locator('#email').fill('test@example.com');
    await nextStep2.click({ force: true });
    await expect(page.getByText('Select a Time')).toBeVisible();
    await expect(nextStep3).toBeDisabled(); // no time picked yet
  });

  let pickedTime;
  await test.step('picking a time enables Next', async () => {
    // Times change every day, so take the first one and remember it
    const firstTime = page.locator('.time-options label').first();
    pickedTime = await firstTime.innerText();
    await firstTime.click();
    await expect(nextStep3).toBeEnabled();
    await nextStep3.click();
  });

  await test.step('review step shows the entered details', async () => {
    const review = page.locator('#step-3');
    await expect(review).toBeVisible();
    await expect(review).toContainText('Ana Brocks');
    await expect(review).toContainText('test@example.com');
    await expect(review).toContainText('0537782903');
    await expect(review).toContainText(pickedTime);
  });

  await test.step('close the form without confirming', async () => {
    // We don't click Confirm: it's a public site we don't own
    await page.getByRole('button', { name: 'Close Modal' }).click();
    await expect(dialog).toBeHidden();
  });

  const issues = await evinced.evStop();
  console.log(`Booking flow: ${issues.length} accessibility issues found`);
  evinced.evSaveFile(issues, 'html', 'evinced-reports/booking-flow.html');
});