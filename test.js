const { parseSGX } = require('./index');

// Test 1: Basic parsing
console.log('Test 1: Basic users example');
const test1 = `
users:
id, name, email
1, sk, sk@mail.com
2, sk2, sk2@mail.com
`;

const result1 = parseSGX(test1);
console.log(JSON.stringify(result1, null, 2));
console.assert(result1.users.length === 2, 'Should have 2 users');
console.assert(result1.users[0].id === 1, 'First user ID should be 1');
console.assert(result1.users[0].name === 'sk', 'First user name should be sk');
console.log('✓ Test 1 passed\n');

// Test 2: Number conversion
console.log('Test 2: Number conversion');
const test2 = `
products:
id, name, price, stock
1, Widget, 19.99, 100
2, Gadget, 29.50, 50
`;

const result2 = parseSGX(test2);
console.log(JSON.stringify(result2, null, 2));
console.assert(typeof result2.products[0].price === 'number', 'Price should be a number');
console.assert(result2.products[0].price === 19.99, 'Price should be 19.99');
console.log('✓ Test 2 passed\n');

// Test 3: Invalid format (should throw)
console.log('Test 3: Invalid format handling');
try {
    const test3 = `
    users
    id, name
    1, sk
    `;
    parseSGX(test3);
    console.log('✗ Test 3 failed - should have thrown error');
} catch (e) {
    console.log('✓ Test 3 passed - correctly threw error:', e.message, '\n');
}

// Test 4: Extra whitespace handling
console.log('Test 4: Whitespace handling');
const test4 = `
settings:
key  ,  value  ,  type
timeout  ,  5000  ,  number
theme  ,  dark  ,  string
`;

const result4 = parseSGX(test4);
console.log(JSON.stringify(result4, null, 2));
console.assert(result4.settings[0].key === 'timeout', 'Should trim whitespace from keys');
console.assert(result4.settings[0].value === 5000, 'Should convert number values');
console.log('✓ Test 4 passed\n');

console.log('All tests completed! ✨');
