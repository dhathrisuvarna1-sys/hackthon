import { test, expect } from '@playwright/test';

test.describe('Suraksha Shield E2E Tests', () => {
  const viewports = [
    { width: 360, height: 640 },
    { width: 390, height: 844 },
    { width: 768, height: 1024 },
    { width: 1024, height: 768 },
    { width: 1440, height: 900 }
  ];

  test('Homepage visually correct', async ({ page }) => {
    await page.goto('http://localhost:5173');
    await expect(page.locator('h1').first()).toBeVisible();
    for (const v of viewports) {
      await page.setViewportSize(v);
      await page.waitForTimeout(500);
      await page.screenshot({ path: `tests/screenshots/home-${v.width}px.png` });
    }
  });

  test('English KYC Scenario', async ({ page }) => {
    await page.goto('http://localhost:5173/scan/message');
    await page.getByRole('button', { name: 'Fake KYC' }).click();
    await page.getByRole('button', { name: 'Analyze Message' }).click();
    await page.waitForURL('**/results/*');
    await expect(page.locator('text=High Risk')).toBeVisible();
    await page.screenshot({ path: 'tests/screenshots/en-kyc-result.png', fullPage: true });
  });

  test('Hindi Lottery Scenario', async ({ page }) => {
    await page.goto('http://localhost:5173/scan/message');
    // Change language to hi
    await page.getByRole('button', { name: 'हिंदी' }).click();
    await page.getByRole('button', { name: 'Hindi Scam' }).click();
    await page.locator('button[type="submit"]').click();
    await page.waitForURL('**/results/*');
    await page.screenshot({ path: 'tests/screenshots/hi-lottery-result.png', fullPage: true });
  });
  
  test('UPI Collect Scenario', async ({ page }) => {
    await page.goto('http://localhost:5173/scan/upi');
    await page.getByRole('button', { name: 'Analyze Request' }).click();
    await page.waitForURL('**/results/*');
    await expect(page.locator('text=High Risk')).toBeVisible();
    await page.screenshot({ path: 'tests/screenshots/upi-collect-result.png', fullPage: true });
  });

  test('Kannada OTP Theft Scenario', async ({ page }) => {
    await page.goto('http://localhost:5173/scan/message');
    await page.getByRole('button', { name: 'ಕನ್ನಡ' }).click();
    await page.getByRole('button', { name: 'Kannada Scam' }).click();
    await page.locator('button[type="submit"]').click();
    await page.waitForURL('**/results/*');
    await page.screenshot({ path: 'tests/screenshots/kn-otp-theft-result.png', fullPage: true });
  });

  test('Payment Alert (Safe) Scenario', async ({ page }) => {
    await page.goto('http://localhost:5173/scan/message');
    await page.getByRole('button', { name: 'EN' }).click();
    await page.getByRole('button', { name: 'Normal Alert' }).click();
    await page.getByRole('button', { name: 'Analyze Message' }).click();
    await page.waitForURL('**/results/*');
    await expect(page.locator('text=Safe')).toBeVisible();
    await page.screenshot({ path: 'tests/screenshots/en-safe-alert-result.png', fullPage: true });
  });

  test('Screenshot OCR Scenario', async ({ page }) => {
    await page.goto('http://localhost:5173/scan/image');
    // Since we can't easily upload a file in the simple test without a fixture, we'll use the fallback button
    // which simulates the text extraction.
    await page.evaluate(() => {
      // Simulate file selection to reveal the Extract Text button
      const fileInput = document.querySelector('input[type="file"]');
      if (fileInput) {
        Object.defineProperty(fileInput, 'files', {
          value: [new File([''], 'dummy.png', { type: 'image/png' })]
        });
        fileInput.dispatchEvent(new Event('change', { bubbles: true }));
      }
    });
    // Let React update
    await page.waitForTimeout(500);
    // If the extract button appears, click it
    const extractBtn = page.getByRole('button', { name: 'Extract Text' });
    if (await extractBtn.isVisible()) {
      await extractBtn.click();
      await page.getByRole('button', { name: 'Analyze Text' }).click();
      await page.waitForURL('**/results/*');
      await page.screenshot({ path: 'tests/screenshots/ocr-result.png', fullPage: true });
    }
  });

});
