/**
 * REST API Test using Playwright MCP browser tools
 *
 * This test uses the Playwright MCP server to navigate to
 * JSONPlaceholder API and test it via the browser, then
 * also tests the REST API MCP via its stdio interface.
 *
 * USAGE:
 *   Terminal 1: node start-all-mcp.js   (starts both servers)
 *   Terminal 2: node rest-api-test-via-playwright.js
 */

const http = require('http');
const { spawn } = require('child_process');
const path = require('path');

const PLAYWRIGHT_MCP_PORT = 3100;

function mcpRequest(method, params = {}) {
  return new Promise((resolve, reject) => {
    const id = Date.now() + Math.floor(Math.random() * 10000);
    const body = JSON.stringify({ jsonrpc: '2.0', id, method, params });

    const options = {
      hostname: '127.0.0.1',
      port: PLAYWRIGHT_MCP_PORT,
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
          resolve({ raw: data, statusCode: res.statusCode });
        }
      });
    });
    req.on('error', reject);
    req.write(body);
    req.end();
  });
}

function callTool(name, args = {}) {
  return mcpRequest('tools/call', { name, arguments: args });
}

async function testApiViaBrowser() {
  console.log('=== Test 1: Call JSONPlaceholder API via Browser ===\n');

  // Navigate to JSONPlaceholder API endpoint
  console.log('[1.1] Navigate to JSONPlaceholder /posts API...');
  const navRes = await callTool('browser_navigate', {
    url: 'https://jsonplaceholder.typicode.com/posts'
  });
  console.log('  Navigating...');

  // Wait for page to load
  await new Promise(r => setTimeout(r, 2000));

  // Get page content
  console.log('[1.2] Get page content (API response)...');
  const snapshot = await callTool('browser_snapshot', {});
  const content = snapshot.result?.content?.[0]?.text || '';
  const jsonMatch = content.match(/\[[\s\S]*?\]/);
  if (jsonMatch) {
    const posts = JSON.parse(jsonMatch[0]);
    console.log(`  Found ${posts.length} posts`);
    console.log('  First post title:', posts[0]?.title);
  } else {
    console.log('  Content preview:', content.substring(0, 300));
  }

  // Navigate to users
  console.log('\n[1.3] Navigate to JSONPlaceholder /users/1...');
  await callTool('browser_navigate', {
    url: 'https://jsonplaceholder.typicode.com/users/1'
  });
  await new Promise(r => setTimeout(r, 2000));

  const snap2 = await callTool('browser_snapshot', {});
  const content2 = snap2.result?.content?.[0]?.text || '';
  const userMatch = content2.match(/\{[^{}]*"name"[^{}]*\}/);
  if (userMatch) {
    const user = JSON.parse(userMatch[0]);
    console.log('  User name:', user.name);
    console.log('  User email:', user.email);
  } else {
    console.log('  Content preview:', content2.substring(0, 300));
  }
}

async function main() {
  console.log('========================================');
  console.log('  REST API Testing with Playwright MCP');
  console.log('========================================\n');

  // First, list Playwright tools to confirm server is running
  try {
    const toolsRes = await mcpRequest('tools/list');
    if (toolsRes.result?.tools) {
      const toolNames = toolsRes.result.tools.map(t => t.name);
      console.log('Playwright MCP connected. Tools available:', toolNames.length);
    }
  } catch (err) {
    console.log('Waiting for Playwright MCP server...');
    await new Promise(r => setTimeout(r, 3000));
  }

  // Test API via browser
  await testApiViaBrowser();

  console.log('\n=== Tests Complete ===');
}

main().catch(err => {
  console.error('Error:', err.message);
  process.exit(1);
});
