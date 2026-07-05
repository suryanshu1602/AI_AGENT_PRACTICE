const { chromium } = require('playwright');  
(async () => {  
  const browser = await chromium.launch({ headless: false });  
  const page = await browser.newPage();  
  await page.goto('https://app.vwo.com');  
  await page.locator('#login-username').fill('wronguser@example.com');  
  await page.locator('#login-password').fill('wrongpassword123');  
  await page.locator('#js-login-btn').click();  
  await page.waitForTimeout(3000);  
  const errorEl = page.locator('text=did not match');  
  if (await errorEl.isVisible().catch(() => false)) {  
    console.log('Error:', await errorEl.textContent());  
  } else {  
    console.log((await page.locator('body').innerText()).substring(0,500));  
  }  
  await browser.close();  
})();  
