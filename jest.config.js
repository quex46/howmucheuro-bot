Object.assign(module.exports, {
  testEnvironment: 'node',
  testMatch: ['**/*.test.ts'],
  transform: {
    '^.+\\.tsx?$': 'ts-jest',
  },
  preset: 'ts-jest',
  collectCoverage: false,
  coverageDirectory: 'coverage',
  collectCoverageFrom: ['src/**/*.ts'],
  coverageReporters: ['lcov', 'text'],
  coverageThreshold: {
    global: {
      branches: 80,
      functions: 80,
      lines: 80,
      statements: -10,
    },
  },
});
