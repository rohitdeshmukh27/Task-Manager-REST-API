# 📚 Node.js & TypeScript - Basic Fundamentals

## 🎯 Learning Path for Beginners

**Prerequisites:** Basic JavaScript knowledge
**Time to Complete:** 2-3 hours

---

# 🟢 SECTION 1: TypeScript Basics

---

## 1.1 What is TypeScript?

TypeScript is **JavaScript with types**. It helps catch errors before running your code.

```typescript
// JavaScript (no type safety)
let name = "John";
name = 42; // No error, but could cause bugs

// TypeScript (type safe)
let name: string = "John";
name = 42; // ❌ Error: Type 'number' is not assignable to type 'string'
```

---

## 1.2 Basic Types

```typescript
// ============================================
// PRIMITIVE TYPES
// ============================================

// String - text values
let firstName: string = "John";
let greeting: string = `Hello, ${firstName}!`; // Template literal

// Number - integers and decimals
let age: number = 25;
let price: number = 19.99;
let hex: number = 0xff; // Hexadecimal

// Boolean - true/false
let isActive: boolean = true;
let isComplete: boolean = false;

// Null and Undefined
let nothing: null = null;
let notDefined: undefined = undefined;

// ============================================
// TYPE INFERENCE
// ============================================

// TypeScript can infer types automatically
let city = "New York"; // TypeScript knows this is a string
let count = 10; // TypeScript knows this is a number

// ============================================
// ANY TYPE (avoid when possible)
// ============================================

let anything: any = "hello";
anything = 42; // No error, but defeats the purpose of TypeScript
anything = true; // Still no error
```

---

## 1.3 Arrays and Tuples

```typescript
// ============================================
// ARRAYS
// ============================================

// Array of strings
let fruits: string[] = ["apple", "banana", "orange"];

// Alternative syntax
let numbers: Array<number> = [1, 2, 3, 4, 5];

// Array methods work as expected
fruits.push("mango");
let firstFruit: string = fruits[0];

// ============================================
// TUPLES (fixed-length arrays with specific types)
// ============================================

// Tuple with exactly 2 elements
let person: [string, number] = ["John", 25];

// Accessing tuple elements
let personName: string = person[0]; // "John"
let personAge: number = person[1]; // 25

// ❌ Error: wrong type order
// let wrongPerson: [string, number] = [25, "John"];
```

---

## 1.4 Objects and Interfaces

```typescript
// ============================================
// OBJECT TYPE
// ============================================

// Inline object type
let user: { name: string; age: number } = {
  name: "John",
  age: 25,
};

// ============================================
// INTERFACES (preferred for objects)
// ============================================

// Define a reusable shape
interface User {
  name: string;
  age: number;
  email: string;
}

// Use the interface
let newUser: User = {
  name: "Jane",
  age: 30,
  email: "jane@example.com",
};

// ============================================
// OPTIONAL PROPERTIES
// ============================================

interface Product {
  id: number;
  name: string;
  price: number;
  description?: string; // Optional (can be undefined)
}

let phone: Product = {
  id: 1,
  name: "iPhone",
  price: 999,
  // description is optional, so we can skip it
};

// ============================================
// READONLY PROPERTIES
// ============================================

interface Config {
  readonly apiKey: string;
  readonly baseUrl: string;
}

let config: Config = {
  apiKey: "abc123",
  baseUrl: "https://api.example.com",
};

// config.apiKey = "xyz"; // ❌ Error: Cannot assign to 'apiKey' because it is a read-only property
```

---

## 1.5 Functions

```typescript
// ============================================
// FUNCTION PARAMETER AND RETURN TYPES
// ============================================

// Basic function with types
function add(a: number, b: number): number {
  return a + b;
}

let result: number = add(5, 3); // 8

// ============================================
// ARROW FUNCTIONS
// ============================================

const multiply = (a: number, b: number): number => {
  return a * b;
};

// Shorthand for single expression
const double = (n: number): number => n * 2;

// ============================================
// OPTIONAL AND DEFAULT PARAMETERS
// ============================================

function greet(name: string, greeting?: string): string {
  return `${greeting || "Hello"}, ${name}!`;
}

greet("John"); // "Hello, John!"
greet("John", "Hi"); // "Hi, John!"

// Default parameter
function greetWithDefault(name: string, greeting: string = "Hello"): string {
  return `${greeting}, ${name}!`;
}

// ============================================
// VOID RETURN TYPE (function returns nothing)
// ============================================

function logMessage(message: string): void {
  console.log(message);
  // No return statement needed
}

// ============================================
// FUNCTION TYPE
// ============================================

// Variable that holds a function
let mathOperation: (a: number, b: number) => number;

mathOperation = add;
mathOperation = multiply;
// mathOperation = greet; // ❌ Error: wrong signature
```

---

## 1.6 Union and Literal Types

```typescript
// ============================================
// UNION TYPES (can be one of several types)
// ============================================

let id: string | number;
id = "abc123"; // ✅ Valid
id = 12345; // ✅ Valid
// id = true;     // ❌ Error

// Function accepting union type
function printId(id: string | number): void {
  console.log(`ID: ${id}`);
}

// ============================================
// LITERAL TYPES (exact values)
// ============================================

// Only these exact values are allowed
let direction: "north" | "south" | "east" | "west";
direction = "north"; // ✅ Valid
// direction = "up";   // ❌ Error

// Commonly used for status
type Status = "pending" | "approved" | "rejected";

let orderStatus: Status = "pending";
orderStatus = "approved"; // ✅ Valid
// orderStatus = "cancelled"; // ❌ Error

// ============================================
// TYPE ALIASES
// ============================================

// Create reusable type
type ID = string | number;
type Point = { x: number; y: number };

let userId: ID = "user_123";
let coordinate: Point = { x: 10, y: 20 };
```

---

# 🟢 SECTION 2: Node.js Basics

---

## 2.1 What is Node.js?

Node.js lets you run JavaScript/TypeScript **outside the browser** (on servers, computers, etc.).

```
┌─────────────────────────────────────────────────────────────┐
│                    BROWSER vs NODE.js                       │
├─────────────────────────────────────────────────────────────┤
│                                                             │
│   BROWSER                      NODE.js                      │
│   ────────                     ───────                      │
│   • Has window object          • Has process object         │
│   • Has DOM (document)         • No DOM                     │
│   • Can't access files         • Can access file system     │
│   • Limited to web APIs        • Full system access         │
│   • Runs in sandbox            • Runs with permissions      │
│                                                             │
└─────────────────────────────────────────────────────────────┘
```

---

## 2.2 Setting Up a TypeScript Node.js Project

```bash
# Step 1: Create project folder
mkdir my-node-project
cd my-node-project

# Step 2: Initialize npm
npm init -y

# Step 3: Install TypeScript and Node types
npm install -D typescript @types/node ts-node-dev

# Step 4: Create tsconfig.json
npx tsc --init
```

**Basic tsconfig.json:**

```json
{
  "compilerOptions": {
    "target": "ES2020",
    "module": "commonjs",
    "rootDir": "./src",
    "outDir": "./dist",
    "strict": true,
    "esModuleInterop": true,
    "skipLibCheck": true,
    "forceConsistentCasingInFileNames": true
  },
  "include": ["src/**/*"],
  "exclude": ["node_modules"]
}
```

---

## 2.3 Console and Process

```typescript
// ============================================
// CONSOLE METHODS
// ============================================

console.log("Regular log message");
console.info("Info message");
console.warn("Warning message");
console.error("Error message");

// Formatted output
const name = "John";
const age = 25;
console.log(`Name: ${name}, Age: ${age}`);

// Object logging
const user = { name: "John", age: 25 };
console.log(user);
console.table(user); // Pretty table format

// ============================================
// PROCESS OBJECT
// ============================================

// Current working directory
console.log(process.cwd());

// Node.js version
console.log(process.version);

// Environment variables
console.log(process.env.NODE_ENV);
console.log(process.env.PATH);

// Command line arguments
console.log(process.argv);
// ['/path/to/node', '/path/to/script.js', 'arg1', 'arg2']

// Exit the process
// process.exit(0);  // Success
// process.exit(1);  // Error
```

---

## 2.4 Modules (Import/Export)

**File: math.ts**

```typescript
// ============================================
// NAMED EXPORTS
// ============================================

export const PI = 3.14159;

export function add(a: number, b: number): number {
  return a + b;
}

export function subtract(a: number, b: number): number {
  return a - b;
}

// ============================================
// DEFAULT EXPORT (one per file)
// ============================================

export default class Calculator {
  add(a: number, b: number): number {
    return a + b;
  }

  multiply(a: number, b: number): number {
    return a * b;
  }
}
```

**File: app.ts**

```typescript
// ============================================
// IMPORTING
// ============================================

// Import named exports
import { PI, add, subtract } from "./math";

console.log(PI); // 3.14159
console.log(add(2, 3)); // 5

// Import default export
import Calculator from "./math";

const calc = new Calculator();
console.log(calc.multiply(4, 5)); // 20

// Import everything
import * as MathUtils from "./math";

console.log(MathUtils.PI);
console.log(MathUtils.add(1, 2));

// Rename imports
import { add as sum } from "./math";
console.log(sum(10, 20)); // 30
```

---

## 2.5 File System Basics

```typescript
import fs from "fs";
import path from "path";

// ============================================
// READING FILES
// ============================================

// Synchronous (blocks execution)
const content = fs.readFileSync("file.txt", "utf-8");
console.log(content);

// Asynchronous with callback
fs.readFile("file.txt", "utf-8", (err, data) => {
  if (err) {
    console.error("Error reading file:", err);
    return;
  }
  console.log(data);
});

// ============================================
// WRITING FILES
// ============================================

// Synchronous
fs.writeFileSync("output.txt", "Hello, World!");

// Asynchronous
fs.writeFile("output.txt", "Hello, World!", (err) => {
  if (err) {
    console.error("Error writing file:", err);
    return;
  }
  console.log("File written successfully!");
});

// ============================================
// PATH MODULE
// ============================================

// Join paths safely (works on all OS)
const filePath = path.join(__dirname, "data", "file.txt");
console.log(filePath);

// Get file extension
console.log(path.extname("document.pdf")); // .pdf

// Get filename
console.log(path.basename("/folder/file.txt")); // file.txt

// Get directory
console.log(path.dirname("/folder/file.txt")); // /folder
```

---

## 2.6 Asynchronous JavaScript Basics

```typescript
// ============================================
// CALLBACKS (old way)
// ============================================

function fetchDataCallback(callback: (data: string) => void): void {
  setTimeout(() => {
    callback("Data loaded!");
  }, 1000);
}

fetchDataCallback((data) => {
  console.log(data);
});

// ============================================
// PROMISES (better way)
// ============================================

function fetchDataPromise(): Promise<string> {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      const success = true;
      if (success) {
        resolve("Data loaded!");
      } else {
        reject(new Error("Failed to load data"));
      }
    }, 1000);
  });
}

// Using .then() and .catch()
fetchDataPromise()
  .then((data) => {
    console.log(data);
  })
  .catch((error) => {
    console.error(error);
  });

// ============================================
// ASYNC/AWAIT (best way - recommended)
// ============================================

async function loadData(): Promise<void> {
  try {
    const data = await fetchDataPromise();
    console.log(data);
  } catch (error) {
    console.error(error);
  }
}

loadData();

// ============================================
// MULTIPLE PROMISES
// ============================================

const promise1 = Promise.resolve(1);
const promise2 = Promise.resolve(2);
const promise3 = Promise.resolve(3);

// Wait for all
const results = await Promise.all([promise1, promise2, promise3]);
console.log(results); // [1, 2, 3]

// Wait for first to complete
const first = await Promise.race([promise1, promise2, promise3]);
console.log(first); // 1 (whichever resolves first)
```

---

# 🎯 PRACTICE EXERCISES - BASICS

## Exercise 1: TypeScript Types

```typescript
// TODO: Create interfaces for a Book and Library system
// Book should have: id, title, author, year, isAvailable
// Library should have: name, books (array of Book), location

// Your code here:
```

## Exercise 2: Functions

```typescript
// TODO: Create a function that:
// 1. Takes an array of numbers
// 2. Returns an object with: sum, average, min, max
// Use proper TypeScript types

// Your code here:
```

## Exercise 3: File Operations

```typescript
// TODO: Create a simple logger that:
// 1. Writes log messages to a file
// 2. Includes timestamp with each log
// 3. Has methods: info(), warn(), error()

// Your code here:
```

---

# ✅ Basics Checklist

- [ ] Understand primitive types (string, number, boolean)
- [ ] Create and use interfaces
- [ ] Write typed functions with parameters and return types
- [ ] Use arrays and tuples
- [ ] Understand union and literal types
- [ ] Import/export modules
- [ ] Read and write files with fs module
- [ ] Use async/await with Promises

---

**Next:** Move to `NODEJS_TYPESCRIPT_INTERMEDIATE.md` for more advanced concepts!
