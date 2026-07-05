const { chromium } = require('playwright');

async function runMcpStyleTest() {
  console.log('Starting Playwright MCP Style Test\n');
  
  const browser = await chromium.launch({ headless: false });
  const context = await browser.newContext();
  const page = await context.newPage();

  const consoleMessages = [];
  page.on('console', msg => {
    if (msg.type() === 'error') {
      consoleMessages.push({ type: msg.type(), text: msg.text() });
    }
  });

  try {
    console.log('[browser_navigate] https://app.vwo.com');
    await page.goto('https://app.vwo.com', { waitUntil: 'networkidle' });
    console.log('Page title:', await page.title());
    await page.screenshot({ path: 'mcp-1-navigate.png', fullPage: true });

    console.log('\n[browser_type] Enter username');
    await page.locator('#login-username').fill('wronguser@example.com');
    await page.screenshot({ path: 'mcp-2-username.png' });

    console.log('[browser_type] Enter password');
    await page.locator('#login-password').fill('wrongpassword123');
    await page.screenshot({ path: 'mcp-3-password.png' });

    console.log('\n[browser_click] Click Sign in button');
    await page.locator('#js-login-btn').click();
    
    await page.waitForTimeout(3000);
    await page.screenshot({ path: 'mcp-4-after-submit.png' });

    let errorMessage = 'No error message found';
    const errorSelectors = ['.notification-message', '.toast-message', '.login-error-message', '[class*="error-message"]', '.message-error'];

    for (const selector of errorSelectors) {
      const el = page.locator(selector).first();
      const isVisible = await el.isVisible().catch(() => false);
      if (isVisible) {
        errorMessage = await el.textContent();
        console.log(`Error found (${selector}): "${errorMessage.trim()}"`);
        break;
      }
    }

    if (errorMessage === 'No error message found') {
      const pageText = await page.textContent('body');
      const errorKeywords = ['incorrect', 'invalid', 'failed', 'wrong', 'error'];
      
      for (const keyword of errorKeywords) {
        const idx = pageText.toLowerCase().indexOf(keyword);
        if (idx !== -1) {
          const start = Math.max(0, idx - 20);
          const end = Math.min(pageText.length, idx + 50);
          errorMessage = pageText.substring(start, end).trim();
          console.log(`Error found in page text: "${errorMessage}"`);
          break;
        }
      }
    }

    await page.screenshot({ path: 'mcp-5-final.png', fullPage: true });

    console.log('\n=== RESULT ===');
    console.log('Username: wronguser@example.com');
    console.log('Password: wrongpassword123');
    console.log('Error:', errorMessage);
    console.log('\nScreenshots: mcp-1-navigate.png to mcp-5-final.png');

  } catch (error) {
    console.error('Error:', error.message);
    await page.screenshot({ path: 'mcp-error.png' });
  }

  console.log('\nBrowser remains open for review...');
}

runMcpStyleTest();