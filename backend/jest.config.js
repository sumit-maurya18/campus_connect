module.exports = {
    testEnvironment: 'node',
    coveragePathIgnorePatterns: ['/node_modules/'],
    testTimeout: 30000,
    setupFilesAfterEnv: ['<rootDir>/tests/setup.js'],
    collectCoverageFrom: [
      'src/**/*.js',
      '!src/server.js',
      '!src/utils/seeder.js'
    ],
    testMatch: [
      '**/tests/**/*.test.js'
    ],
    verbose: true,
    forceExit: true,
    detectOpenHandles: false,
    // Suppress console warnings during tests
    silent: false
  };