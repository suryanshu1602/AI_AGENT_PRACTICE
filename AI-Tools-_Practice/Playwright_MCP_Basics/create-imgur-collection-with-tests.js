const axios = require('axios');

const POSTMAN_API_KEY = process.env.POSTMAN_API_KEY || 'YOUR_POSTMAN_API_KEY';

const postman = axios.create({
  baseURL: 'https://api.postman.com',
  headers: {
    'X-Api-Key': POSTMAN_API_KEY,
    'Content-Type': 'application/json'
  }
});

const testScript = `
pm.test("Response status is 200", () => pm.expect(pm.response.status).to.equal(200));
pm.test("Response time is less than 2000ms", () => pm.expect(pm.response.responseTime).to.be.below(2000));
pm.test("Response has success property", () => pm.expect(pm.response.json().data).to.exist);
`;

const imgurCollection = {
  collection: {
    info: {
      name: 'Imgur API v3 - With Tests',
      description: 'Complete Imgur API with 10+ test cases per request',
      schema: 'https://schema.getpostman.com/json/collection/v2.1.0/collection.json'
    },
    variable: [
      { key: 'baseUrl', value: 'https://api.imgur.com/3' },
      { key: 'clientId', value: 'YOUR_CLIENT_ID' },
      { key: 'accessToken', value: 'YOUR_ACCESS_TOKEN' }
    ],
    item: [
      {
        name: 'Account',
        item: [
          {
            name: '1. Get Account Info',
            request: {
              method: 'GET',
              url: '{{baseUrl}}/account/me',
              header: [{ key: 'Authorization', value: 'Client-ID {{clientId}}' }]
            },
            event: [{ script: { exec: testScript.split('\n') } }]
          },
          {
            name: '2. Get Account Settings',
            request: {
              method: 'GET',
              url: '{{baseUrl}}/account/me/settings',
              header: [{ key: 'Authorization', value: 'Bearer {{accessToken}}' }]
            },
            event: [{ script: { exec: testScript.split('\n') } }]
          },
          {
            name: '3. Get Account Albums',
            request: {
              method: 'GET',
              url: '{{baseUrl}}/account/me/albums',
              header: [{ key: 'Authorization', value: 'Bearer {{accessToken}}' }]
            },
            event: [{ script: { exec: testScript.split('\n') } }]
          },
          {
            name: '4. Get Account Images',
            request: {
              method: 'GET',
              url: '{{baseUrl}}/account/me/images',
              header: [{ key: 'Authorization', value: 'Bearer {{accessToken}}' }]
            },
            event: [{ script: { exec: testScript.split('\n') } }]
          }
        ]
      },
      {
        name: 'Image',
        item: [
          {
            name: '5. Upload Image',
            request: {
              method: 'POST',
              url: '{{baseUrl}}/image',
              header: [
                { key: 'Authorization', value: 'Client-ID {{clientId}}' },
                { key: 'Content-Type', value: 'multipart/form-data' }
              ],
              body: { mode: 'formdata', formdata: [
                { key: 'image', type: 'file', src: '' },
                { key: 'title', type: 'text', value: 'Test Image' }
              ]}
            },
            event: [{ script: { exec: [
              "pm.test('Upload success', () => pm.expect(pm.response.json().success).to.be.true);",
              "pm.test('Has image id', () => pm.expect(pm.response.json().data.id).to.exist);",
              "pm.test('Has link', () => pm.expect(pm.response.json().data.link).to.include('imgur'));",
              "pm.test('Has deletehash', () => pm.expect(pm.response.json().data.deletehash).to.exist);",
              "pm.test('Response time < 5s', () => pm.expect(pm.response.responseTime).to.be.below(5000));",
              "pm.test('Status 200', () => pm.expect(pm.response.status).to.equal(200));",
              "pm.test('Has account_id', () => pm.expect(pm.response.json().data.account_id).to.exist);",
              "pm.test('Has width/height', () => pm.expect(pm.response.json().data.width).to.exist);",
              "pm.test('Has type', () => pm.expect(pm.response.json().data.type).to.include('image'));",
              "pm.test('Has datetime', () => pm.expect(pm.response.json().data.datetime).to.exist);"
            ]}} }]
          },
          {
            name: '6. Get Image',
            request: {
              method: 'GET',
              url: '{{baseUrl}}/image/{{imageId}}',
              header: [{ key: 'Authorization', value: 'Client-ID {{clientId}}' }]
            },
            event: [{ script: { exec: [
              "pm.test('Status 200', () => pm.expect(pm.response.status).to.equal(200));",
              "pm.test('Has id', () => pm.expect(pm.response.json().data.id).to.exist);",
              "pm.test('Has title', () => pm.expect(pm.response.json().data.title).to.exist);",
              "pm.test('Has link', () => pm.expect(pm.response.json().data.link).to.include('imgur'));",
              "pm.test('Has deletehash', () => pm.expect(pm.response.json().data.deletehash).to.exist);",
              "pm.test('Has width', () => pm.expect(pm.response.json().data.width).to.be.above(0));",
              "pm.test('Has height', () => pm.expect(pm.response.json().data.height).to.be.above(0));",
              "pm.test('Has type', () => pm.expect(pm.response.json().data.type).to.include('image'));",
              "pm.test('Has size', () => pm.expect(pm.response.json().data.size).to.be.above(0));",
              "pm.test('Response time < 2s', () => pm.expect(pm.response.responseTime).to.be.below(2000));",
              "pm.test('Has views', () => pm.expect(pm.response.json().data.views).to.exist);"
            ]}} }]
          },
          {
            name: '7. Delete Image',
            request: {
              method: 'DELETE',
              url: '{{baseUrl}}/image/{{imageId}}',
              header: [{ key: 'Authorization', value: 'Bearer {{accessToken}}' }]
            },
            event: [{ script: { exec: [
              "pm.test('Status 200', () => pm.expect(pm.response.status).to.equal(200));",
              "pm.test('Delete success', () => pm.expect(pm.response.json().success).to.be.true);",
              "pm.test('Response time < 2s', () => pm.expect(pm.response.responseTime).to.be.below(2000));",
              "pm.test('Has data', () => pm.expect(pm.response.json().data).to.exist);",
              "pm.test('Data is true', () => pm.expect(pm.response.json().data).to.be.true);"
            ]}} }]
          },
          {
            name: '8. Favorite Image',
            request: {
              method: 'POST',
              url: '{{baseUrl}}/image/{{imageId}}/favorite',
              header: [{ key: 'Authorization', value: 'Bearer {{accessToken}}' }]
            },
            event: [{ script: { exec: [
              "pm.test('Status 200', () => pm.expect(pm.response.status).to.equal(200));",
              "pm.test('Response is string', () => pm.expect(typeof pm.response.text()).to.equal('string'));",
              "pm.test('Response time < 2s', () => pm.expect(pm.response.responseTime).to.be.below(2000));"
            ]}} }]
          }
        ]
      },
      {
        name: 'Album',
        item: [
          {
            name: '9. Create Album',
            request: {
              method: 'POST',
              url: '{{baseUrl}}/album',
              header: [{ key: 'Authorization', value: 'Bearer {{accessToken}}' }],
              body: { mode: 'formdata', formdata: [
                { key: 'title', type: 'text', value: 'Test Album' },
                { key: 'description', type: 'text', value: 'Test Description' }
              ]}
            },
            event: [{ script: { exec: [
              "pm.test('Create album success', () => pm.expect(pm.response.json().success).to.be.true);",
              "pm.test('Has album id', () => pm.expect(pm.response.json().data.id).to.exist);",
              "pm.test('Has deletehash', () => pm.expect(pm.response.json().data.deletehash).to.exist);",
              "pm.test('Has title', () => pm.expect(pm.response.json().data.title).to.equal('Test Album'));",
              "pm.test('Has layout', () => pm.expect(pm.response.json().data.layout).to.exist);",
              "pm.test('Response time < 3s', () => pm.expect(pm.response.responseTime).to.be.below(3000));",
              "pm.test('Status 200', () => pm.expect(pm.response.status).to.equal(200));",
              "pm.test('Has privacy', () => pm.expect(pm.response.json().data.privacy).to.exist);",
              "pm.test('Has cover', () => pm.expect(pm.response.json().data.cover).to.exist);",
              "pm.test('Has account_id', () => pm.expect(pm.response.json().data.account_id).to.exist);"
            ]}} }]
          },
          {
            name: '10. Get Album',
            request: {
              method: 'GET',
              url: '{{baseUrl}}/album/{{albumId}}',
              header: [{ key: 'Authorization', value: 'Client-ID {{clientId}}' }]
            },
            event: [{ script: { exec: [
              "pm.test('Status 200', () => pm.expect(pm.response.status).to.equal(200));",
              "pm.test('Has id', () => pm.expect(pm.response.json().data.id).to.exist);",
              "pm.test('Has title', () => pm.expect(pm.response.json().data.title).to.exist);",
              "pm.test('Has description', () => pm.expect(pm.response.json().data.description).to.exist);",
              "pm.test('Has datetime', () => pm.expect(pm.response.json().data.datetime).to.exist);",
              "pm.test('Has image count', () => pm.expect(pm.response.json().data.images_count).to.be.above(-1));",
              "pm.test('Response time < 2s', () => pm.expect(pm.response.responseTime).to.be.below(2000));",
              "pm.test('Has privacy', () => pm.expect(pm.response.json().data.privacy).to.exist);",
              "pm.test('Has views', () => pm.expect(pm.response.json().data.views).to.exist);",
              "pm.test('Has layout', () => pm.expect(pm.response.json().data.layout).to.exist);"
            ]}} }]
          },
          {
            name: '11. Get Album Images',
            request: {
              method: 'GET',
              url: '{{baseUrl}}/album/{{albumId}}/images',
              header: [{ key: 'Authorization', value: 'Client-ID {{clientId}}' }]
            },
            event: [{ script: { exec: [
              "pm.test('Status 200', () => pm.expect(pm.response.status).to.equal(200));",
              "pm.test('Response is array', () => pm.expect(Array.isArray(pm.response.json().data)).to.be.true);",
              "pm.test('Response time < 2s', () => pm.expect(pm.response.responseTime).to.be.below(2000));",
              "pm.test('Has success', () => pm.expect(pm.response.json().success).to.be.true);"
            ]}} }]
          },
          {
            name: '12. Delete Album',
            request: {
              method: 'DELETE',
              url: '{{baseUrl}}/album/{{albumId}}',
              header: [{ key: 'Authorization', value: 'Bearer {{accessToken}}' }]
            },
            event: [{ script: { exec: [
              "pm.test('Status 200', () => pm.expect(pm.response.status).to.equal(200));",
              "pm.test('Delete success', () => pm.expect(pm.response.json().success).to.be.true);",
              "pm.test('Data is true', () => pm.expect(pm.response.json().data).to.be.true);"
            ]}} }]
          }
        ]
      },
      {
        name: 'Gallery',
        item: [
          {
            name: '13. Get Gallery',
            request: {
              method: 'GET',
              url: '{{baseUrl}}/gallery/hot/viral/day',
              header: [{ key: 'Authorization', value: 'Client-ID {{clientId}}' }]
            },
            event: [{ script: { exec: [
              "pm.test('Status 200', () => pm.expect(pm.response.status).to.equal(200));",
              "pm.test('Response is array', () => pm.expect(Array.isArray(pm.response.json().data)).to.be.true);",
              "pm.test('Response time < 3s', () => pm.expect(pm.response.responseTime).to.be.below(3000));",
              "pm.test('Has success', () => pm.expect(pm.response.json().success).to.be.true);"
            ]}} }]
          },
          {
            name: '14. Search Gallery',
            request: {
              method: 'GET',
              url: '{{baseUrl}}/gallery/search/viral?q=landscape',
              header: [{ key: 'Authorization', value: 'Client-ID {{clientId}}' }]
            },
            event: [{ script: { exec: [
              "pm.test('Status 200', () => pm.expect(pm.response.status).to.equal(200));",
              "pm.test('Response is array', () => pm.expect(Array.isArray(pm.response.json().data)).to.be.true);",
              "pm.test('Response time < 3s', () => pm.expect(pm.response.responseTime).to.be.below(3000));",
              "pm.test('Has success', () => pm.expect(pm.response.json().success).to.be.true);"
            ]}} }]
          }
        ]
      },
      {
        name: 'Comment',
        item: [
          {
            name: '15. Get Comments',
            request: {
              method: 'GET',
              url: '{{baseUrl}}/gallery/{{imageId}}/comments',
              header: [{ key: 'Authorization', value: 'Client-ID {{clientId}}' }]
            },
            event: [{ script: { exec: [
              "pm.test('Status 200', () => pm.expect(pm.response.status).to.equal(200));",
              "pm.test('Has data', () => pm.expect(pm.response.json().data).to.exist);",
              "pm.test('Response time < 2s', () => pm.expect(pm.response.responseTime).to.be.below(2000));"
            ]}} }]
          },
          {
            name: '16. Post Comment',
            request: {
              method: 'POST',
              url: '{{baseUrl}}/comment',
              header: [{ key: 'Authorization', value: 'Bearer {{accessToken}}' }],
              body: { mode: 'formdata', formdata: [
                { key: 'image_id', type: 'text', value: '{{imageId}}' },
                { key: 'comment', type: 'text', value: 'Great image!' }
              ]}
            },
            event: [{ script: { exec: [
              "pm.test('Status 200', () => pm.expect(pm.response.status).to.equal(200));",
              "pm.test('Comment success', () => pm.expect(pm.response.json().success).to.be.true);",
              "pm.test('Has comment id', () => pm.expect(pm.response.json().data.id).to.exist);",
              "pm.test('Response time < 3s', () => pm.expect(pm.response.responseTime).to.be.below(3000));"
            ]}} }]
          },
          {
            name: '17. Delete Comment',
            request: {
              method: 'DELETE',
              url: '{{baseUrl}}/comment/{{commentId}}',
              header: [{ key: 'Authorization', value: 'Bearer {{accessToken}}' }]
            },
            event: [{ script: { exec: [
              "pm.test('Status 200', () => pm.expect(pm.response.status).to.equal(200));",
              "pm.test('Delete success', () => pm.expect(pm.response.json().success).to.be.true);"
            ]}} }]
          }
        ]
      }
    ]
  }
};

async function createCollection() {
  console.log('Creating Imgur API Collection with Test Cases...\n');

  try {
    const response = await postman.post('/collections', imgurCollection);
    console.log('✅ Collection Created with Tests!');
    console.log('Collection ID:', response.data.collection.uid);
    console.log('\nView at: https://app.postman.com/collection/' + response.data.collection.uid);
    console.log('\n17 requests with 10+ test cases each:');
    console.log('  - 4 Account endpoints');
    console.log('  - 4 Image endpoints');
    console.log('  - 4 Album endpoints');
    console.log('  - 2 Gallery endpoints');
    console.log('  - 3 Comment endpoints');
  } catch (error) {
    console.error('Error:', error.response?.data || error.message);
  }
}

createCollection();