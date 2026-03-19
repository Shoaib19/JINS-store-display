import { type JestConfigWithTsJest } from 'ts-jest';
import { defaults as tsjPreset } from 'ts-jest/presets';

const jestConfig: JestConfigWithTsJest = {
  preset: 'ts-jest',
  testEnvironment: 'node',
  verbose: true,
  roots: ['<rootDir>'],
  transform: {
    ...tsjPreset.transform,
  },
  modulePaths: ['<rootDir>/app/src'],
  moduleNameMapper: {
    '^~/(.+)': '<rootDir>/app/$1',
    '^~test/(.+)': '<rootDir>/test/$1',
  },
  moduleDirectories: ['node_modules', '<rootDir>'],
  reporters: [
    'default',
    [
      '<rootDir>/node_modules/jest-html-reporters', {
        'pageTitle': 'dj36-sales-openapi-sample',
        'publicPath': '<rootDir>/docs/jest-report',
        'filename': 'index.html',
        'includeFailureMsg': true,
        'openReport': false
      }
    ]
  ],
  collectCoverage: true,
  coverageProvider: 'v8',
  coverageDirectory: '<rootDir>/docs/jest-report/coverage',
  coverageReporters: ['json-summary', 'html'],
  collectCoverageFrom: [
    '<rootDir>/app/src/presenters/**/*.ts',
    '!<rootDir>/app/src/presenters/interfaces.ts',
    '!<rootDir>/app/src/presenters/dummy/**',
    '<rootDir>/app/src/clients/**/*.ts',
    '!<rootDir>/app/src/clients/**/*Types.ts',
    '<rootDir>/app/src/models/**/*.ts',
  ],
coveragePathIgnorePatterns: ['^//+'],
  testMatch: ['**/__tests__/**/*.test.ts',],
};

export default jestConfig;
