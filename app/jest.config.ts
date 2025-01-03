import { pathsToModuleNameMapper } from 'ts-jest';
import { compilerOptions } from './tsconfig.json';

export default {
  moduleFileExtensions: ['js', 'json', 'ts'],
  rootDir: './',
  testRegex: '.*\\.spec\\.ts$',
  transform: {
    '^.+\\.(t|j)s$': ['ts-jest', { isolatedModules: true }],
  },
  verbose: true,

  collectCoverage: true,
  collectCoverageFrom: ['src/core/**/*.ts','src/entrypoints/**/*.ts',  'src/infrastructure/**/*.ts', 'src/shared/**/*.ts'],
  coverageDirectory: 'coverage',
  coveragePathIgnorePatterns: ['<rootDir>/dist/', '<rootDir>/node_modules/'],
  coverageProvider: 'v8',
  coverageReporters: ['json-summary', 'text', 'lcov', 'html'],
  reporters: ['default', ['jest-junit', { outputDirectory: 'coverage' }]],
  preset: 'ts-jest',
  runner: 'groups',
  testEnvironment: 'node',
  moduleDirectories: ['node_modules', 'src', 'test'],
  moduleNameMapper: pathsToModuleNameMapper(compilerOptions.paths, {
    prefix: '<rootDir>/',
  }),
  modulePathIgnorePatterns: [
    "<rootDir>/dist/"
  ],
  testPathIgnorePatterns: [
    "<rootDir>/dist/",
    "<rootDir>/node_modules/"
  ],
};
