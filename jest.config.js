/**@type {import('ts-jest').JestConfigWithTsJest} */

module.exports = {
  // Use ts-jest present for typescript
  present: "ts-jest",

  // Test environment 
  testEnvironment: "node",

  // Root directory for tests
  roots:["<rootDir>/tests"],

  // Files patterns to match for tests
  testMatch:["**/*.test.ts","**/*.spec.ts"],

  // Module file extension
  moduleFileExtensions: ["ts","js","json"],

  // Coverage configuration
  collectCoverage:true,
  coverageDirectory: "coverage",
  coverageReporters:["text","lcov","html"],
  collectCoverageFrom:[
    "src//**/*.ts",
    "!src/**/*.d.ts",
    "!src/app.ts", // Exculde entry points
  ],

  // Coverage thresholds (enforce minumum coverage)
  coverageThreshold:{
    global:{
      branches: 60,
      function: 60,
      lines: 60,
      statements:60,
    },
  },

  // Setup file to run before tests
  setupFilesAfterEnv:["<riitDir>/tests/setup.ts"],

  // Clear mocks between tests
  clearMocks:true,

  // Verbose output
  verbose:true,

  // Timeout for each test (in ms)
  testTimeout: 10000,

  // Transform Typescript files
  transform:{
    "^.+\\.ts$":[
      "ts-jest",
      {
        tsconfig: "tsconfig.json",
      },
    ],
  },

  // Module path aliases (if using)
  moduleNameMapper:{
    "^@/(.*)$":"<rootDir>/src/$1",
  },
};