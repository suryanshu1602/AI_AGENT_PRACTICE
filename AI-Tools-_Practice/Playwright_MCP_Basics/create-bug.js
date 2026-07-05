const https = require('https');

const email = 'suryanshusrivastva16@gmail.com';
const apiToken = process.env.JIRA_API_TOKEN || 'YOUR_API_TOKEN_HERE';
const baseUrl = 'suryanshusrivastva16.atlassian.net';
const projectKey = 'AIT';

const auth = Buffer.from(email + ':' + apiToken).toString('base64');

function makeRequest(path, method, data = null) {
  return new Promise((resolve, reject) => {
    const options = {
      hostname: baseUrl,
      path: path,
      method: method,
      headers: {
        'Authorization': 'Basic ' + auth,
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      }
    };

    const req = https.request(options, (res) => {
      let body = '';
      res.on('data', (chunk) => { body += chunk; });
      res.on('end', () => {
        if (res.statusCode >= 200 && res.statusCode < 300) {
          resolve(body ? JSON.parse(body) : {});
        } else {
          reject({ status: res.statusCode, data: body });
        }
      });
    });

    req.on('error', reject);
    if (data) req.write(JSON.stringify(data));
    req.end();
  });
}

async function createTask() {
  const taskData = {
    fields: {
      project: { key: projectKey },
      issuetype: { id: '10040' },
      summary: 'VWO Login - Invalid credentials error not displaying properly',
      description: {
        type: 'doc',
        version: 1,
        content: [
          { type: 'paragraph', content: [{ type: 'text', text: '**Test Case:** Login with wrong credentials' }] },
          { type: 'paragraph', content: [{ type: 'text', text: '**Steps to Reproduce:' }] },
          { type: 'bulletList', content: [
            { type: 'listItem', content: [{ type: 'paragraph', content: [{ type: 'text', text: 'Navigate to app.vwo.com' }] }] },
            { type: 'listItem', content: [{ type: 'paragraph', content: [{ type: 'text', text: 'Enter wrong username: wronguser@example.com' }] }] },
            { type: 'listItem', content: [{ type: 'paragraph', content: [{ type: 'text', text: 'Enter wrong password: wrongpassword123' }] }] },
            { type: 'listItem', content: [{ type: 'paragraph', content: [{ type: 'text', text: 'Click Sign In button' }] }] }
          ]},
          { type: 'paragraph', content: [{ type: 'text', text: '**Expected:** Clear error message for invalid credentials' }] },
          { type: 'paragraph', content: [{ type: 'text', text: '**Actual:** Only "Invalid email" shows under email field' }] }
        ]
      },
      priority: { id: '3' }
    }
  };

  try {
    const result = await makeRequest('/rest/api/3/issue', 'POST', taskData);
    console.log('Task Created:', result.key);
    console.log('URL:', `https://${baseUrl}/browse/${result.key}`);
  } catch (error) {
    console.error('Error:', error.status, error.data);
  }
}

createTask();