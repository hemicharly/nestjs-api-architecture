const tsParser = require('@typescript-eslint/parser');
const typescriptPlugin = require('@typescript-eslint/eslint-plugin');
const unusedImports = require('eslint-plugin-unused-imports');
const prettierPlugin = require('eslint-plugin-prettier');
const importPlugin = require('eslint-plugin-import');
const boundariesPlugin = require('eslint-plugin-boundaries');


const LAYER_TYPES = {
  CORE: 'core',
  ENTRYPOINTS: 'entrypoints',
  INFRASTRUCTURE: 'infrastructure',
  SHARED: 'shared',
};

const LAYER_RULES = [
  {
    from: [LAYER_TYPES.ENTRYPOINTS],
    allow: [LAYER_TYPES.ENTRYPOINTS, LAYER_TYPES.CORE, LAYER_TYPES.SHARED],
    importKind: 'value',
  },
  {
    from: [LAYER_TYPES.CORE],
    allow: [LAYER_TYPES.CORE],
    importKind: 'value',
  },
  {
    from: [LAYER_TYPES.INFRASTRUCTURE],
    allow: [
      LAYER_TYPES.INFRASTRUCTURE,
      LAYER_TYPES.CORE,
      LAYER_TYPES.SHARED,
    ],
    importKind: 'value',
  },
  {
    from: [LAYER_TYPES.SHARED],
    allow: [LAYER_TYPES.SHARED, LAYER_TYPES.CORE, LAYER_TYPES.INFRASTRUCTURE],
    importKind: 'value',
  },
];

module.exports = [
  {
    files: ['**/*.ts'],
    languageOptions: {
      parser: tsParser,
      parserOptions: {
        project: './tsconfig.json',
        tsconfigRootDir: process.cwd(),
        sourceType: 'module'
      },
      globals: {
        NodeJS: true,
        jest: true
      }
    },
    plugins: {
      '@typescript-eslint': typescriptPlugin,
      prettier: prettierPlugin,
      'unused-imports': unusedImports,
      import: importPlugin,
      boundaries: boundariesPlugin
    },
    settings: {
      'import/resolver': {
        typescript: {
          project: './tsconfig.json'
        }
      },
      'boundaries/elements': [
        { type: LAYER_TYPES.CORE, pattern: 'src/core/**' },
        { type: LAYER_TYPES.ENTRYPOINTS, pattern: 'src/entrypoints/**' },
        { type: LAYER_TYPES.INFRASTRUCTURE, pattern: 'src/infrastructure/**' },
        { type: LAYER_TYPES.SHARED, pattern: 'src/shared/**' },
      ],
    },
    rules: {
      'complexity': ['error', { max: 10 }],
      'unused-imports/no-unused-imports': 'error',
      '@typescript-eslint/explicit-function-return-type': 'error',
      '@typescript-eslint/explicit-module-boundary-types': 'off',
      '@typescript-eslint/no-explicit-any': 'off',
      '@typescript-eslint/no-namespace': 'off',
      'no-duplicate-case': 'error',
      'no-duplicate-imports': 'error',
      'prettier/prettier': [
        'error',
        {
          printWidth: 100,
          arrowParens: 'always',
          singleQuote: true,
          semi: true,
          tabWidth: 2,
          trailingComma: 'none',
          endOfLine: 'lf',
          bracketSpacing: true,
          proseWrap: 'preserve'
        }
      ],
      'boundaries/element-types': [2, {
        default: 'disallow',
        message:
          "Imports from '${file.type}' to '${dependency.type}' are not allowed. Please review the architecture rules.",
        rules: LAYER_RULES,
      }]
    }
  },
  {
    ignores: [
      'eslint.config.cjs',
      'dist/**/*',
      'node_modules/**/*'
    ]
  }
];