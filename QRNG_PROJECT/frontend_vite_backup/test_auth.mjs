const baseUrl = 'http://localhost:8000';

async function run() {
  console.log('1. Testing Register...');
  try {
    const regRes = await fetch(`${baseUrl}/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        username: 'api_test_user',
        email: 'apitest@nexus.io',
        password: 'password123'
      })
    });
    const regData = await regRes.json();
    console.log(`Status: ${regRes.status}, Response: ${JSON.stringify(regData)}`);
  } catch (e) {
    console.log(`Failed: ${e.message}`);
  }

  console.log('\\n2. Testing Login...');
  let cookies = '';
  try {
    const formData = new URLSearchParams();
    formData.append('username', 'apitest@nexus.io');
    formData.append('password', 'password123');
    
    const logRes = await fetch(`${baseUrl}/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: formData
    });
    const logData = await logRes.json();
    
    // Get Set-Cookie header
    const setCookie = logRes.headers.get('set-cookie');
    if (setCookie) {
      cookies = setCookie.split(';')[0];
    }
    console.log(`Status: ${logRes.status}, Response: ${JSON.stringify(logData)}`);
    console.log(`Got Cookie: ${cookies}`);
  } catch (e) {
    console.log(`Failed: ${e.message}`);
  }

  console.log('\\n3. Testing Get Profile (/me)...');
  try {
    const meRes = await fetch(`${baseUrl}/me`, {
      headers: {
        'Cookie': cookies
      }
    });
    const meData = await meRes.json();
    console.log(`Status: ${meRes.status}, Response: ${JSON.stringify(meData)}`);
  } catch (e) {
    console.log(`Failed: ${e.message}`);
  }
}

run();
