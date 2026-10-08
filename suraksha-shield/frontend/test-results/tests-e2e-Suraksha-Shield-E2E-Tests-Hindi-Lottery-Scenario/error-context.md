# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: tests\e2e.spec.ts >> Suraksha Shield E2E Tests >> Hindi Lottery Scenario
- Location: tests\e2e.spec.ts:31:3

# Error details

```
Test timeout of 30000ms exceeded.
```

```
Error: locator.click: Test timeout of 30000ms exceeded.
Call log:
  - waiting for getByRole('button', { name: 'संदेश का विश्लेषण करें' })

```

# Page snapshot

```yaml
- generic [ref=e3]:
  - link "Skip to main content" [ref=e4] [cursor=pointer]:
    - /url: "#main-content"
  - banner [ref=e5]:
    - link "Suraksha Shield Vernacular Fraud Shield" [ref=e6] [cursor=pointer]:
      - /url: /
      - generic [ref=e10]:
        - generic [ref=e11]: Suraksha Shield
        - generic [ref=e12]: Vernacular Fraud Shield
    - navigation [ref=e13]:
      - link "होम" [ref=e14] [cursor=pointer]:
        - /url: /
      - button "स्कैन करें" [ref=e16] [cursor=pointer]
      - link "सीखें" [ref=e19] [cursor=pointer]:
        - /url: /learn
      - link "इतिहास" [ref=e20] [cursor=pointer]:
        - /url: /history
      - link "About" [ref=e21] [cursor=pointer]:
        - /url: /about
    - generic [ref=e22]:
      - generic [ref=e23]:
        - button "EN" [ref=e24] [cursor=pointer]
        - button "ಕನ್ನಡ" [ref=e25] [cursor=pointer]
        - button "हिंदी" [ref=e26] [cursor=pointer]
      - button "Enable audio guide" [ref=e27] [cursor=pointer]
      - button "Toggle light or dark theme" [ref=e32] [cursor=pointer]
      - button "Toggle large text mode" [ref=e35] [cursor=pointer]: Aa
      - link "Check a Message" [ref=e36] [cursor=pointer]:
        - /url: /scan/message
  - main [ref=e37]:
    - generic [ref=e38]:
      - heading "Check a Message" [level=1] [ref=e39]
      - paragraph [ref=e40]: Paste any suspicious SMS, email text, or WhatsApp message below. We will never save your message.
      - generic [ref=e41]:
        - button "Fake KYC" [ref=e42] [cursor=pointer]
        - button "Lottery" [ref=e43] [cursor=pointer]
        - button "Normal Alert" [ref=e44] [cursor=pointer]
        - button "Kannada Scam" [ref=e45] [cursor=pointer]
        - button "Hindi Scam" [active] [ref=e46] [cursor=pointer]
      - generic [ref=e47]:
        - generic [ref=e48]:
          - textbox "Paste your message here..." [ref=e49]: प्रिय ग्राहक, आपका बैंक खाता आज ब्लॉक कर दिया जाएगा। तुरंत KYC पूरा करें.
          - generic [ref=e50]:
            - button "Start voice typing" [ref=e51] [cursor=pointer]: Dictate
            - generic [ref=e55]: 73 / 1000
        - generic [ref=e56]:
          - button "Clear" [ref=e57] [cursor=pointer]
          - button "Analyze Message" [ref=e58] [cursor=pointer]
  - contentinfo [ref=e59]:
    - generic [ref=e60]:
      - generic [ref=e61]:
        - generic [ref=e62]:
          - generic [ref=e63]: Suraksha Shield (ಸುರಕ್ಷಾ ಶೀಲ್ಡ್ / सुरक्षा शील्ड)
          - paragraph [ref=e67]: केवल शैक्षिक उद्देश्यों के लिए। किसी बैंक या सरकारी एजेंसी से कोई संबंध नहीं।
          - generic [ref=e68]: "गोपनीयता: हम आपके संदेश, चित्र या व्यक्तिगत विवरण कभी भी सहेजते नहीं हैं।"
        - generic [ref=e73]:
          - generic [ref=e74]: Official Cyber Fraud Reporting
          - paragraph [ref=e80]:
            - text: "Call National Helpline:"
            - strong [ref=e81]: "1930"
          - paragraph [ref=e82]:
            - text: "Official Portal:"
            - link "cybercrime.gov.in" [ref=e83] [cursor=pointer]:
              - /url: https://cybercrime.gov.in
        - generic [ref=e88]:
          - generic [ref=e89]: Navigation
          - link "Home" [ref=e90] [cursor=pointer]:
            - /url: /
          - link "Scan Message" [ref=e91] [cursor=pointer]:
            - /url: /scan/message
          - link "Learn Center" [ref=e92] [cursor=pointer]:
            - /url: /learn
          - link "History" [ref=e93] [cursor=pointer]:
            - /url: /history
          - link "About & Privacy" [ref=e94] [cursor=pointer]:
            - /url: /about
      - generic [ref=e95]:
        - generic [ref=e96]:
          - text: "Languages available:"
          - strong [ref=e97]: English
          - text: •
          - strong [ref=e98]: ಕನ್ನಡ (Kannada)
          - text: •
          - strong [ref=e99]: हिंदी (Hindi)
        - generic [ref=e100]: Built with accessible fintech standards. No government or banking affiliation claimed.
```

# Test source

```ts
  1  | import { test, expect } from '@playwright/test';
  2  | 
  3  | test.describe('Suraksha Shield E2E Tests', () => {
  4  |   const viewports = [
  5  |     { width: 360, height: 640 },
  6  |     { width: 390, height: 844 },
  7  |     { width: 768, height: 1024 },
  8  |     { width: 1024, height: 768 },
  9  |     { width: 1440, height: 900 }
  10 |   ];
  11 | 
  12 |   test('Homepage visually correct', async ({ page }) => {
  13 |     await page.goto('http://localhost:5173');
  14 |     await expect(page.locator('h1').first()).toBeVisible();
  15 |     for (const v of viewports) {
  16 |       await page.setViewportSize(v);
  17 |       await page.waitForTimeout(500);
  18 |       await page.screenshot({ path: `tests/screenshots/home-${v.width}px.png` });
  19 |     }
  20 |   });
  21 | 
  22 |   test('English KYC Scenario', async ({ page }) => {
  23 |     await page.goto('http://localhost:5173/scan/message');
  24 |     await page.getByRole('button', { name: 'Fake KYC' }).click();
  25 |     await page.getByRole('button', { name: 'Analyze Message' }).click();
  26 |     await page.waitForURL('**/results/*');
  27 |     await expect(page.locator('text=High Risk')).toBeVisible();
  28 |     await page.screenshot({ path: 'tests/screenshots/en-kyc-result.png', fullPage: true });
  29 |   });
  30 | 
  31 |   test('Hindi Lottery Scenario', async ({ page }) => {
  32 |     await page.goto('http://localhost:5173/scan/message');
  33 |     // Change language to hi
  34 |     await page.getByRole('button', { name: 'हिंदी' }).click();
  35 |     await page.getByRole('button', { name: 'Hindi Scam' }).click();
> 36 |     await page.locator('button[type="submit"]').click();
     |                                                                        ^ Error: locator.click: Test timeout of 30000ms exceeded.
  37 |     await page.waitForURL('**/results/*');
  38 |     await page.screenshot({ path: 'tests/screenshots/hi-lottery-result.png', fullPage: true });
  39 |   });
  40 |   
  41 |   test('UPI Collect Scenario', async ({ page }) => {
  42 |     await page.goto('http://localhost:5173/scan/upi');
  43 |     await page.getByRole('button', { name: 'Analyze Request' }).click();
  44 |     await page.waitForURL('**/results/*');
  45 |     await expect(page.locator('text=High Risk')).toBeVisible();
  46 |     await page.screenshot({ path: 'tests/screenshots/upi-collect-result.png', fullPage: true });
  47 |   });
  48 | 
  49 |   test('Kannada OTP Theft Scenario', async ({ page }) => {
  50 |     await page.goto('http://localhost:5173/scan/message');
  51 |     await page.getByRole('button', { name: 'ಕನ್ನಡ' }).click();
  52 |     await page.getByRole('button', { name: 'Kannada Scam' }).click();
  53 |     await page.locator('button[type="submit"]').click();
  54 |     await page.waitForURL('**/results/*');
  55 |     await page.screenshot({ path: 'tests/screenshots/kn-otp-theft-result.png', fullPage: true });
  56 |   });
  57 | 
  58 |   test('Payment Alert (Safe) Scenario', async ({ page }) => {
  59 |     await page.goto('http://localhost:5173/scan/message');
  60 |     await page.getByRole('button', { name: 'EN' }).click();
  61 |     await page.getByRole('button', { name: 'Normal Alert' }).click();
  62 |     await page.getByRole('button', { name: 'Analyze Message' }).click();
  63 |     await page.waitForURL('**/results/*');
  64 |     await expect(page.locator('text=Safe')).toBeVisible();
  65 |     await page.screenshot({ path: 'tests/screenshots/en-safe-alert-result.png', fullPage: true });
  66 |   });
  67 | 
  68 |   test('Screenshot OCR Scenario', async ({ page }) => {
  69 |     await page.goto('http://localhost:5173/scan/image');
  70 |     // Since we can't easily upload a file in the simple test without a fixture, we'll use the fallback button
  71 |     // which simulates the text extraction.
  72 |     await page.evaluate(() => {
  73 |       // Simulate file selection to reveal the Extract Text button
  74 |       const fileInput = document.querySelector('input[type="file"]');
  75 |       if (fileInput) {
  76 |         Object.defineProperty(fileInput, 'files', {
  77 |           value: [new File([''], 'dummy.png', { type: 'image/png' })]
  78 |         });
  79 |         fileInput.dispatchEvent(new Event('change', { bubbles: true }));
  80 |       }
  81 |     });
  82 |     // Let React update
  83 |     await page.waitForTimeout(500);
  84 |     // If the extract button appears, click it
  85 |     const extractBtn = page.getByRole('button', { name: 'Extract Text' });
  86 |     if (await extractBtn.isVisible()) {
  87 |       await extractBtn.click();
  88 |       await page.getByRole('button', { name: 'Analyze Text' }).click();
  89 |       await page.waitForURL('**/results/*');
  90 |       await page.screenshot({ path: 'tests/screenshots/ocr-result.png', fullPage: true });
  91 |     }
  92 |   });
  93 | 
  94 | });
  95 | 
```