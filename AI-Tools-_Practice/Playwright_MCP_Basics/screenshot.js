const { chromium } = require('playwright');

(async () => {
  console.log('Launching browser...');
  const browser = await chromium.launch({ headless: false });
  const page = await browser.newPage();
  
  console.log('Navigating to app.vwo.com...');
  await page.goto('https://app.vwo.com');
  
  console.log('Taking screenshot...');
  await page.screenshot({ path: 'login-page.png', fullPage: true });
  console.log('Screenshot saved to login-page.png');
  
  console.log('Closing browser...');
  await browser.close();
  console.log('Done');
})();