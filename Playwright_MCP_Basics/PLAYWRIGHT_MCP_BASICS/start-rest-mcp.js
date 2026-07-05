const { spawn } = require('child_process');

console.log('Starting REST API MCP server...');

const mcpProcess = spawn('npx.cmd', ['-y', 'dkmaker-mcp-rest-api'], {
  stdio: ['ignore', 'pipe', 'pipe'],
  shell: true,
  env: {
    ...process.env,
    'REST_BASE_URL': 'https://jsonplaceholder.typicode.com',
    'HEADER_Accept': 'application/json'
  }
});

mcpProcess.stdout.on('data', (data) => {
  console.log('REST MCP:', data.toString());
});

mcpProcess.stderr.on('data', (data) => {
  console.log('REST MCP Error:', data.toString());
});

setTimeout(() => {
  console.log('\nREST API MCP should be running on stdio...');
  console.log('Configure in your MCP client with:');
  console.log('  command: npx');
  console.log('  args: ["-y", "dkmaker-mcp-rest-api"]');
  console.log('  env: REST_BASE_URL=https://jsonplaceholder.typicode.com');
}, 3000);