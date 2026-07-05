const axios = require('axios');

const POSTMAN_API_KEY = process.env.POSTMAN_API_KEY || 'YOUR_POSTMAN_API_KEY';

const postman = axios.create({
  baseURL: 'https://api.postman.com',
  headers: {
    'X-Api-Key': POSTMAN_API_KEY,
    'Content-Type': 'application/json'
  }
});

async function createCollection() {
  console.log('Creating Postman collection...\n');

  const collection = {
    collection: {
      info: {
        name: 'Zipopotam API Collection',
        description: 'API testing for zip location lookup',
        schema: 'https://schema.getpostman.com/json/collection/v2.1.0/collection.json'
      },
      item: [
        {
          name: 'Get Location by ZIP Code',
          request: {
            method: 'GET',
            url: 'https://api.zippopotam.us/in/560035',
            header: [
              { key: 'Accept', value: 'application/json' }
            ]
          }
        }
      ]
    }
  };

  try {
    const response = await postman.post('/collections', collection);
    console.log('✅ Collection Created Successfully!');
    console.log('Collection ID:', response.data.collection.uid);
    console.log('Name:', response.data.collection.name);
    console.log('\nView at: https://app.postman.com/collection/' + response.data.collection.uid);
  } catch (error) {
    console.error('Error:', error.response?.data || error.message);
  }
}

createCollection();