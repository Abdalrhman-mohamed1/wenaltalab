import fs from 'fs';
import http from 'http';

async function testEndpoint(name, url, method = 'GET', body = null) {
  return new Promise((resolve) => {
    const options = {
      method,
      headers: {
        'Content-Type': 'application/json'
      }
    };
    
    // Check if it's https or http
    const protocol = url.startsWith('https') ? require('https') : http;
    const req = protocol.request(url, options, (res) => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => {
        if (res.statusCode >= 200 && res.statusCode < 400) {
          console.log(`[PASS] ${name} - ${url} (Status: ${res.statusCode})`);
          resolve(true);
        } else {
          console.log(`[FAIL] ${name} - ${url} (Status: ${res.statusCode})\n  Response: ${data.substring(0, 200)}`);
          resolve(false);
        }
      });
    });

    req.on('error', (e) => {
      console.log(`[FAIL] ${name} - ${url} (Error: ${e.message})`);
      resolve(false);
    });

    if (body) {
      req.write(JSON.stringify(body));
    }
    req.end();
  });
}

async function runTests() {
  console.log('--- STARTING E2E VERIFICATION ---');
  
  // 1. Frontend Startup
  const frontendPass = await testEndpoint('Frontend Startup', 'http://localhost:3000');
  
  // 2. Backend Startup
  const backendPass = await testEndpoint('Backend Startup', 'http://localhost:3001/api/health'); // Assuming health endpoint
  
  // To check DB, Redis, RabbitMQ, we could check the health endpoint if it returns status or we check docker containers.
  
  console.log('--- VERIFICATION COMPLETE ---');
}

runTests();
