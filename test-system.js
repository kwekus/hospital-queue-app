/**
 * System Functionality Test Suite
 * Tests all planned features of the Hospital Queue Management System
 */

const http = require('http');

const API_URL = 'http://localhost:3000';
const ADMIN_KEY = '123';

// Color codes for console output
const colors = {
  reset: '\x1b[0m',
  green: '\x1b[32m',
  red: '\x1b[31m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  cyan: '\x1b[36m'
};

function log(msg, color = 'reset') {
  console.log(`${colors[color]}${msg}${colors.reset}`);
}

// Utility function to make HTTP requests
function makeRequest(method, path, data = null) {
  return new Promise((resolve, reject) => {
    const url = new URL(path, API_URL);
    const options = {
      hostname: url.hostname,
      port: url.port,
      path: url.pathname + url.search,
      method: method,
      headers: {
        'Content-Type': 'application/json'
      }
    };

    const req = http.request(options, (res) => {
      let body = '';
      res.on('data', chunk => body += chunk);
      res.on('end', () => {
        try {
          const parsed = JSON.parse(body);
          resolve({ status: res.statusCode, body: parsed });
        } catch (e) {
          resolve({ status: res.statusCode, body: body });
        }
      });
    });

    req.on('error', reject);

    if (data) {
      req.write(JSON.stringify(data));
    }
    req.end();
  });
}

async function runTests() {
  log('\n' + '='.repeat(70), 'cyan');
  log('HOSPITAL QUEUE MANAGEMENT SYSTEM - FUNCTIONALITY TEST SUITE', 'cyan');
  log('='.repeat(70) + '\n', 'cyan');

  let passedTests = 0;
  let failedTests = 0;
  let totalTests = 0;

  // Test 1: Health Check
  totalTests++;
  try {
    log('Test 1: Health Check Endpoint', 'blue');
    const response = await makeRequest('GET', '/health');
    if (response.status === 200 && response.body.status === 'ok') {
      log('✓ PASS: Server is responding correctly\n', 'green');
      passedTests++;
    } else {
      log('✗ FAIL: Health check failed\n', 'red');
      failedTests++;
    }
  } catch (err) {
    log(`✗ FAIL: ${err.message}\n`, 'red');
    failedTests++;
  }

  // Test 2: Get Queue (Empty)
  totalTests++;
  try {
    log('Test 2: Get Queue Endpoint (Initial Empty State)', 'blue');
    const response = await makeRequest('GET', '/api/get-queue');
    if (response.status === 200 && Array.isArray(response.body.queue) && response.body.queue.length === 0) {
      log('✓ PASS: Queue is empty as expected\n', 'green');
      passedTests++;
    } else {
      log(`✗ FAIL: Expected empty queue, got: ${JSON.stringify(response.body)}\n`, 'red');
      failedTests++;
    }
  } catch (err) {
    log(`✗ FAIL: ${err.message}\n`, 'red');
    failedTests++;
  }

  // Test 3: Join Queue with Full Patient Info
  totalTests++;
  try {
    log('Test 3: Join Queue with Full Patient Information', 'blue');
    const patientData = {
      name: 'John Doe',
      firstName: 'John',
      lastName: 'Doe',
      dateOfBirth: '1990-01-15',
      age: 34,
      gender: 'Male',
      phoneNumber: '555-0001',
      email: 'john@example.com',
      address: '123 Main St, City',
      department: 'Emergency'
    };
    const response = await makeRequest('POST', '/api/join-queue', patientData);
    if (response.status === 201 && response.body.patient && response.body.patient.queueNumber === 1) {
      log(`✓ PASS: Patient registered successfully with queue number ${response.body.patient.queueNumber}`, 'green');
      log(`  - Name: ${response.body.patient.name}`);
      log(`  - Estimated Wait Time: ${response.body.patient.estimatedWaitTime} minutes\n`, 'green');
      passedTests++;
    } else {
      log(`✗ FAIL: ${JSON.stringify(response.body)}\n`, 'red');
      failedTests++;
    }
  } catch (err) {
    log(`✗ FAIL: ${err.message}\n`, 'red');
    failedTests++;
  }

  // Test 4: Add Multiple Patients to Queue
  totalTests++;
  try {
    log('Test 4: Add Multiple Patients to Queue', 'blue');
    const patients = [
      { name: 'Jane Smith', firstName: 'Jane', lastName: 'Smith', dateOfBirth: '1985-05-20', age: 38, gender: 'Female', phoneNumber: '555-0002', email: 'jane@example.com', address: '456 Oak Ave', department: 'General Practice' },
      { name: 'Bob Wilson', firstName: 'Bob', lastName: 'Wilson', dateOfBirth: '1975-12-10', age: 48, gender: 'Male', phoneNumber: '555-0003', email: 'bob@example.com', address: '789 Elm St', department: 'Surgery' }
    ];
    
    let allSuccess = true;
    for (const patient of patients) {
      const response = await makeRequest('POST', '/api/join-queue', patient);
      if (response.status !== 201) allSuccess = false;
    }
    
    if (allSuccess) {
      log('✓ PASS: Multiple patients added successfully\n', 'green');
      passedTests++;
    } else {
      log('✗ FAIL: Could not add all patients\n', 'red');
      failedTests++;
    }
  } catch (err) {
    log(`✗ FAIL: ${err.message}\n`, 'red');
    failedTests++;
  }

  // Test 5: Get Queue with Multiple Patients
  totalTests++;
  try {
    log('Test 5: Get Queue with Multiple Patients', 'blue');
    const response = await makeRequest('GET', '/api/get-queue');
    if (response.status === 200 && response.body.queue.length === 3) {
      log(`✓ PASS: Queue contains ${response.body.queue.length} patients`, 'green');
      response.body.queue.forEach((patient, idx) => {
        log(`  ${idx + 1}. ${patient.name} (Queue #${patient.queueNumber}, Est. Wait: ${patient.estimatedWaitTime}min)`);
      });
      log('', 'green');
      passedTests++;
    } else {
      log(`✗ FAIL: Expected 3 patients, got ${response.body.queue.length}\n`, 'red');
      failedTests++;
    }
  } catch (err) {
    log(`✗ FAIL: ${err.message}\n`, 'red');
    failedTests++;
  }

  // Test 6: Admin Key Validation - Wrong Key
  totalTests++;
  try {
    log('Test 6: Admin Key Validation (Invalid Key)', 'blue');
    const response = await makeRequest('POST', '/api/serve-next', { adminKey: 'wrongkey' });
    if (response.status === 403 && response.body.error.includes('Unauthorized')) {
      log('✓ PASS: Invalid admin key correctly rejected\n', 'green');
      passedTests++;
    } else {
      log('✗ FAIL: Invalid admin key was not rejected properly\n', 'red');
      failedTests++;
    }
  } catch (err) {
    log(`✗ FAIL: ${err.message}\n`, 'red');
    failedTests++;
  }

  // Test 7: Serve Next Patient
  totalTests++;
  try {
    log('Test 7: Serve Next Patient (Admin Operation)', 'blue');
    const response = await makeRequest('POST', '/api/serve-next', { adminKey: ADMIN_KEY });
    if (response.status === 200 && response.body.servedPatient) {
      log(`✓ PASS: Patient served: ${response.body.servedPatient.name}`, 'green');
      log(`  - Wait Time: ${response.body.servedPatient.waitTime} minutes\n`, 'green');
      passedTests++;
    } else {
      log(`✗ FAIL: ${JSON.stringify(response.body)}\n`, 'red');
      failedTests++;
    }
  } catch (err) {
    log(`✗ FAIL: ${err.message}\n`, 'red');
    failedTests++;
  }

  // Test 8: Queue Numbers Recalculated
  totalTests++;
  try {
    log('Test 8: Queue Numbers Recalculated After Serving', 'blue');
    const response = await makeRequest('GET', '/api/get-queue');
    if (response.status === 200 && response.body.queue[0].queueNumber === 1) {
      log('✓ PASS: Queue numbers recalculated correctly', 'green');
      log(`  - Remaining queue has ${response.body.queue.length} patients`, 'green');
      response.body.queue.forEach((patient, idx) => {
        log(`  ${idx + 1}. ${patient.name} (Queue #${patient.queueNumber})`);
      });
      log('', 'green');
      passedTests++;
    } else {
      log('✗ FAIL: Queue numbers not recalculated\n', 'red');
      failedTests++;
    }
  } catch (err) {
    log(`✗ FAIL: ${err.message}\n`, 'red');
    failedTests++;
  }

  // Test 9: Get Analytics
  totalTests++;
  try {
    log('Test 9: Get Analytics Data', 'blue');
    const response = await makeRequest('GET', '/api/analytics');
    if (response.status === 200 && response.body.analytics) {
      const analytics = response.body.analytics;
      log('✓ PASS: Analytics data retrieved successfully', 'green');
      log(`  - Total Registered: ${analytics.totalRegistered}`);
      log(`  - Total Served: ${analytics.totalServed}`);
      log(`  - Current Queue Size: ${analytics.currentQueueSize}`);
      log(`  - Average Wait Time: ${analytics.averageWaitTime} minutes`);
      log(`  - Queue Health Score: ${analytics.queueHealthScore}/100\n`, 'green');
      passedTests++;
    } else {
      log('✗ FAIL: Analytics data not available\n', 'red');
      failedTests++;
    }
  } catch (err) {
    log(`✗ FAIL: ${err.message}\n`, 'red');
    failedTests++;
  }

  // Test 10: Reset Queue (Admin Operation)
  totalTests++;
  try {
    log('Test 10: Reset Queue (Admin Operation)', 'blue');
    const response = await makeRequest('POST', '/api/reset-queue', { adminKey: ADMIN_KEY });
    if (response.status === 200 && response.body.success) {
      log('✓ PASS: Queue reset successfully\n', 'green');
      passedTests++;
    } else {
      log('✗ FAIL: Queue reset failed\n', 'red');
      failedTests++;
    }
  } catch (err) {
    log(`✗ FAIL: ${err.message}\n`, 'red');
    failedTests++;
  }

  // Test 11: Verify Queue is Empty After Reset
  totalTests++;
  try {
    log('Test 11: Verify Queue is Empty After Reset', 'blue');
    const response = await makeRequest('GET', '/api/get-queue');
    if (response.status === 200 && response.body.queue.length === 0) {
      log('✓ PASS: Queue is empty after reset\n', 'green');
      passedTests++;
    } else {
      log(`✗ FAIL: Queue still has ${response.body.queue.length} patients\n`, 'red');
      failedTests++;
    }
  } catch (err) {
    log(`✗ FAIL: ${err.message}\n`, 'red');
    failedTests++;
  }

  // Test 12: Department Selection (Verify in Request)
  totalTests++;
  try {
    log('Test 12: Department Selection Functionality', 'blue');
    const departments = ['Emergency', 'Pediatrics', 'Surgery', 'Laboratory', 'Radiology'];
    let allDepartmentsWork = true;
    
    for (const dept of departments) {
      const patientData = {
        name: `Patient ${dept}`,
        firstName: 'Test',
        lastName: 'Patient',
        dateOfBirth: '1990-01-01',
        age: 30,
        gender: 'Male',
        phoneNumber: '555-0000',
        email: 'test@example.com',
        address: 'Test Address',
        department: dept
      };
      const response = await makeRequest('POST', '/api/join-queue', patientData);
      if (response.status !== 201) allDepartmentsWork = false;
    }
    
    if (allDepartmentsWork) {
      log('✓ PASS: All departments can be selected and processed\n', 'green');
      passedTests++;
    } else {
      log('✗ FAIL: Some departments failed\n', 'red');
      failedTests++;
    }
  } catch (err) {
    log(`✗ FAIL: ${err.message}\n`, 'red');
    failedTests++;
  }

  // Summary
  log('='.repeat(70), 'cyan');
  log(`FINAL RESULTS: ${passedTests}/${totalTests} tests passed`, passedTests === totalTests ? 'green' : 'yellow');
  log('='.repeat(70) + '\n', 'cyan');

  if (failedTests > 0) {
    log(`⚠ ${failedTests} test(s) failed`, 'red');
  } else {
    log('✓ All functionality tests passed! System is working correctly.', 'green');
  }

  process.exit(failedTests > 0 ? 1 : 0);
}

// Run tests
runTests().catch(err => {
  log(`Fatal Error: ${err.message}`, 'red');
  process.exit(1);
});
