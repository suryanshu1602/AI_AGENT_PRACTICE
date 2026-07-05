/**
 * Unified MCP Server Launcher
 *
 * Starts both MCP servers:
 *   - Playwright MCP (port 3100) — browser automation
 *   - REST API MCP   (port 3101) — REST API testing via JSONPlaceholder
 */

const { spawn } = require('child_process');
const path = require('path');

console.log('=== Starting MCP Servers ===\n');

// 1. Start Playwright MCP (HTTP/SSE mode)
const pwServer = spawn('npx.cmd', [
  '@playwright/mcp@latest',
  '--port', '3100'
], {
  stdio: ['ignore', 'pipe', 'pipe'],
  shell: true,
  cwd: __dirname
});

pwServer.stdout.on('data', (data) => {
  console.log('[Playwright MCP]', data.toString().trim());
});

pwServer.stderr.on('data', (data) => {
  console.log('[Playwright MCP]', data.toString().trim());
});

pwServer.on('error', (err) => {
  console.error('[Playwright MCP] Failed to start:', err.message);
});

// 2. Start REST API MCP (stdio mode — launched as child process)
const restServer = spawn('node', [
  path.join(__dirname, 'node_modules', 'mcp-rest-api', 'build', 'cli.js'),
  '--config', path.join(__dirname, 'rest-api-config.json'),
  '--log', 'stdio'
], {
  stdio: ['pipe', 'pipe', 'pipe'],
  shell: false,
  cwd: __dirname
});

restServer.stdout.on('data', (data) => {
  console.log('[REST API MCP]', data.toString().trim());
});

restServer.stderr.on('data', (data) => {
  console.log('[REST API MCP]', data.toString().trim());
});

restServer.on('error', (err) => {
  console.error('[REST API MCP] Failed to start:', err.message);
});

// Wait for servers to start
setTimeout(() => {
  console.log('\n=== MCP Servers Running ===');
  console.log('  Playwright MCP: http://localhost:3100');
  console.log('  REST API MCP:   stdio (JSONPlaceholder)');
  console.log('\n  Available REST API tools:');
  console.log('    api_get_posts         - GET /posts');
  console.log('    api_get_post_comments - GET /posts/:id/comments');
  console.log('    api_create_post       - POST /posts');
  console.log('    api_get_users         - GET /users');
  console.log('    api_get_todos         - GET /todos');
  console.log('\n  Press Ctrl+C to stop all servers.\n');
}, 3000);

// Graceful shutdown
process.on('SIGINT', () => {
  console.log('\nShutting down servers...');
  pwServer.kill();
  restServer.kill();
  process.exit(0);
});

process.on('SIGTERM', () => {
  pwServer.kill();
  restServer.kill();
  process.exit(0);
});
