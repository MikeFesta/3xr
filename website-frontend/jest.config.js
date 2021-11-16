// SPDX-License-Identifier: Apache-2.0
module.exports = {
  moduleNameMapper: {
    '@[/](.+)': '<rootDir>/src/$1',
  },
  moduleFileExtensions: ['js', 'ts', 'vue', 'pug'],
  transform: {
    '.*\\.(vue)$': 'vue-jest',
    '.*\\.(ts)$': 'ts-jest',
    '.*\\.(pug)$': 'jest-transform-pug',
  },
  cache: false,
  globals: {
    'vue-jest': {
      tsConfig: true,
      pug: {
        baseDir: '<rootDir>/src',
      },
    },
    'ts-jest': {
      babelConfig: true,
    },
  },
  testRegex: '(/__tests__/.*|(\\.|/)(test|spec))\\.(jsx?|tsx?)$',
  setupFilesAfterEnv: ['<rootDir>/tests/setup.js'],
  snapshotSerializers: ['<rootDir>/node_modules/jest-serializer-vue'],
};
