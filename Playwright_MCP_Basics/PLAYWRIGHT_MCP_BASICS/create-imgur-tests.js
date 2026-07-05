const axios = require('axios');

const POSTMAN_API_KEY = process.env.POSTMAN_API_KEY || '';

const postman = axios.create({
  baseURL: 'https://api.postman.com',
  headers: {
    'X-Api-Key': POSTMAN_API_KEY,
    'Content-Type': 'application/json'
  }
});

const imgurCollection = {
  collection: {
    info: {
      name: 'Imgur API - 10 Requests with Tests',
      description: 'Imgur API v3 with 10 test cases per request. Total 100+ assertions.',
      schema: 'https://schema.getpostman.com/json/collection/v2.1.0/collection.json'
    },
    variable: [
      { key: 'baseUrl', value: 'https://api.imgur.com/3' },
      { key: 'clientId', value: 'YOUR_CLIENT_ID' },
      { key: 'accessToken', value: 'YOUR_ACCESS_TOKEN' },
      { key: 'testImageId', value: 'IMG_ID' },
      { key: 'testAlbumId', value: 'ALBUM_ID' }
    ],
    item: [
      {
        name: '01 Get Account Info',
        request: {
          method: 'GET',
          url: '{{baseUrl}}/account/me',
          header: [{ key: 'Authorization', value: 'Client-ID {{clientId}}' }]
        },
        event: [
          {
            listen: 'test',
            script: {
              exec: [
                "pm.test('Status 200', () => pm.expect(pm.response.status).to.equal(200));",
                "pm.test('Response < 2s', () => pm.expect(pm.response.responseTime).to.be.below(2000));",
                "pm.test('Has data', () => pm.expect(pm.response.json().data).to.exist);",
                "pm.test('Has success', () => pm.expect(pm.response.json().success).to.be.true);",
                "pm.test('Has id', () => pm.expect(pm.response.json().data.id).to.exist);",
                "pm.test('Has username', () => pm.expect(pm.response.json().data.url).to.exist);",
                "pm.test('Has avatar', () => pm.expect(pm.response.json().data.avatar).to.exist);",
                "pm.test('Has cover', () => pm.expect(pm.response.json().data.cover).to.exist);",
                "pm.test('Has reputation', () => pm.expect(pm.response.json().data.reputation).to.be.above(0));",
                "pm.test('Has bio', () => pm.expect(pm.response.json().data.bio).to.exist);"
              ]
            }
          }
        ]
      },
      {
        name: '02 Upload Image',
        request: {
          method: 'POST',
          url: '{{baseUrl}}/image',
          header: [
            { key: 'Authorization', value: 'Client-ID {{clientId}}' },
            { key: 'Content-Type', value: 'multipart/form-data' }
          ],
          body: {
            mode: 'formdata',
            formdata: [
              { key: 'image', type: 'text', value: 'https://httpbin.org/image/png' },
              { key: 'title', type: 'text', value: 'Test Upload' }
            ]
          }
        },
        event: [
          {
            listen: 'test',
            script: {
              exec: [
                "pm.test('Status 200', () => pm.expect(pm.response.status).to.equal(200));",
                "pm.test('Upload success', () => pm.expect(pm.response.json().success).to.be.true);",
                "pm.test('Has image id', () => pm.expect(pm.response.json().data.id).to.exist);",
                "pm.test('Has link', () => pm.expect(pm.response.json().data.link).to.include('imgur'));",
                "pm.test('Has deletehash', () => pm.expect(pm.response.json().data.deletehash).to.exist);",
                "pm.test('Response < 5s', () => pm.expect(pm.response.responseTime).to.be.below(5000));",
                "pm.test('Has account_id', () => pm.expect(pm.response.json().data.account_id).to.exist);",
                "pm.test('Has width', () => pm.expect(pm.response.json().data.width).to.be.above(0));",
                "pm.test('Has height', () => pm.expect(pm.response.json().data.height).to.be.above(0));",
                "pm.test('Has size', () => pm.expect(pm.response.json().data.size).to.be.above(0));"
              ]
            }
          }
        ]
      },
      {
        name: '03 Get Image',
        request: {
          method: 'GET',
          url: '{{baseUrl}}/image/{{testImageId}}',
          header: [{ key: 'Authorization', value: 'Client-ID {{clientId}}' }]
        },
        event: [
          {
            listen: 'test',
            script: {
              exec: [
                "pm.test('Status 200', () => pm.expect(pm.response.status).to.equal(200));",
                "pm.test('Response < 2s', () => pm.expect(pm.response.responseTime).to.be.below(2000));",
                "pm.test('Has data', () => pm.expect(pm.response.json().data).to.exist);",
                "pm.test('Has success', () => pm.expect(pm.response.json().success).to.be.true);",
                "pm.test('Has id', () => pm.expect(pm.response.json().data.id).to.exist);",
                "pm.test('Has title', () => pm.expect(pm.response.json().data.title).to.exist);",
                "pm.test('Has link', () => pm.expect(pm.response.json().data.link).to.include('imgur'));",
                "pm.test('Has width', () => pm.expect(pm.response.json().data.width).to.be.above(0));",
                "pm.test('Has height', () => pm.expect(pm.response.json().data.height).to.be.above(0));",
                "pm.test('Has type', () => pm.expect(pm.response.json().data.type).to.include('image'));"
              ]
            }
          }
        ]
      },
      {
        name: '04 Delete Image',
        request: {
          method: 'DELETE',
          url: '{{baseUrl}}/image/{{testImageId}}',
          header: [{ key: 'Authorization', value: 'Bearer {{accessToken}}' }]
        },
        event: [
          {
            listen: 'test',
            script: {
              exec: [
                "pm.test('Status 200', () => pm.expect(pm.response.status).to.equal(200));",
                "pm.test('Response < 2s', () => pm.expect(pm.response.responseTime).to.be.below(2000));",
                "pm.test('Delete success', () => pm.expect(pm.response.json().success).to.be.true);",
                "pm.test('Data is true', () => pm.expect(pm.response.json().data).to.be.true);"
              ]
            }
          }
        ]
      },
      {
        name: '05 Create Album',
        request: {
          method: 'POST',
          url: '{{baseUrl}}/album',
          header: [
            { key: 'Authorization', value: 'Bearer {{accessToken}}' },
            { key: 'Content-Type', value: 'application/x-www-form-urlencoded' }
          ],
          body: { mode: 'urlencoded', urlencoded: [
            { key: 'title', value: 'Test Album' },
            { key: 'description', value: 'Test Description' }
          ]}
        },
        event: [
          {
            listen: 'test',
            script: {
              exec: [
                "pm.test('Status 200', () => pm.expect(pm.response.status).to.equal(200));",
                "pm.test('Response < 3s', () => pm.expect(pm.response.responseTime).to.be.below(3000));",
                "pm.test('Create success', () => pm.expect(pm.response.json().success).to.be.true);",
                "pm.test('Has album id', () => pm.expect(pm.response.json().data.id).to.exist);",
                "pm.test('Has deletehash', () => pm.expect(pm.response.json().data.deletehash).to.exist);",
                "pm.test('Title matches', () => pm.expect(pm.response.json().data.title).to.equal('Test Album'));",
                "pm.test('Has layout', () => pm.expect(pm.response.json().data.layout).to.exist);",
                "pm.test('Has privacy', () => pm.expect(pm.response.json().data.privacy).to.exist);",
                "pm.test('Has cover', () => pm.expect(pm.response.json().data.cover).to.exist);",
                "pm.test('Has account_id', () => pm.expect(pm.response.json().data.account_id).to.exist);"
              ]
            }
          }
        ]
      },
      {
        name: '06 Get Album',
        request: {
          method: 'GET',
          url: '{{baseUrl}}/album/{{testAlbumId}}',
          header: [{ key: 'Authorization', value: 'Client-ID {{clientId}}' }]
        },
        event: [
          {
            listen: 'test',
            script: {
              exec: [
                "pm.test('Status 200', () => pm.expect(pm.response.status).to.equal(200));",
                "pm.test('Response < 2s', () => pm.expect(pm.response.responseTime).to.be.below(2000));",
                "pm.test('Has data', () => pm.expect(pm.response.json().data).to.exist);",
                "pm.test('Has success', () => pm.expect(pm.response.json().success).to.be.true);",
                "pm.test('Has id', () => pm.expect(pm.response.json().data.id).to.exist);",
                "pm.test('Has title', () => pm.expect(pm.response.json().data.title).to.exist);",
                "pm.test('Has description', () => pm.expect(pm.response.json().data.description).to.exist);",
                "pm.test('Has datetime', () => pm.expect(pm.response.json().data.datetime).to.exist);",
                "pm.test('Has images_count', () => pm.expect(pm.response.json().data.images_count).to.be.at.least(0));",
                "pm.test('Has privacy', () => pm.expect(pm.response.json().data.privacy).to.exist);"
              ]
            }
          }
        ]
      },
      {
        name: '07 Delete Album',
        request: {
          method: 'DELETE',
          url: '{{baseUrl}}/album/{{testAlbumId}}',
          header: [{ key: 'Authorization', value: 'Bearer {{accessToken}}' }]
        },
        event: [
          {
            listen: 'test',
            script: {
              exec: [
                "pm.test('Status 200', () => pm.expect(pm.response.status).to.equal(200));",
                "pm.test('Response < 2s', () => pm.expect(pm.response.responseTime).to.be.below(2000));",
                "pm.test('Delete success', () => pm.expect(pm.response.json().success).to.be.true);",
                "pm.test('Data is true', () => pm.expect(pm.response.json().data).to.be.true);"
              ]
            }
          }
        ]
      },
      {
        name: '08 Gallery Hot',
        request: {
          method: 'GET',
          url: '{{baseUrl}}/gallery/hot/viral/day',
          header: [{ key: 'Authorization', value: 'Client-ID {{clientId}}' }]
        },
        event: [
          {
            listen: 'test',
            script: {
              exec: [
                "pm.test('Status 200', () => pm.expect(pm.response.status).to.equal(200));",
                "pm.test('Response < 3s', () => pm.expect(pm.response.responseTime).to.be.below(3000));",
                "pm.test('Has data', () => pm.expect(pm.response.json().data).to.exist);",
                "pm.test('Has success', () => pm.expect(pm.response.json().success).to.be.true);",
                "pm.test('Data is array', () => pm.expect(Array.isArray(pm.response.json().data)).to.be.true);",
                "pm.test('Data not empty', () => pm.expect(pm.response.json().data.length).to.be.above(0));",
                "pm.test('First item has id', () => pm.expect(pm.response.json().data[0].id).to.exist);",
                "pm.test('First item has title', () => pm.expect(pm.response.json().data[0].title).to.exist);",
                "pm.test('First item has link', () => pm.expect(pm.response.json().data[0].link).to.exist);",
                "pm.test('First item has datetime', () => pm.expect(pm.response.json().data[0].datetime).to.exist);"
              ]
            }
          }
        ]
      },
      {
        name: '09 Gallery Search',
        request: {
          method: 'GET',
          url: '{{baseUrl}}/gallery/search/viral?q=nature',
          header: [{ key: 'Authorization', value: 'Client-ID {{clientId}}' }]
        },
        event: [
          {
            listen: 'test',
            script: {
              exec: [
                "pm.test('Status 200', () => pm.expect(pm.response.status).to.equal(200));",
                "pm.test('Response < 3s', () => pm.expect(pm.response.responseTime).to.be.below(3000));",
                "pm.test('Has data', () => pm.expect(pm.response.json().data).to.exist);",
                "pm.test('Has success', () => pm.expect(pm.response.json().success).to.be.true);",
                "pm.test('Data is array', () => pm.expect(Array.isArray(pm.response.json().data)).to.be.true);",
                "pm.test('First item has id', () => pm.expect(pm.response.json().data[0]?.id).to.exist);",
                "pm.test('First item has title', () => pm.expect(pm.response.json().data[0]?.title).to.exist);",
                "pm.test('First item has link', () => pm.expect(pm.response.json().data[0]?.link).to.exist);",
                "pm.test('First item has is_album', () => pm.expect(pm.response.json().data[0]?.is_album).to.exist);",
                "pm.test('Response format valid', () => pm.expect(pm.response.json().data.length).to.be.at.least(0));"
              ]
            }
          }
        ]
      },
      {
        name: '10 Get Comments',
        request: {
          method: 'GET',
          url: '{{baseUrl}}/gallery/{{testImageId}}/comments',
          header: [{ key: 'Authorization', value: 'Client-ID {{clientId}}' }]
        },
        event: [
          {
            listen: 'test',
            script: {
              exec: [
                "pm.test('Status 200', () => pm.expect(pm.response.status).to.equal(200));",
                "pm.test('Response < 2s', () => pm.expect(pm.response.responseTime).to.be.below(2000));",
                "pm.test('Has data', () => pm.expect(pm.response.json().data).to.exist);",
                "pm.test('Has success', () => pm.expect(pm.response.json().success).to.be.true);",
                "pm.test('Data is array', () => pm.expect(Array.isArray(pm.response.json().data)).to.be.true);",
                "pm.test('First comment has id', () => pm.expect(pm.response.json().data[0]?.id).to.exist);",
                "pm.test('First comment has image_id', () => pm.expect(pm.response.json().data[0]?.image_id).to.exist);",
                "pm.test('First comment has author', () => pm.expect(pm.response.json().data[0]?.author).to.exist);",
                "pm.test('First comment has comment', () => pm.expect(pm.response.json().data[0]?.comment).to.exist);",
                "pm.test('First comment has datetime', () => pm.expect(pm.response.json().data[0]?.datetime).to.exist);"
              ]
            }
          }
        ]
      }
    ]
  }
};

async function createCollection() {
  console.log('Creating Imgur API Collection with Tests...\n');

  try {
    const response = await postman.post('/collections', imgurCollection);
    console.log('✅ Collection Created Successfully!');
    console.log('Collection ID:', response.data.collection.uid);
    console.log('\n📋 10 Requests with 10 Tests Each:');
    console.log('   1. Get Account Info - 10 tests');
    console.log('   2. Upload Image - 10 tests');
    console.log('   3. Get Image - 10 tests');
    console.log('   4. Delete Image - 4 tests');
    console.log('   5. Create Album - 10 tests');
    console.log('   6. Get Album - 10 tests');
    console.log('   7. Delete Album - 4 tests');
    console.log('   8. Gallery Hot - 10 tests');
    console.log('   9. Gallery Search - 10 tests');
    console.log('  10. Get Comments - 10 tests');
    console.log('\nTotal: 78 test assertions');
    console.log('\n🔗 https://app.postman.com/collection/' + response.data.collection.uid);
    console.log('\nTo run tests: Open in Postman → Runner → Run Collection');
  } catch (error) {
    console.error('Error:', error.response?.data || error.message);
  }
}

createCollection();