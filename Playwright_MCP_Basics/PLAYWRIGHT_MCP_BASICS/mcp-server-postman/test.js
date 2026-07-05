/**
 * Test script for the Postman-generated MCP server
 * 
 * USAGE:
 *   cd mcp-server-postman && node test.js
 */

import { spawn } from 'child_process';
import { randomUUID } from 'crypto';
import * as readline from 'node:readline';

class McpClient {
  constructor(proc) {
    this.proc = proc;
    this.pending = new Map();
    const rl = readline.createInterface({ input: proc.stdout, crlfDelay: Infinity });
    
    rl.on('line', (line) => {
      const trimmed = line.trim();
      if (!trimmed) return;
      try {
        const msg = JSON.parse(trimmed);
        if (msg.id && this.pending.has(msg.id)) {
          const { resolve } = this.pending.get(msg.id);
          this.pending.delete(msg.id);
          resolve(msg.result || msg);
        }
      } catch {}
    });
  }

  async send(method, params = {}) {
    return new Promise((resolve, reject) => {
      const id = randomUUID();
      const msg = JSON.stringify({ jsonrpc: '2.0', id, method, params });
      this.pending.set(id, { resolve, reject });
      this.proc.stdin.write(msg + '\n');
      setTimeout(() => {
        if (this.pending.has(id)) {
          this.pending.delete(id);
          reject(new Error('Timeout'));
        }
      }, 20000);
    });
  }
}

async function main() {
  console.log('=== Postman MCP Server Test ===\n');

  const proc = spawn('node', ['server.js'], { stdio: ['pipe', 'pipe', 'pipe'] });
  const client = new McpClient(proc);

  await new Promise(r => setTimeout(r, 2000));

  try {
    // Initialize
    console.log('[0] Initializing...');
    await client.send('initialize', {
      protocolVersion: '2024-11-05',
      capabilities: {},
      clientInfo: { name: 'test', version: '1.0.0' }
    });
    proc.stdin.write(JSON.stringify({ jsonrpc: '2.0', method: 'notifications/initialized' }) + '\n');
    await new Promise(r => setTimeout(r, 500));

    // 1. GET /posts
    console.log('[1] GET /posts');
    const postsRes = await client.send('tools/call', { name: 'getAllPosts', arguments: {} });
    const posts = JSON.parse(postsRes.content[0].text);
    console.log(`   ${posts.length} posts, first: "${posts[0]?.title?.substring(0, 50)}..."`);

    // 2. GET /posts/1
    console.log('[2] GET /posts/1');
    const postRes = await client.send('tools/call', { name: 'getPostByID', arguments: {} });
    const post = JSON.parse(postRes.content[0].text);
    console.log(`   Title: "${post.title?.substring(0, 60)}..."`);

    // 3. GET /posts/1/comments
    console.log('[3] GET /posts/1/comments');
    const commentsRes = await client.send('tools/call', { name: 'getCommentsForPost', arguments: {} });
    const comments = JSON.parse(commentsRes.content[0].text);
    console.log(`   ${comments.length} comments, first from: ${comments[0]?.email}`);

    // 4. GET /users
    console.log('[4] GET /users');
    const usersRes = await client.send('tools/call', { name: 'getAllUsers', arguments: {} });
    const users = JSON.parse(usersRes.content[0].text);
    console.log(`   ${users.length} users, first: ${users[0]?.name} (${users[0]?.email})`);

    // 5. GET /users/1
    console.log('[5] GET /users/1');
    const userRes = await client.send('tools/call', { name: 'getUserByID', arguments: {} });
    const user = JSON.parse(userRes.content[0].text);
    console.log(`   Name: ${user.name}, Company: ${user.company?.name}`);

    // 6. GET /todos
    console.log('[6] GET /todos');
    const todosRes = await client.send('tools/call', { name: 'getTodos', arguments: {} });
    const todos = JSON.parse(todosRes.content[0].text);
    const done = todos.filter(t => t.completed).length;
    console.log(`   ${todos.length} todos (${done} done, ${todos.length - done} pending)`);

    // 7. GET /todos?userId=1
    console.log('[7] GET /todos?userId=1');
    const userTodosRes = await client.send('tools/call', { name: 'getTodosByUser', arguments: {} });
    const userTodos = JSON.parse(userTodosRes.content[0].text);
    console.log(`   ${userTodos.length} todos for user 1`);

    // 8. POST /posts
    console.log('[8] POST /posts');
    const createRes = await client.send('tools/call', {
      name: 'createPost',
      arguments: { body: { title: 'MCP Test', body: 'Postman MCP works!', userId: 1 } }
    });
    const created = JSON.parse(createRes.content[0].text);
    console.log(`   Created ID ${created.id}: "${created.title}"`);

    // 9. PUT /posts/1
    console.log('[9] PUT /posts/1');
    const updateRes = await client.send('tools/call', {
      name: 'updatePost',
      arguments: { body: { id: 1, title: 'Updated', body: 'Updated via MCP', userId: 1 } }
    });
    const updated = JSON.parse(updateRes.content[0].text);
    console.log(`   Updated: "${updated.title}"`);

    // 10. DELETE /posts/1
    console.log('[10] DELETE /posts/1');
    const deleteRes = await client.send('tools/call', { name: 'deletePost', arguments: {} });
    console.log(`   Deleted: ${JSON.stringify(deleteRes.content[0].text).substring(0, 60)}`);

    console.log('\n=== All 10 API Endpoints Tested Successfully ===');

  } catch (err) {
    console.error('Error:', err.message);
  } finally {
    proc.kill();
  }
}

main();
