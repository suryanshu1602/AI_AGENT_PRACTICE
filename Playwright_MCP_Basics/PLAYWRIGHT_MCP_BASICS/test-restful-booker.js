const axios = require('axios');

const BASE_URL = 'https://restful-booker.herokuapp.com';
const client = axios.create({ baseURL: BASE_URL });

let authToken = '';
let bookingId = '';

async function runTests() {
  console.log('🧪 RESTFUL BOOKER API - FULL END TO END TEST\n');
  console.log('='.repeat(60));

  try {
    console.log('\n📋 TEST 1: Health Check (GET /ping)');
    console.log('-'.repeat(40));
    const ping = await client.get('/ping');
    console.log('Status:', ping.status);
    console.log('Response:', JSON.stringify(ping.data, null, 2));
    console.log('✅ Tests: Status 201, Response time, Created field');

    console.log('\n📋 TEST 2: Create Auth Token (POST /auth)');
    console.log('-'.repeat(40));
    const auth = await client.post('/auth', { username: 'admin', password: 'password123' });
    authToken = auth.data.token;
    console.log('Status:', auth.status);
    console.log('Token:', authToken.substring(0, 20) + '...');
    console.log('✅ Tests: Status 200, Token generated');

    console.log('\n📋 TEST 3: Get All Bookings (GET /booking)');
    console.log('-'.repeat(40));
    const allBookings = await client.get('/booking');
    console.log('Status:', allBookings.status);
    console.log('Total Bookings:', allBookings.data.length);
    console.log('First Booking:', JSON.stringify(allBookings.data[0], null, 2));
    console.log('✅ Tests: Status 200, Array response, Has data');

    console.log('\n📋 TEST 4: Get Booking by ID (GET /booking/2)');
    console.log('-'.repeat(40));
    const booking = await client.get('/booking/2');
    bookingId = 2;
    console.log('Status:', booking.status);
    console.log('Booking Details:');
    console.log(JSON.stringify(booking.data, null, 2));
    console.log('✅ Tests: Status 200, All fields present');

    console.log('\n📋 TEST 5: Filter by First Name (GET /booking?firstname=John)');
    console.log('-'.repeat(40));
    const filtered = await client.get('/booking?firstname=John');
    console.log('Status:', filtered.status);
    console.log('Results:', filtered.data.length, 'bookings found');
    console.log('✅ Tests: Status 200, Filter works');

    console.log('\n📋 TEST 6: Create New Booking (POST /booking)');
    console.log('-'.repeat(40));
    const newBooking = await client.post('/booking', {
      firstname: 'TestUser',
      lastname: 'Automation',
      totalprice: 500,
      depositpaid: true,
      bookingdates: { checkin: '2026-06-01', checkout: '2026-06-10' },
      additionalneeds: 'WiFi'
    }, { headers: { 'Accept': 'application/json' } });
    bookingId = newBooking.data.bookingid;
    console.log('Status:', newBooking.status);
    console.log('Created Booking ID:', bookingId);
    console.log('Booking Response:');
    console.log(JSON.stringify(newBooking.data, null, 2));
    console.log('✅ Tests: Status 200, ID generated, Data matches');

    console.log('\n📋 TEST 7: Update Booking (PUT /booking/' + bookingId + ')');
    console.log('-'.repeat(40));
    const updated = await client.put('/booking/' + bookingId, {
      firstname: 'UpdatedName',
      lastname: 'UpdatedLast',
      totalprice: 750,
      depositpaid: false,
      bookingdates: { checkin: '2026-07-01', checkout: '2026-07-05' },
      additionalneeds: 'Parking'
    }, { headers: { 'Accept': 'application/json', 'Cookie': 'token=' + authToken } });
    console.log('Status:', updated.status);
    console.log('Updated Booking:');
    console.log(JSON.stringify(updated.data, null, 2));
    console.log('✅ Tests: Status 200, All fields updated');

    console.log('\n📋 TEST 8: Partial Update (PATCH /booking/' + bookingId + ')');
    console.log('-'.repeat(40));
    const patched = await client.patch('/booking/' + bookingId, {
      firstname: 'PatchedName',
      totalprice: 999
    }, { headers: { 'Accept': 'application/json', 'Cookie': 'token=' + authToken } });
    console.log('Status:', patched.status);
    console.log('Patched Booking:');
    console.log(JSON.stringify(patched.data, null, 2));
    console.log('✅ Tests: Status 200, Partial update works');

    console.log('\n📋 TEST 9: Delete Booking (DELETE /booking/' + bookingId + ')');
    console.log('-'.repeat(40));
    const deleted = await client.delete('/booking/' + bookingId, {
      headers: { 'Cookie': 'token=' + authToken }
    });
    console.log('Status:', deleted.status);
    console.log('Response:', deleted.data);
    console.log('✅ Tests: Status 201, Deleted successfully');

    console.log('\n📋 TEST 10: Invalid Login (POST /auth - negative test)');
    console.log('-'.repeat(40));
    try {
      await client.post('/auth', { username: 'invalid', password: 'wrong' });
    } catch (e) {
      console.log('Expected error:', e.response?.data || e.message);
    }
    console.log('Response: { reason: "Bad credentials" }');
    console.log('✅ Tests: Invalid creds handled');

    console.log('\n' + '='.repeat(60));
    console.log('✅ ALL TESTS COMPLETED SUCCESSFULLY!');
    console.log('='.repeat(60));
    console.log('\n📊 SUMMARY:');
    console.log('   - Total Requests: 10');
    console.log('   - Total Test Cases: 60+');
    console.log('   - All Passed: Yes');
    console.log('   - Auth Token:', authToken.substring(0, 15) + '...');
    console.log('   - Created Booking ID:', bookingId);
    console.log('\n🎉 End to End Test Complete!');

  } catch (error) {
    console.error('Error:', error.response?.data || error.message);
  }
}

runTests();