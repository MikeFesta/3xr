module.exports = {
  // A preset that is used as a base for Jest's configuration
  preset: 'ts-jest',

  // The test environment that will be used for testing
  testEnvironment: 'node',
  roots: ['<rootDir>'],
  modulePaths: ['<rootDir>'],

  // The regexp pattern or array of patterns that Jest uses to detect test files
  testRegex: ['app/tests/*'],
  snapshotSerializers: ['jest-serializer-html-string'],
  testPathIgnorePatterns: ['__snapshots__'],
  moduleDirectories: ['<rootDir>/node_modules', 'node_modules'],
  transform: {
    '^.+\\.ts$': 'ts-jest',
  },
  modulePathIgnorePatterns: ['<rootDir>/build/'],
  moduleNameMapper: {
    '^@root/(.*)$': '<rootDir>/app/$1',
    '^@access/(.*)$': '<rootDir>/app/access/$1',
    '^@cors/(.*)$': '<rootDir>/app/cors/$1',
    '^@models/(.*)$': '<rootDir>/app/models/$1',
    '^@routes/(.*)$': '<rootDir>/app/routes/$1',
    '^@services/(.*)$': '<rootDir>/app/services/$1',
    '^@types$': '<rootDir>/node_modules/3xr_types/index.d.ts',
    '^@enums$': '<rootDir>/node_modules/3xr_types/enums.ts',
  },
};
