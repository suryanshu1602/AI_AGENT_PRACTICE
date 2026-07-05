/**
 * MCP Test Script — connects to the Playwright MCP server
 * and uses its tools to navigate, interact, and take screenshots.
 *
 * USAGE:
 *   Terminal 1: npx @playwright/mcp@latest --port 3100
 *   Terminal 2: node mcp-test.js
 */

const http = require('http');

const MCP_PORT = 3100;

function mcpRequest(method, params = {}) {
  return new Promise((resolve, reject) => {
    const id = Date.now() + Math.floor(Math.random() * 10000);
    const body = JSON.stringify({ jsonrpc: '2.0', id, method, params });

    const options = {
      hostname: '127.0.0.1',
      port: MCP_PORT,
      path: '/mcp',
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Content-Length': Buffer.byteLength(body)
      }
    };

    const req = http.request(options, (res) => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => {
        try {
          resolve(JSON.parse(data));
        } catch {
          resolve({ raw: data });
        }
      });
    });

    req.on('error', reject);
    req.write(body);
    req.end();
  });
}

async function runTest() {
  console.log('=== Playwright MCP Test ===\n');

  // 1. List available tools
  console.log('[1] Listing available tools...');
  const toolsRes = await mcpRequest('tools/list');
  if (toolsRes.result?.tools) {
    console.log('Available tools:', toolsRes.result.tools.map(t => t.name).join(', '));
  } else {
    console.log('Response:', JSON.stringify(toolsRes, null, 2));
  }

  // 2. Navigate to a page
  console.log('\n[2] Navigating to example.com...');
  const navRes = await mcpRequest('tools/call', {
    name: 'browser_navigate',
    arguments: { url: 'https://example.com' }
  });
  console.log('Navigation result:', navRes.result?.content?.[0]?.text || JSON.stringify(navRes));

  // 3. Take a snapshot of the page
  console.log('\n[3] Taking page snapshot...');
  const snapRes = await mcpRequest('tools/call', {
    name: 'browser_snapshot',
    arguments: {}
  });
  const snapshotText = snapRes.result?.content?.[0]?.text || '';
  console.log('Snapshot preview:', snapshotText.substring(0, 400));

  // 4. Click the first link (More information)
  console.log('\n[4] Clicking the first link...');
  const clickRes = await mcpRequest('tools/call', {
    name: 'browser_click',
    arguments: { element: 10 }
  });
  console.log('Click result:', clickRes.result?.content?.[0]?.text || JSON.stringify(clickRes));

  // 5. Wait and take another snapshot
  await new Promise(r => setTimeout(r, 2000));
  console.log('\n[5] Taking snapshot after navigation...');
  const snap2Res = await mcpRequest('tools/call', {
    name: 'browser_snapshot',
    arguments: {}
  });
  console.log('New page preview:', (snap2Res.result?.content?.[0]?.text || '').substring(0, 400));

  console.log('\n=== Test Complete ===');
}

runTest().catch(err => {
  console.error('Test failed:', err.message);
  console.log('\nMake sure the MCP server is running: npx @playwright/mcp@latest --port 3100');
});
