const axios = require('axios');

const JIRA_BASE_URL = 'https://suryanshusrivastva16.atlassian.net';
const JIRA_EMAIL = 'suryanshusrivastva16@gmail.com';
const JIRA_API_TOKEN = process.env.JIRA_API_TOKEN || 'YOUR_API_TOKEN_HERE';

const jira = axios.create({
  baseURL: JIRA_BASE_URL,
  headers: {
    'Authorization': `Basic ${Buffer.from(`${JIRA_EMAIL}:${JIRA_API_TOKEN}`).toString('base64')}`,
    'Content-Type': 'application/json',
    'Accept': 'application/json'
  }
});

async function createTask() {
  try {
    const user = await jira.get('/rest/api/3/myself');
    console.log('Auth Successful - User:', user.data.displayName);

    const projects = await jira.get('/rest/api/3/project/search');
    console.log('Projects:', projects.data.values.map(p => `${p.key}: ${p.name}`).join(', '));

    const issueData = {
      fields: {
        project: { key: 'AIT' },
        issuetype: { name: 'Task' },
        summary: 'VWO Login - Invalid credentials error message not displaying properly',
        description: {
          type: 'doc',
          version: 1,
          content: [
            { type: 'paragraph', content: [{ type: 'text', text: '**Steps to Reproduce:**' }] },
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
        priority: { name: 'Medium' }
      }
    };

    const response = await jira.post('/rest/api/3/issue', issueData);
    console.log('\nTask Created:', response.data.key);
    console.log('URL:', `${JIRA_BASE_URL}/browse/${response.data.key}`);
  } catch (error) {
    console.error('Error:', error.response?.data || error.message);
  }
}

createTask();