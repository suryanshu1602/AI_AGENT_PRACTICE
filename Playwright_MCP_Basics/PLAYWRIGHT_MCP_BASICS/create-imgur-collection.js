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
      name: 'Imgur API v3 Collection',
      description: 'Complete Imgur API collection for image hosting and sharing. Base URL: https://api.imgur.com/3',
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
            name: 'Get Account Info',
            request: {
              method: 'GET',
              url: '{{baseUrl}}/account/me',
              header: [
                { key: 'Authorization', value: 'Client-ID {{clientId}}' }
              ]
            }
          },
          {
            name: 'Get Account Settings',
            request: {
              method: 'GET',
              url: '{{baseUrl}}/account/me/settings',
              header: [
                { key: 'Authorization', value: 'Bearer {{accessToken}}' }
              ]
            }
          },
          {
            name: 'Get Account Albums',
            request: {
              method: 'GET',
              url: '{{baseUrl}}/account/me/albums',
              header: [
                { key: 'Authorization', value: 'Bearer {{accessToken}}' }
              ]
            }
          },
          {
            name: 'Get Account Images',
            request: {
              method: 'GET',
              url: '{{baseUrl}}/account/me/images',
              header: [
                { key: 'Authorization', value: 'Bearer {{accessToken}}' }
              ]
            }
          }
        ]
      },
      {
        name: 'Image',
        item: [
          {
            name: 'Upload Image',
            request: {
              method: 'POST',
              url: '{{baseUrl}}/image',
              header: [
                { key: 'Authorization', value: 'Client-ID {{clientId}}' }
              ],
              body: {
                mode: 'formdata',
                formdata: [
                  { key: 'image', type: 'file', src: '' },
                  { key: 'title', type: 'text', value: 'My Image Title' },
                  { key: 'description', type: 'text', value: 'Image description' },
                  { key: 'album', type: 'text', value: 'optional album id' }
                ]
              }
            }
          },
          {
            name: 'Upload Image (URL)',
            request: {
              method: 'POST',
              url: '{{baseUrl}}/image',
              header: [
                { key: 'Authorization', value: 'Client-ID {{clientId}}' }
              ],
              body: {
                mode: 'formdata',
                formdata: [
                  { key: 'image', type: 'text', value: 'https://example.com/image.jpg' },
                  { key: 'title', type: 'text', value: 'Image from URL' }
                ]
              }
            }
          },
          {
            name: 'Get Image',
            request: {
              method: 'GET',
              url: '{{baseUrl}}/image/{{imageId}}',
              header: [
                { key: 'Authorization', value: 'Client-ID {{clientId}}' }
              ]
            }
          },
          {
            name: 'Update Image',
            request: {
              method: 'POST',
              url: '{{baseUrl}}/image/{{imageId}}',
              header: [
                { key: 'Authorization', value: 'Bearer {{accessToken}}' }
              ],
              body: {
                mode: 'formdata',
                formdata: [
                  { key: 'title', type: 'text', value: 'Updated title' },
                  { key: 'description', type: 'text', value: 'Updated description' }
                ]
              }
            }
          },
          {
            name: 'Delete Image',
            request: {
              method: 'DELETE',
              url: '{{baseUrl}}/image/{{imageId}}',
              header: [
                { key: 'Authorization', value: 'Bearer {{accessToken}}' }
              ]
            }
          },
          {
            name: 'Favorite Image',
            request: {
              method: 'POST',
              url: '{{baseUrl}}/image/{{imageId}}/favorite',
              header: [
                { key: 'Authorization', value: 'Bearer {{accessToken}}' }
              ]
            }
          }
        ]
      },
      {
        name: 'Album',
        item: [
          {
            name: 'Create Album',
            request: {
              method: 'POST',
              url: '{{baseUrl}}/album',
              header: [
                { key: 'Authorization', value: 'Bearer {{accessToken}}' }
              ],
              body: {
                mode: 'formdata',
                formdata: [
                  { key: 'title', type: 'text', value: 'My Album' },
                  { key: 'description', type: 'text', value: 'Album description' },
                  { key: 'privacy', type: 'text', value: 'public' }
                ]
              }
            }
          },
          {
            name: 'Get Album',
            request: {
              method: 'GET',
              url: '{{baseUrl}}/album/{{albumId}}',
              header: [
                { key: 'Authorization', value: 'Client-ID {{clientId}}' }
              ]
            }
          },
          {
            name: 'Get Album Images',
            request: {
              method: 'GET',
              url: '{{baseUrl}}/album/{{albumId}}/images',
              header: [
                { key: 'Authorization', value: 'Client-ID {{clientId}}' }
              ]
            }
          },
          {
            name: 'Update Album',
            request: {
              method: 'PUT',
              url: '{{baseUrl}}/album/{{albumId}}',
              header: [
                { key: 'Authorization', value: 'Bearer {{accessToken}}' }
              ],
              body: {
                mode: 'formdata',
                formdata: [
                  { key: 'title', type: 'text', value: 'Updated album title' },
                  { key: 'description', type: 'text', value: 'Updated description' }
                ]
              }
            }
          },
          {
            name: 'Delete Album',
            request: {
              method: 'DELETE',
              url: '{{baseUrl}}/album/{{albumId}}',
              header: [
                { key: 'Authorization', value: 'Bearer {{accessToken}}' }
              ]
            }
          },
          {
            name: 'Add Images to Album',
            request: {
              method: 'POST',
              url: '{{baseUrl}}/album/{{albumId}}/add',
              header: [
                { key: 'Authorization', value: 'Bearer {{accessToken}}' }
              ],
              body: {
                mode: 'formdata',
                formdata: [
                  { key: 'ids', type: 'text', value: 'imageId1,imageId2' }
                ]
              }
            }
          }
        ]
      },
      {
        name: 'Gallery',
        item: [
          {
            name: 'Get Gallery',
            request: {
              method: 'GET',
              url: '{{baseUrl}}/gallery/hot/viral/day',
              header: [
                { key: 'Authorization', value: 'Client-ID {{clientId}}' }
              ]
            }
          },
          {
            name: 'Get Subreddit Gallery',
            request: {
              method: 'GET',
              url: '{{baseUrl}}/gallery/r/{{subreddit}}',
              header: [
                { key: 'Authorization', value: 'Client-ID {{clientId}}' }
              ]
            }
          },
          {
            name: 'Search Gallery',
            request: {
              method: 'GET',
              url: '{{baseUrl}}/gallery/search/viral?q=landscape',
              header: [
                { key: 'Authorization', value: 'Client-ID {{clientId}}' }
              ]
            }
          }
        ]
      },
      {
        name: 'Comment',
        item: [
          {
            name: 'Get Comments',
            request: {
              method: 'GET',
              url: '{{baseUrl}}/gallery/{{imageId}}/comments',
              header: [
                { key: 'Authorization', value: 'Client-ID {{clientId}}' }
              ]
            }
          },
          {
            name: 'Post Comment',
            request: {
              method: 'POST',
              url: '{{baseUrl}}/comment',
              header: [
                { key: 'Authorization', value: 'Bearer {{accessToken}}' }
              ],
              body: {
                mode: 'formdata',
                formdata: [
                  { key: 'image_id', type: 'text', value: '{{imageId}}' },
                  { key: 'comment', type: 'text', value: 'Great image!' }
                ]
              }
            }
          },
          {
            name: 'Delete Comment',
            request: {
              method: 'DELETE',
              url: '{{baseUrl}}/comment/{{commentId}}',
              header: [
                { key: 'Authorization', value: 'Bearer {{accessToken}}' }
              ]
            }
          }
        ]
      }
    ]
  }
};

async function createCollection() {
  console.log('Creating Imgur API Postman Collection...\n');

  try {
    const response = await postman.post('/collections', imgurCollection);
    console.log('✅ Collection Created Successfully!');
    console.log('Collection ID:', response.data.collection.uid);
    console.log('Name:', response.data.collection.name);
    console.log('\nView at: https://app.postman.com/collection/' + response.data.collection.uid);
    console.log('\nConfigure these variables in Postman:');
    console.log('  - clientId: Your Imgur Client ID');
    console.log('  - accessToken: Your OAuth access token (for authenticated requests)');
  } catch (error) {
    console.error('Error:', error.response?.data || error.message);
  }
}

createCollection();