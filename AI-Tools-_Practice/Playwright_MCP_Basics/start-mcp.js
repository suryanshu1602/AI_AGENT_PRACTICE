const { spawn } = require('child_process');
const http = require('http');

console.log('Starting Playwright MCP server...');

const mcpProcess = spawn('npx.cmd', ['@playwright/mcp@latest', '--port', '3100'], {
  stdio: ['ignore', 'pipe', 'pipe'],
  shell: true
});

mcpProcess.stdout.on('data', (data) => {
  console.log('MCP:', data.toString());
});

mcpProcess.stderr.on('data', (data) => {
  console.log('MCP Error:', data.toString());
});

setTimeout(() => {
  console.log('\nTesting MCP connection...');
  
  const requestData = JSON.stringify({
    jsonrpc: "2.0",
    method: "tools/list",
    id: 1
  });

  const options = {
    hostname: 'localhost',
    port: 3100,
    path: '/mcp',
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Content-Length': Buffer.byteLength(requestData)
    }
  };

  const req = http.request(options, (res) => {
    let data = '';
    res.on('data', (chunk) => { data += chunk; });
    res.on('end', () => {
      try {
        const response = JSON.parse(data);
        console.log('MCP Connected!');
        console.log('Available tools:', response.result?.tools?.map(t => t.name) || 'None');
      } catch (e) {
        console.log('Response:', data);
      }
    });
  });

  req.on('error', (e) => console.error('Error:', e.message));
  req.write(requestData);
  req.end();
  
  setTimeout(() => {
    console.log('\nMCP server is running. Press Ctrl+C to stop.');
  }, 2000);
  
}, 3000);