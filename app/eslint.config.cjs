/**
 * ESLint Configuration File
 *
 * This file is responsible for setting up linting rules and configurations for the project.
 * It integrates TypeScript, Prettier, and specific plugins to enforce code quality, consistency, and architecture standards.
 * Each section below contains a detailed explanation of its purpose and configuration.
 */

// Import necessary plugins and parsers
const tsParser = require('@typescript-eslint/parser'); // Parses TypeScript code for linting
const typescriptPlugin = require('@typescript-eslint/eslint-plugin'); // Provides linting rules specific to TypeScript
const unusedImports = require('eslint-plugin-unused-imports'); // Removes unused imports to maintain clean code
const prettierPlugin = require('eslint-plugin-prettier'); // Integrates Prettier with ESLint
const importPlugin = require('eslint-plugin-import'); // Enforces best practices for import/export
const boundariesPlugin = require('eslint-plugin-boundaries'); // Ensures adherence to architectural layer boundaries

// Define architectural layer types for the project
const LAYER_TYPES = {
  CORE: 'core', // Core logic and business rules
  ENTRYPOINTS: 'entrypoints', // Entry points like controllers or API handlers
  INFRASTRUCTURE: 'infrastructure', // Infrastructure-specific code like database access
  SHARED: 'shared' // Reusable/shared components and utilities
};

/**
 * BOUNDARIES_ELEMENT_TYPES_LAYER_RULES
 *
 * Defines rules for dependencies between architectural layers.
 * This ensures that the code adheres to the defined architecture by restricting imports between layers.
 */
const BOUNDARIES_ELEMENT_TYPES_LAYER_RULES = [
  {
    from: [LAYER_TYPES.ENTRYPOINTS],
    allow: [LAYER_TYPES.ENTRYPOINTS, LAYER_TYPES.CORE, LAYER_TYPES.SHARED]
  },
  {
    from: [LAYER_TYPES.CORE],
    allow: [LAYER_TYPES.CORE]
  },
  {
    from: [LAYER_TYPES.INFRASTRUCTURE],
    allow: [LAYER_TYPES.INFRASTRUCTURE, LAYER_TYPES.CORE, LAYER_TYPES.SHARED]
  },
  {
    from: [LAYER_TYPES.SHARED],
    allow: [LAYER_TYPES.SHARED, LAYER_TYPES.CORE, LAYER_TYPES.INFRASTRUCTURE]
  }
];

/**
 * BOUNDARIES_EXTERNAL_LAYER_RULES
 *
 * Defines restrictions for importing external modules.
 * For example, the CORE layer is restricted from importing any external modules to preserve its purity.
 */
const BOUNDARIES_EXTERNAL_LAYER_RULES = [
  {
    from: [LAYER_TYPES.CORE],
    disallow: ['**']
  }
];

module.exports = [
  {
    // Apply configuration for TypeScript files
    files: ['**/*.ts'],
    languageOptions: {
      parser: tsParser, // Specifies the parser for TypeScript files
      parserOptions: {
        project: './tsconfig.json', // Points to the TypeScript configuration file
        tsconfigRootDir: process.cwd(), // Sets the root directory for the TypeScript project
        sourceType: 'module' // Enables ES6 module support
      },
      globals: {
        NodeJS: true, // Defines Node.js globals
        jest: true // Defines Jest globals for testing
      }
    },
    plugins: {
      '@typescript-eslint': typescriptPlugin, // TypeScript-specific linting rules
      prettier: prettierPlugin, // Enforces Prettier code formatting rules
      'unused-imports': unusedImports, // Automatically removes unused imports
      import: importPlugin, // Enforces import/export best practices
      boundaries: boundariesPlugin // Ensures adherence to architectural boundaries
    },
    settings: {
      // Configures module resolution for imports
      'import/resolver': {
        typescript: {
          project: './tsconfig.json'
        }
      },
      // Ignores specific files or patterns for architectural boundaries
      'boundaries/ignore': ['test/**/*.spec.ts'],
      'boundaries/elements': [
        { type: LAYER_TYPES.CORE, pattern: 'src/core/**' },
        { type: LAYER_TYPES.ENTRYPOINTS, pattern: 'src/entrypoints/**' },
        { type: LAYER_TYPES.INFRASTRUCTURE, pattern: 'src/infrastructure/**' },
        { type: LAYER_TYPES.SHARED, pattern: 'src/shared/**' }
      ]
    },
    rules: {
      // General code complexity rule
      complexity: ['error', { max: 10 }], // Limits the cyclomatic complexity of functions to 10
      // Removes unused imports
      'unused-imports/no-unused-imports': 'error',
      // Enforces explicit return types for functions
      '@typescript-eslint/explicit-function-return-type': 'error',
      // Prevent explicit module boundary types
      '@typescript-eslint/explicit-module-boundary-types': 'error',
      // Allows usage of the 'any' type in TypeScript
      '@typescript-eslint/no-explicit-any': 'off',
      // Prevents duplicate cases in switch statements
      'no-duplicate-case': 'error',
      // Prevents duplicate imports in files
      'no-duplicate-imports': 'error',
      // Enforces Prettier formatting
      'prettier/prettier': [
        'error',
        {
          printWidth: 100, // Maximum line length
          arrowParens: 'always', // Always include parentheses for arrow function parameters
          singleQuote: true, // Use single quotes
          semi: true, // Use semicolons
          tabWidth: 2, // Use 2 spaces per indentation
          trailingComma: 'none', // No trailing commas
          endOfLine: 'lf', // Line feed for end-of-line
          bracketSpacing: true, // Include spaces between brackets
          proseWrap: 'preserve' // Preserve text wrapping
        }
      ],
      // Ensures adherence to architectural layer rules
      'boundaries/element-types': [
        2,
        {
          default: 'disallow',
          message:
            "Architecture Violated: The '${file.type}' layer cannot import '${dependency.type}' layer with dependency.",
          rules: BOUNDARIES_ELEMENT_TYPES_LAYER_RULES
        }
      ],
      // Enforces restrictions on external module usage
      'boundaries/external': [
        2,
        {
          default: 'allow',
          rules: BOUNDARIES_EXTERNAL_LAYER_RULES
        }
      ]
    }
  },
  {
    // Ignores specific files and directories
    ignores: ['eslint.config.cjs', 'dist/**/*', 'node_modules/**/*']
  }
];
