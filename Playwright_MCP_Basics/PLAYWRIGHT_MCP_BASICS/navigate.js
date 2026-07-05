const { chromium } = require('playwright');

(async () => {
  console.log('Launching browser...');
  const browser = await chromium.launch({ headless: false });
  console.log('Browser launched');
  const page = await browser.newPage();
  console.log('Navigating to app.vwo.com...');
  await page.goto('https://app.vwo.com', { timeout: 30000 });
  console.log('Page title:', await page.title());
  console.log('Browser should be open now');
})();