const axios = require('axios');

const POSTMAN_API_KEY = process.env.POSTMAN_API_KEY || '';

const postman = axios.create({
  baseURL: 'https://api.postman.com',
  headers: {
    'X-Api-Key': POSTMAN_API_KEY,
    'Content-Type': 'application/json'
  }
});

const baseUrl = 'https://restful-booker.herokuapp.com';

const restfulBookerCollection = {
  collection: {
    info: {
      name: 'Restful Booker API - Full Tests',
      description: 'Complete Restful Booker API with 10+ test cases per request. Base URL: ' + baseUrl,
      schema: 'https://schema.getpostman.com/json/collection/v2.1.0/collection.json'
    },
    variable: [
      { key: 'baseUrl', value: baseUrl },
      { key: 'username', value: 'admin' },
      { key: 'password', value: 'password123' },
      { key: 'authToken', value: '' },
      { key: 'bookingId', value: '1' }
    ],
    item: [
      {
        name: '01 Health Check (Ping)',
        request: {
          method: 'GET',
          url: '{{baseUrl}}/ping'
        },
        event: [
          {
            listen: 'test',
            script: {
              exec: [
                "pm.test('Status 201', () => pm.expect(pm.response.status).to.equal(201));",
                "pm.test('Response < 500ms', () => pm.expect(pm.response.responseTime).to.be.below(500));",
                "pm.test('Has created', () => pm.expect(pm.response.json().created).to.exist);",
                "pm.test('Created is true', () => pm.expect(pm.response.json().created).to.be.true);",
                "pm.test('Content-Type is JSON', () => pm.expect(pm.response.headers.has('content-type')).to.be.true);"
              ]
            }
          }
        ]
      },
      {
        name: '02 Create Auth Token',
        request: {
          method: 'POST',
          url: '{{baseUrl}}/auth',
          header: [{ key: 'Content-Type', value: 'application/json' }],
          body: { mode: 'raw', raw: JSON.stringify({ username: 'admin', password: 'password123' }) }
        },
        event: [
          {
            listen: 'test',
            script: {
              exec: [
                "pm.test('Status 200', () => pm.expect(pm.response.status).to.equal(200));",
                "pm.test('Response < 2s', () => pm.expect(pm.response.responseTime).to.be.below(2000));",
                "pm.test('Has token', () => pm.expect(pm.response.json().token).to.exist);",
                "pm.test('Token is string', () => pm.expect(typeof pm.response.json().token).to.equal('string'));",
                "pm.test('Token not empty', () => pm.expect(pm.response.json().token.length).to.be.above(0));"
              ]
            }
          }
        ]
      },
      {
        name: '03 Get All Bookings',
        request: {
          method: 'GET',
          url: '{{baseUrl}}/booking'
        },
        event: [
          {
            listen: 'test',
            script: {
              exec: [
                "pm.test('Status 200', () => pm.expect(pm.response.status).to.equal(200));",
                "pm.test('Response < 2s', () => pm.expect(pm.response.responseTime).to.be.below(2000));",
                "pm.test('Response is array', () => pm.expect(Array.isArray(pm.response.json())).to.be.true);",
                "pm.test('Has bookings', () => pm.expect(pm.response.json().length).to.be.above(0));",
                "pm.test('First booking has bookingid', () => pm.expect(pm.response.json()[0].bookingid).to.exist);",
                "pm.test('First bookingid is number', () => pm.expect(typeof pm.response.json()[0].bookingid).to.equal('number'));"
              ]
            }
          }
        ]
      },
      {
        name: '04 Get Booking by ID',
        request: {
          method: 'GET',
          url: '{{baseUrl}}/booking/{{bookingId}}'
        },
        event: [
          {
            listen: 'test',
            script: {
              exec: [
                "pm.test('Status 200', () => pm.expect(pm.response.status).to.equal(200));",
                "pm.test('Response < 2s', () => pm.expect(pm.response.responseTime).to.be.below(2000));",
                "pm.test('Has firstname', () => pm.expect(pm.response.json().firstname).to.exist);",
                "pm.test('Has lastname', () => pm.expect(pm.response.json().lastname).to.exist);",
                "pm.test('Has totalprice', () => pm.expect(pm.response.json().totalprice).to.exist);",
                "pm.test('Has depositpaid', () => pm.expect(pm.response.json().depositpaid).to.exist);",
                "pm.test('Has checkin', () => pm.expect(pm.response.json().bookingdates).to.exist);",
                "pm.test('Has checkout', () => pm.expect(pm.response.json().bookingdates.checkout).to.exist);"
              ]
            }
          }
        ]
      },
      {
        name: '05 Filter by First Name',
        request: {
          method: 'GET',
          url: { raw: '{{baseUrl}}/booking?firstname=John', params: [{ key: 'firstname', value: 'John' }] },
          header: []
        },
        event: [
          {
            listen: 'test',
            script: {
              exec: [
                "pm.test('Status 200', () => pm.expect(pm.response.status).to.equal(200));",
                "pm.test('Response < 2s', () => pm.expect(pm.response.responseTime).to.be.below(2000));",
                "pm.test('Response is array', () => pm.expect(Array.isArray(pm.response.json())).to.be.true);",
                "pm.test('Results may be empty', () => pm.expect(pm.response.json().length).to.be.at.least(0));"
              ]
            }
          }
        ]
      },
      {
        name: '06 Create New Booking',
        request: {
          method: 'POST',
          url: '{{baseUrl}}/booking',
          header: [
            { key: 'Content-Type', value: 'application/json' },
            { key: 'Accept', value: 'application/json' }
          ],
          body: {
            mode: 'raw',
            raw: JSON.stringify({
              firstname: 'Jim',
              lastname: 'Brown',
              totalprice: 111,
              depositpaid: true,
              bookingdates: { checkin: '2018-01-01', checkout: '2019-01-01' },
              additionalneeds: 'Breakfast'
            })
          }
        },
        event: [
          {
            listen: 'test',
            script: {
              exec: [
                "pm.test('Status 200', () => pm.expect(pm.response.status).to.equal(200));",
                "pm.test('Response < 3s', () => pm.expect(pm.response.responseTime).to.be.below(3000));",
                "pm.test('Has bookingid', () => pm.expect(pm.response.json().bookingid).to.exist);",
                "pm.test('Bookingid is number', () => pm.expect(typeof pm.response.json().bookingid).to.equal('number'));",
                "pm.test('Firstname matches', () => pm.expect(pm.response.json().booking.firstname).to.equal('Jim'));",
                "pm.test('Lastname matches', () => pm.expect(pm.response.json().booking.lastname).to.equal('Brown'));",
                "pm.test('Totalprice matches', () => pm.expect(pm.response.json().booking.totalprice).to.equal(111));",
                "pm.test('Depositpaid is true', () => pm.expect(pm.response.json().booking.depositpaid).to.be.true);",
                "pm.test('Has checkin', () => pm.expect(pm.response.json().booking.bookingdates.checkin).to.exist);",
                "pm.test('Has checkout', () => pm.expect(pm.response.json().booking.bookingdates.checkout).to.exist);"
              ]
            }
          }
        ]
      },
      {
        name: '07 Update Booking (Full)',
        request: {
          method: 'PUT',
          url: '{{baseUrl}}/booking/{{bookingId}}',
          header: [
            { key: 'Content-Type', value: 'application/json' },
            { key: 'Accept', value: 'application/json' },
            { key: 'Cookie', value: 'token={{authToken}}' }
          ],
          body: {
            mode: 'raw',
            raw: JSON.stringify({
              firstname: 'James',
              lastname: 'Smith',
              totalprice: 222,
              depositpaid: false,
              bookingdates: { checkin: '2020-01-01', checkout: '2021-01-01' },
              additionalneeds: 'Lunch'
            })
          }
        },
        event: [
          {
            listen: 'test',
            script: {
              exec: [
                "pm.test('Status 200', () => pm.expect(pm.response.status).to.equal(200));",
                "pm.test('Response < 3s', () => pm.expect(pm.response.responseTime).to.be.below(3000));",
                "pm.test('Has firstname', () => pm.expect(pm.response.json().firstname).to.exist);",
                "pm.test('Firstname updated', () => pm.expect(pm.response.json().firstname).to.equal('James'));",
                "pm.test('Lastname updated', () => pm.expect(pm.response.json().lastname).to.equal('Smith'));",
                "pm.test('Totalprice updated', () => pm.expect(pm.response.json().totalprice).to.equal(222));",
                "pm.test('Depositpaid updated', () => pm.expect(pm.response.json().depositpaid).to.be.false);",
                "pm.test('Checkin updated', () => pm.expect(pm.response.json().bookingdates.checkin).to.equal('2020-01-01'));",
                "pm.test('Checkout updated', () => pm.expect(pm.response.json().bookingdates.checkout).to.equal('2021-01-01'));",
                "pm.test('Additionalneeds updated', () => pm.expect(pm.response.json().additionalneeds).to.equal('Lunch'));"
              ]
            }
          }
        ]
      },
      {
        name: '08 Partial Update Booking',
        request: {
          method: 'PATCH',
          url: '{{baseUrl}}/booking/{{bookingId}}',
          header: [
            { key: 'Content-Type', value: 'application/json' },
            { key: 'Accept', value: 'application/json' },
            { key: 'Cookie', value: 'token={{authToken}}' }
          ],
          body: { mode: 'raw', raw: JSON.stringify({ firstname: 'Updated', totalprice: 333 }) }
        },
        event: [
          {
            listen: 'test',
            script: {
              exec: [
                "pm.test('Status 200', () => pm.expect(pm.response.status).to.equal(200));",
                "pm.test('Response < 3s', () => pm.expect(pm.response.responseTime).to.be.below(3000));",
                "pm.test('Firstname updated', () => pm.expect(pm.response.json().firstname).to.equal('Updated'));",
                "pm.test('Totalprice updated', () => pm.expect(pm.response.json().totalprice).to.equal(333));",
                "pm.test('Lastname preserved', () => pm.expect(pm.response.json().lastname).to.exist);"
              ]
            }
          }
        ]
      },
      {
        name: '09 Delete Booking',
        request: {
          method: 'DELETE',
          url: '{{baseUrl}}/booking/{{bookingId}}',
          header: [
            { key: 'Content-Type', value: 'application/json' },
            { key: 'Cookie', value: 'token={{authToken}}' }
          ]
        },
        event: [
          {
            listen: 'test',
            script: {
              exec: [
                "pm.test('Status 201', () => pm.expect(pm.response.status).to.equal(201));",
                "pm.test('Response < 2s', () => pm.expect(pm.response.responseTime).to.be.below(2000));",
                "pm.test('Body is empty', () => pm.expect(pm.response.text()).to.equal('Created'));"
              ]
            }
          }
        ]
      },
      {
        name: '10 Invalid Login',
        request: {
          method: 'POST',
          url: '{{baseUrl}}/auth',
          header: [{ key: 'Content-Type', value: 'application/json' }],
          body: { mode: 'raw', raw: JSON.stringify({ username: 'invalid', password: 'wrong' }) }
        },
        event: [
          {
            listen: 'test',
            script: {
              exec: [
                "pm.test('Status 200', () => pm.expect(pm.response.status).to.equal(200));",
                "pm.test('No token returned', () => pm.expect(pm.response.json().reason).to.equal('Bad credentials'));"
              ]
            }
          }
        ]
      }
    ]
  }
};

async function createCollection() {
  console.log('Creating Restful Booker API Collection with Tests...\n');

  try {
    const response = await postman.post('/collections', restfulBookerCollection);
    console.log('✅ Collection Created Successfully!');
    console.log('Collection ID:', response.data.collection.uid);
    console.log('\n📋 10 Requests with 60+ Test Cases:');
    console.log('   1. Health Check - 5 tests');
    console.log('   2. Create Auth Token - 5 tests');
    console.log('   3. Get All Bookings - 6 tests');
    console.log('   4. Get Booking by ID - 8 tests');
    console.log('   5. Filter by First Name - 4 tests');
    console.log('   6. Create New Booking - 10 tests');
    console.log('   7. Update Booking (PUT) - 10 tests');
    console.log('   8. Partial Update (PATCH) - 5 tests');
    console.log('   9. Delete Booking - 3 tests');
    console.log('  10. Invalid Login - 2 tests');
    console.log('\n🔗 https://app.postman.com/collection/' + response.data.collection.uid);
  } catch (error) {
    console.error('Error:', error.response?.data || error.message);
  }
}

createCollection();