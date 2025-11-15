const { parseSGX } = require('./dist/index');
const fs = require('fs');
const path = require('path');

// Test counter
let testsPassed = 0;
let testsFailed = 0;

// Helper function to run tests
function test(name, fn) {
  try {
    fn();
    console.log(`✅ ${name}`);
    testsPassed++;
  } catch (error) {
    console.error(`❌ ${name}`);
    console.error(`   Error: ${error.message}`);
    testsFailed++;
  }
}

// Helper to assert equality
function assertEqual(actual, expected, message) {
  if (JSON.stringify(actual) !== JSON.stringify(expected)) {
    throw new Error(`${message}\n   Expected: ${JSON.stringify(expected)}\n   Actual: ${JSON.stringify(actual)}`);
  }
}

function assertThrows(fn, message) {
  try {
    fn();
    throw new Error(`${message} - Expected function to throw but it didn't`);
  } catch (error) {
    if (error.message.includes('Expected function to throw')) {
      throw error;
    }
    // Function threw as expected
  }
}

console.log('\n🧪 Running SDX Parser Test Suite\n');
console.log('='.repeat(50));

// ============================================
// BASIC FUNCTIONALITY TESTS
// ============================================

console.log('\n📋 Basic Functionality Tests\n');

test('Parse simple users data', () => {
  const sdx = `
users:
id, name, email
1, Alice, alice@example.com
2, Bob, bob@example.com
`;
  
  const result = parseSGX(sdx);
  assertEqual(result.users.length, 2, 'Should have 2 users');
  assertEqual(result.users[0].id, 1, 'First user ID should be 1 (number)');
  assertEqual(result.users[0].name, 'Alice', 'First user name should be Alice');
  assertEqual(result.users[1].email, 'bob@example.com', 'Second user email should match');
});

test('Parse products with different data types', () => {
  const sdx = `
products:
id, name, price, stock, active
101, Widget, 19.99, 100, true
102, Gadget, 29.50, 0, false
`;
  
  const result = parseSGX(sdx);
  assertEqual(result.products.length, 2, 'Should have 2 products');
  assertEqual(typeof result.products[0].price, 'number', 'Price should be a number');
  assertEqual(result.products[0].price, 19.99, 'First product price should be 19.99');
  assertEqual(result.products[1].stock, 0, 'Second product stock should be 0');
});

test('Parse single row', () => {
  const sdx = `
config:
key, value
timeout, 5000
`;
  
  const result = parseSGX(sdx);
  assertEqual(result.config.length, 1, 'Should have 1 config item');
  assertEqual(result.config[0].value, 5000, 'Value should be 5000 (number)');
});

// ============================================
// DATA TYPE CONVERSION TESTS
// ============================================

console.log('\n🔢 Data Type Conversion Tests\n');

test('Convert integers correctly', () => {
  const sdx = `
numbers:
value
42
0
-15
`;
  
  const result = parseSGX(sdx);
  assertEqual(result.numbers[0].value, 42, 'Should convert 42 to number');
  assertEqual(result.numbers[1].value, 0, 'Should convert 0 to number');
  assertEqual(result.numbers[2].value, -15, 'Should convert -15 to number');
  assertEqual(typeof result.numbers[0].value, 'number', 'Values should be numbers');
});

test('Convert decimals correctly', () => {
  const sdx = `
decimals:
amount
3.14
0.001
-2.5
`;
  
  const result = parseSGX(sdx);
  assertEqual(result.decimals[0].amount, 3.14, 'Should convert 3.14 to number');
  assertEqual(result.decimals[1].amount, 0.001, 'Should convert 0.001 to number');
  assertEqual(result.decimals[2].amount, -2.5, 'Should convert -2.5 to number');
});

test('Keep strings as strings', () => {
  const sdx = `
data:
text
hello
123abc
abc123
`;
  
  const result = parseSGX(sdx);
  assertEqual(typeof result.data[0].text, 'string', 'Should keep "hello" as string');
  assertEqual(typeof result.data[1].text, 'string', 'Should keep "123abc" as string');
  assertEqual(typeof result.data[2].text, 'string', 'Should keep "abc123" as string');
});

// ============================================
// WHITESPACE HANDLING TESTS
// ============================================

console.log('\n🔲 Whitespace Handling Tests\n');

test('Trim whitespace from headers', () => {
  const sdx = `
items:
  id  ,  name  ,  price  
1, Widget, 10
`;
  
  const result = parseSGX(sdx);
  assertEqual(result.items[0].id, 1, 'Should parse correctly despite header whitespace');
  assertEqual(result.items[0].name, 'Widget', 'Should have name field');
  assertEqual(result.items[0].price, 10, 'Should have price field');
});

test('Trim whitespace from values', () => {
  const sdx = `
data:
field
  value with spaces  
`;
  
  const result = parseSGX(sdx);
  assertEqual(result.data[0].field, 'value with spaces', 'Should trim outer whitespace but keep inner');
});

test('Handle empty lines', () => {
  const sdx = `

users:

id, name

1, Alice

2, Bob

`;
  
  const result = parseSGX(sdx);
  assertEqual(result.users.length, 2, 'Should handle empty lines correctly');
});

// ============================================
// EDGE CASES
// ============================================

console.log('\n⚠️  Edge Case Tests\n');

test('Parse empty values', () => {
  const sdx = `
data:
id, name, optional
1, Alice, 
2, Bob, value
`;
  
  const result = parseSGX(sdx);
  assertEqual(result.data[0].optional, '', 'Empty value should be empty string');
  assertEqual(result.data[1].optional, 'value', 'Non-empty value should be preserved');
});

test('Handle special characters in data', () => {
  const sdx = `
messages:
id, text
1, Hello@World!
2, Price: $99.99
3, Email: test@example.com
`;
  
  const result = parseSGX(sdx);
  assertEqual(result.messages[0].text, 'Hello@World!', 'Should handle @ symbol');
  assertEqual(result.messages[1].text, 'Price: $99.99', 'Should handle $ and :');
  assertEqual(result.messages[2].text, 'Email: test@example.com', 'Should handle email format');
});

test('Handle large numbers', () => {
  const sdx = `
numbers:
value
999999999
1000000000
-999999999
`;
  
  const result = parseSGX(sdx);
  assertEqual(result.numbers[0].value, 999999999, 'Should handle large positive numbers');
  assertEqual(result.numbers[1].value, 1000000000, 'Should handle very large numbers');
  assertEqual(result.numbers[2].value, -999999999, 'Should handle large negative numbers');
});

test('Handle different object names', () => {
  const sdx1 = `
camelCase:
id, name
1, Test
`;
  
  const sdx2 = `
snake_case:
id, name
1, Test
`;
  
  const sdx3 = `
PascalCase:
id, name
1, Test
`;
  
  const result1 = parseSGX(sdx1);
  const result2 = parseSGX(sdx2);
  const result3 = parseSGX(sdx3);
  
  assertEqual(!!result1.camelCase, true, 'Should handle camelCase object names');
  assertEqual(!!result2.snake_case, true, 'Should handle snake_case object names');
  assertEqual(!!result3.PascalCase, true, 'Should handle PascalCase object names');
});

// ============================================
// ERROR HANDLING TESTS
// ============================================

console.log('\n🚨 Error Handling Tests\n');

test('Throw error when first line missing colon', () => {
  const sdx = `
users
id, name
1, Alice
`;
  
  assertThrows(() => parseSGX(sdx), 'Should throw error for missing colon');
});

test('Throw error for invalid format', () => {
  const sdx = `users`;
  
  assertThrows(() => parseSGX(sdx), 'Should throw error for incomplete format');
});

test('Handle missing data rows gracefully', () => {
  const sdx = `
empty:
id, name
`;
  
  const result = parseSGX(sdx);
  assertEqual(result.empty.length, 0, 'Should return empty array for no data rows');
});

// ============================================
// REAL-WORLD SCENARIOS
// ============================================

console.log('\n🌍 Real-World Scenario Tests\n');

test('E-commerce product catalog', () => {
  const sdx = `
products:
sku, name, price, category, inStock, rating
SKU001, Laptop, 999.99, Electronics, 50, 4.5
SKU002, Mouse, 24.99, Electronics, 150, 4.8
SKU003, Desk, 299.00, Furniture, 30, 4.2
`;
  
  const result = parseSGX(sdx);
  assertEqual(result.products.length, 3, 'Should have 3 products');
  assertEqual(result.products[0].sku, 'SKU001', 'SKU should be string');
  assertEqual(typeof result.products[0].price, 'number', 'Price should be number');
  assertEqual(result.products[2].rating, 4.2, 'Rating should be decimal');
});

test('User authentication data', () => {
  const sdx = `
users:
userId, username, email, createdAt, isActive
1001, john_doe, john@example.com, 2025-01-15, true
1002, jane_smith, jane@example.com, 2025-02-20, true
1003, bob_wilson, bob@example.com, 2025-03-10, false
`;
  
  const result = parseSGX(sdx);
  assertEqual(result.users.length, 3, 'Should have 3 users');
  assertEqual(typeof result.users[0].userId, 'number', 'User ID should be number');
  assertEqual(result.users[0].email, 'john@example.com', 'Email should be preserved');
  assertEqual(result.users[2].isActive, 'false', 'Boolean string should be preserved as string');
});

test('API endpoints configuration', () => {
  const sdx = `
endpoints:
name, method, path, timeout, retries
getUsers, GET, /api/users, 5000, 3
createUser, POST, /api/users, 10000, 1
updateUser, PUT, /api/users/:id, 8000, 2
`;
  
  const result = parseSGX(sdx);
  assertEqual(result.endpoints.length, 3, 'Should have 3 endpoints');
  assertEqual(result.endpoints[0].timeout, 5000, 'Timeout should be number');
  assertEqual(result.endpoints[1].path, '/api/users', 'Path should be preserved');
});

test('CSV-like data with mixed types', () => {
  const sdx = `
transactions:
transactionId, date, amount, currency, status
TX001, 2025-11-15, 150.50, USD, completed
TX002, 2025-11-14, 299.99, EUR, pending
TX003, 2025-11-13, 75.00, GBP, failed
`;
  
  const result = parseSGX(sdx);
  assertEqual(result.transactions.length, 3, 'Should have 3 transactions');
  assertEqual(typeof result.transactions[0].amount, 'number', 'Amount should be number');
  assertEqual(result.transactions[1].currency, 'EUR', 'Currency should be string');
});

// ============================================
// SUMMARY
// ============================================

console.log('\n' + '='.repeat(50));
console.log('\n📊 Test Results Summary\n');
console.log(`✅ Passed: ${testsPassed}`);
console.log(`❌ Failed: ${testsFailed}`);
console.log(`📈 Total: ${testsPassed + testsFailed}`);
console.log(`🎯 Success Rate: ${((testsPassed / (testsPassed + testsFailed)) * 100).toFixed(1)}%`);

if (testsFailed === 0) {
  console.log('\n🎉 All tests passed! Your SDX parser is working perfectly!\n');
  process.exit(0);
} else {
  console.log('\n⚠️  Some tests failed. Please review the errors above.\n');
  process.exit(1);
}
