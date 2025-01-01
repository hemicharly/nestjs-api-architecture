const tsParser = require('@typescript-eslint/parser');
const typescriptPlugin = require('@typescript-eslint/eslint-plugin');
const prettierPlugin = require('eslint-plugin-prettier');
const importPlugin = require('eslint-plugin-import');
const boundariesPlugin = require('eslint-plugin-boundaries');


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
      'import': importPlugin,
      boundaries: boundariesPlugin
    },
    settings: {
      'import/resolver': {
        typescript: {
          project: './tsconfig.json'
        }
      },
      'boundaries/elements': [
        { type: 'core', pattern: 'src/core/**' },
        { type: 'entrypoints', pattern: 'src/entrypoints/**' },
        { type: 'infrastructure', pattern: 'src/infrastructure/**' },
        { type: 'shared', pattern: 'src/shared/**' }
      ],
    },
    rules: {
      '@typescript-eslint/interface-name-prefix': 'off',
      '@typescript-eslint/explicit-function-return-type': 'off',
      '@typescript-eslint/explicit-module-boundary-types': 'off',
      '@typescript-eslint/no-explicit-any': 'off',
      '@typescript-eslint/no-namespace': 'off',
      'prettier/prettier': [
        'error',
        {
          endOfLine: 'auto'
        }
      ],
      "boundaries/element-types": [2, {
        default: "disallow",
        message: "The '${file.type}' layer is not allowed to import the '${dependency.type}'. Because it violates the principle of responsibility.",
        rules: [
          {
            from: ["entrypoints"],
            allow: ["entrypoints", "infrastructure", "core", "shared"],
            importKind: "value",
          },
          {
            from: ["core"],
            allow: ["core"],
            importKind: "value",
          },
          {
            from: ["infrastructure"],
            allow: ["infrastructure", "core", "shared"],
            importKind: "value",
          },
          {
            from: ["shared"],
            allow: ["shared", "core", "infrastructure"],
            importKind: "value",
          },
        ]
      }]
    }
  },
  {
    ignores: [
      'eslint.config.cjs',
      'dist/**/*'
    ]
  }
];