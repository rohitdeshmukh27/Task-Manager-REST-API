// ========================
// JEST TEST SETUP
// ========================

import dotenv from "dotenv";

// Load test environment variables
dotenv.config({ path: "../.env.test" });

// Set test environment 
process.env.NODE_ENV ="tests";

// Global test timeout
jest.setTimeout(10000);

// Suppress console logs during tests (optional)
// Uncomment to hide console output during tests
// global.console ={
//     ...console,
//     log:jest.fn(),
//     debug: jest.fn(),
//     info: jest.fn(),
//     warn: jest.fn(),
//     error: jest.fn(),
// };

// Clean up after all tests
afterAll(async () => {
    // Add clearnup logic here if needed
    // eg. close database connections
});

beforeEach(()=>{
    jest.clearAllMocks();
});