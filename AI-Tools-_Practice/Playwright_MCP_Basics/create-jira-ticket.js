const https = require('https');
const email = 'suryanshusrivastva16@gmail.com';
const apiToken = process.env.JIRA_API_TOKEN;
const baseUrl = 'suryanshusrivastva16.atlassian.net';
const projectKey = 'AIT';
const auth = Buffer.from(email + ':' + apiToken).toString('base64');
function makeRequest(path, method, data) {
  return new Promise((resolve, reject) => {
    const opts = { hostname: baseUrl, path: path, method: method, headers: { 'Authorization': 'Basic ' + auth, 'Accept': 'application/json', 'Content-Type': 'application/json' } };
    const req = https.request(opts, (res) => { let body = ''; res.on('data', c => body += c); res.on('end', () => { if (res.statusCode < 300) resolve(body ? JSON.parse(body) : {}); else reject({ status: res.statusCode, body: body }); }); });
    req.on('error', reject); if (data) req.write(JSON.stringify(data)); req.end();
  });
}
async function main() {
  try {
    const me = await makeRequest('/rest/api/3/myself', 'GET');
    console.log('Auth OK:', me.displayName);
    const issueData = {
      fields: {
        project: { key: projectKey },
        issuetype: { name: 'Task' },
        summary: '[VWO Login] Wrong credentials error message mismatch',
        description: { type: 'doc', version: 1, content: [
          { type: 'paragraph', content: [{ type: 'text', text: 'Test Case: Login with invalid credentials' }] },
          { type: 'paragraph', content: [{ type: 'text', marks: [{ type: 'strong' }], text: 'Steps to Reproduce:' }] },
          { type: 'orderedList', content: [
            { type: 'listItem', content: [{ type: 'paragraph', content: [{ type: 'text', text: 'Navigate to https://app.vwo.com' }] }] },
            { type: 'listItem', content: [{ type: 'paragraph', content: [{ type: 'text', text: 'Enter username: wronguser@example.com' }] }] },
            { type: 'listItem', content: [{ type: 'paragraph', content: [{ type: 'text', text: 'Enter password: wrongpassword123' }] }] },
            { type: 'listItem', content: [{ type: 'paragraph', content: [{ type: 'text', text: 'Click Sign In button' }] }] }
          ] },
          { type: 'paragraph', content: [{ type: 'text', marks: [{ type: 'strong' }], text: 'Expected:' }] },
          { type: 'paragraph', content: [{ type: 'text', text: 'Error message for invalid credentials' }] },
          { type: 'paragraph', content: [{ type: 'text', marks: [{ type: 'strong' }], text: 'Actual:' }] },
          { type: 'paragraph', content: [{ type: 'text', text: 'Your email, password, IP address or location did not match' }] }
        ] },
        priority: { name: 'Medium' }
      }
    };
    const result = await makeRequest('/rest/api/3/issue', 'POST', issueData);
    console.log('``nCreated:', result.key, ' - https://' + baseUrl + '/browse/' + result.key);
  } catch(e) {
    console.error('Error:', e.status, e.body ? e.body.substring(0,500) : e.message);
  }
}
main();
