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
  collectCoverageFrom: [
    'src/core/**/*.ts',
    'src/entrypoints/**/*.ts',
    'src/infrastructure/**/*.ts',
    'src/shared/**/*.ts',

    //Ignore patterns
    '!src/**/*index.ts',
    '!src/**/*express.d.ts',
    '!src/**/*.config.ts',
    '!src/**/*.module.ts',
    '!src/**/*.interface.ts',
    '!src/**/*.pipe.ts',
    '!src/**/*.guard.ts',
    '!src/**/*.filter.ts',
    '!src/**/*.doc.ts',
    '!src/**/*tracer.context.audit.ts',
    '!src/**/*.type.ts',
    '!src/**/*.enum.ts',
    '!src/**/*.exception.ts',
    '!src/**/*.decorator.ts',
    '!src/**/*.dto.ts',
    '!src/**/*.request.ts',
    '!src/**/*.response.ts',
    '!src/**/*.seed.ts',
  ],
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
    '<rootDir>/dist/',
  ],
  testPathIgnorePatterns: [
    '<rootDir>/dist/',
    '<rootDir>/node_modules/',
  ],
};
