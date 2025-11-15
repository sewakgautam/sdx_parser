# 📊 SDX Parser

> A beautifully simple, human-readable alternative to JSON for tabular data.

## ✨ Why SDX?

Stop writing verbose JSON for tabular data. SDX (Simple Data eXchange) makes your data files readable, maintainable, and elegant.

### The Problem with JSON

```json
{
  "users": [
    { "id": 1, "name": "Alice", "email": "alice@example.com", "age": 28 },
    { "id": 2, "name": "Bob", "email": "bob@example.com", "age": 32 },
    { "id": 3, "name": "Charlie", "email": "charlie@example.com", "age": 25 }
  ]
}
```

❌ Repetitive keys  
❌ Hard to scan visually  
❌ Lots of braces and quotes  
❌ Difficult to edit manually  

### The SDX Solution

```
users:
id, name, email, age
1, Alice, alice@example.com, 28
2, Bob, bob@example.com, 32
3, Charlie, charlie@example.com, 25
```

✅ Clean and minimal  
✅ Easy to read and edit  
✅ Perfect for config files  
✅ Converts to JSON automatically  

## 🚀 Installation

```bash
npm install @sewakgautam/sdx
```

## 📖 Quick Start

### Parse SDX String

```javascript
const { parseSGX } = require('@sewakgautam/sdx');

const data = `
users:
id, name, email
1, Alice, alice@example.com
2, Bob, bob@example.com
`;

const result = parseSGX(data);
console.log(result);
```

**Output:**
```javascript
{
  users: [
    { id: 1, name: 'Alice', email: 'alice@example.com' },
    { id: 2, name: 'Bob', email: 'bob@example.com' }
  ]
}
```

### Load SDX File

```javascript
const { loadSGX } = require('@sewakgautam/sdx');

// Load from file
const data = loadSGX('./data/users.sgx');
console.log(data.users[0].name); // "Alice"
```

## 📝 Format Specification

SDX format has just three simple rules:

1. **Line 1:** Object name + colon (`:`)
2. **Line 2:** Comma-separated headers
3. **Line 3+:** Comma-separated values

### Example: Products

```
products:
id, name, price, inStock, category
101, Laptop, 999.99, 50, Electronics
102, Mouse, 24.99, 150, Electronics
103, Desk, 299.00, 30, Furniture
```

## 🎯 Features

| Feature | Description |
|---------|-------------|
| **Auto Type Conversion** | Numbers are automatically converted from strings |
| **Whitespace Trimming** | Spaces around values are cleaned up |
| **Simple Syntax** | No complex escaping or special characters |
| **Lightweight** | Zero dependencies, minimal footprint |
| **Node.js Ready** | Works seamlessly with Node.js file system |

## 🔧 API Reference

### `parseSGX(text)`

Parses an SDX format string into a JavaScript object.

**Parameters:**
- `text` (string) - The SDX format string

**Returns:** `Object` - Parsed data object

**Throws:** `Error` - If format is invalid

**Example:**
```javascript
const result = parseSGX('users:\nid, name\n1, Alice');
```

### `loadSGX(filePath)`

Loads and parses an SDX file from the filesystem.

**Parameters:**
- `filePath` (string) - Path to the .sgx file

**Returns:** `Object` - Parsed data object

**Throws:** `Error` - If file not found or format is invalid

**Example:**
```javascript
const data = loadSGX('./config/settings.sgx');
```

## 💡 Use Cases

### Configuration Files

```
database:
host, port, database, username
localhost, 5432, myapp_db, admin
```

### Test Data

```
testCases:
id, input, expected, description
1, hello, HELLO, Convert to uppercase
2, world, WORLD, Another uppercase test
```

### CSV Alternative

SDX is perfect when you need labeled data but CSV feels too generic:

```
employees:
employeeId, firstName, lastName, department, salary
E001, John, Doe, Engineering, 95000
E002, Jane, Smith, Marketing, 87000
```

## 🎨 Real-World Examples

### E-commerce Products

```
products:
sku, name, price, stock, rating
SKU001, Wireless Mouse, 29.99, 150, 4.5
SKU002, USB Keyboard, 49.99, 75, 4.8
SKU003, Monitor Stand, 39.99, 50, 4.2
```

### API Endpoints Config

```
endpoints:
name, method, path, rateLimit
getUsers, GET, /api/users, 100
createUser, POST, /api/users, 50
updateUser, PUT, /api/users/:id, 50
```

### Game High Scores

```
highScores:
rank, player, score, date
1, ProGamer123, 99999, 2025-11-15
2, SpeedRunner, 85000, 2025-11-14
3, CasualPlayer, 72000, 2025-11-13
```

## 🤝 Contributing

Contributions are welcome! Feel free to:

- 🐛 Report bugs
- 💡 Suggest new features
- 🔧 Submit pull requests

## 📄 License

MIT © Sewak Gautam

## 🌟 Show Your Support

If you find SDX Parser useful, give it a ⭐️ on [GitHub](https://github.com/sewakgautam/sdx-parser)!

---

**Made with ❤️ by [Sewak Gautam](https://github.com/sewakgautam)**
