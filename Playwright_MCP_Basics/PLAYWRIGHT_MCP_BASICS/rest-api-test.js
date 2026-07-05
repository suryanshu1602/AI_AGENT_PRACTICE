/**
 * REST API MCP Test Script
 *
 * Connects to the mcp-rest-api server and tests API calls
 * to JSONPlaceholder (a free fake REST API).
 *
 * USAGE:
 *   Terminal 1: node node_modules/mcp-rest-api/build/cli.js --config rest-api-config.json
 *   Terminal 2: node rest-api-test.js
 */

const http = require('http');
const { spawn } = require('child_process');

const MCP_PORT = 3101;

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
  console.log('=== REST API MCP Test (JSONPlaceholder) ===\n');

  // 1. List available tools
  console.log('[1] Listing available tools...');
  const toolsRes = await mcpRequest('tools/list');
  
  if (toolsRes.result?.tools) {
    console.log('Available tools:');
    toolsRes.result.tools.forEach(t => console.log(`  - ${t.name}: ${t.description}`));
  } else {
    console.log('Tools response:', JSON.stringify(toolsRes, null, 2));
  }

  // 2. Get all posts
  console.log('\n[2] Getting all posts...');
  const postsRes = await mcpRequest('tools/call', {
    name: 'api_get_posts',
    arguments: {}
  });
  const posts = JSON.parse(postsRes.result?.content?.[0]?.text || '[]');
  console.log(`Posts count: ${posts.length}`);
  if (posts.length > 0) {
    console.log('First post:', JSON.stringify(posts[0], null, 2));
  }

  // 3. Get a single post by ID
  console.log('\n[3] Getting post with ID 1...');
  const postRes = await mcpRequest('tools/call', {
    name: 'api_get_posts',
    arguments: { id: 1 }
  });
  console.log('Post 1:', postRes.result?.content?.[0]?.text || JSON.stringify(postRes));

  // 4. Get comments for post 1
  console.log('\n[4] Getting comments for post 1...');
  const commentsRes = await mcpRequest('tools/call', {
    name: 'api_get_post_comments',
    arguments: { postId: 1 }
  });
  const comments = JSON.parse(commentsRes.result?.content?.[0]?.text || '[]');
  console.log(`Comments count: ${comments.length}`);
  if (comments.length > 0) {
    console.log('First comment:', JSON.stringify(comments[0], null, 2));
  }

  // 5. Get all users
  console.log('\n[5] Getting all users...');
  const usersRes = await mcpRequest('tools/call', {
    name: 'api_get_users',
    arguments: {}
  });
  const users = JSON.parse(usersRes.result?.content?.[0]?.text || '[]');
  console.log(`Users count: ${users.length}`);
  if (users.length > 0) {
    console.log('First user:', JSON.stringify(users[0], null, 2));
  }

  // 6. Get todos filtered by userId
  console.log('\n[6] Getting todos for user 1...');
  const todosRes = await mcpRequest('tools/call', {
    name: 'api_get_todos',
    arguments: { userId: 1 }
  });
  const todos = JSON.parse(todosRes.result?.content?.[0]?.text || '[]');
  console.log(`Todos for user 1: ${todos.length}`);
  const completed = todos.filter(t => t.completed);
  const incomplete = todos.filter(t => !t.completed);
  console.log(`  Completed: ${completed.length}, Pending: ${incomplete.length}`);

  // 7. Create a new post
  console.log('\n[7] Creating a new post...');
  const createRes = await mcpRequest('tools/call', {
    name: 'api_create_post',
    arguments: {
      body: {
        title: 'Test Post from MCP',
        body: 'This is a test post created via mcp-rest-api!',
        userId: 1
      }
    }
  });
  console.log('Created post:', createRes.result?.content?.[0]?.text || JSON.stringify(createRes));

  console.log('\n=== Test Complete ===');
}

runTest().catch(err => {
  console.error('Test failed:', err.message);
  console.log('\nMake sure the REST API MCP server is running:');
  console.log('  node node_modules/mcp-rest-api/build/cli.js --config rest-api-config.json --port 3101');
});
