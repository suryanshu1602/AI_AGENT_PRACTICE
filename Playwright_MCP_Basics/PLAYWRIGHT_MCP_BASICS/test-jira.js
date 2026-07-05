const https = require('https');

const email = 'suryanshusrivastva16@gmail.com';
const apiToken = process.env.JIRA_API_TOKEN || 'YOUR_API_TOKEN_HERE';

const auth = Buffer.from(email + ':' + apiToken).toString('base64');

const options = {
  hostname: 'suryanshusrivastva16.atlassian.net',
  path: '/rest/api/3/myself',
  method: 'GET',
  headers: {
    'Authorization': 'Basic ' + auth,
    'Accept': 'application/json'
  }
};

const req = https.request(options, (res) => {
  let data = '';
  res.on('data', (chunk) => { data += chunk; });
  res.on('end', () => {
    console.log('Status:', res.statusCode);
    if (res.statusCode === 200) {
      console.log('✅ Auth successful!');
      console.log(JSON.parse(data));
    } else {
      console.log('Error:', data);
    }
  });
});

req.on('error', (e) => console.error('Error:', e.message));
req.end();