const path = require('path');
const { existsSync, mkdirSync, writeFileSync, readdirSync, rmdirSync } = require('node:fs');

/**
 * Source folder path (where the source code files are).
 * Replace './src' with the path to your source code folder.
 */
const SOURCE_DIR = './src';

/**
 * Path to the tests folder (where the test files will be created).
 * Replace './tests' with the desired path to the tests.
 */
const TEST_DIR = './test';

/**
 * Extension of the files that will be analyzed.
 */
const FILE_EXTENSION = '.ts';

/**
 * Paths to ignore
 */
const IGNORE_PATHS = [
  'src/shared/audit',
  'src/core/providers',
  'src/core/domain/exceptions',
  'src/core/domain/enums',
  'src/infrastructure/repositories/*/entity',
  'src/infrastructure/repositories/*/seeds',
  'src/entrypoints/consumers',
  'src/entrypoints/web/rest/*/request',
  'src/entrypoints/web/rest/*/response'
];

/**
 * Converts wildcard paths from the IGNORE_PATHS list to regular expressions.
 */
const IGNORE_PATHS_PATTERNS = IGNORE_PATHS.map(pattern => {
  const regexPattern = pattern.replace(/\*/g, '.*');
  return new RegExp(`^${regexPattern}$`, 'i');
});

/**
 * Files or patterns to ignore
 */
const IGNORE_FILES = ['express.d.ts', 'main.ts', 'app.module.ts', 'index.ts', 'module', 'seed', 'decorator', 'decorators', 'exception', 'config', 'request', 'response', 'dto'];

/**
 * Converts the IGNORE_FILES list into a regular expression array.
 */
const IGNORE_FILES_PATTERNS = IGNORE_FILES.map(pattern => new RegExp(pattern, 'i'));


/**
 * Base template for the generated test files.
 */
const TEST_TEMPLATE = (filename) => `
/**
 * Implementation of test to '${filename}'
 */
describe('${filename}', () => {
  it('should have tests', () => {
    // TODO: Implement test cases
    expect(true).toBe(true);
  });
});
`;

/**
 * Function to create the required directory structure.
 */
function ensureDirSync(dirPath) {
  if (!existsSync(dirPath)) {
    mkdirSync(dirPath, { recursive: true });
  }
}

/**
 * Recursive function to traverse source folders and create test files.
 */
function processDirectory(sourceDir, testDir) {
  const entries = readdirSync(sourceDir, { withFileTypes: true });
  entries.forEach((entry) => {
    const sourcePath = path.join(sourceDir, entry.name);
    const testPath = path.join(testDir, entry.name);

    const shouldIgnorePath = IGNORE_PATHS_PATTERNS.some((pattern) => pattern.test(sourcePath));
    if (shouldIgnorePath) {
      console.warn(`Ignoring directory: ${sourcePath}`);
      return;
    }

    const shouldIgnore = IGNORE_FILES_PATTERNS.some((pattern) => pattern.test(entry.name));
    if (shouldIgnore) {
      console.warn(`Skipping file: ${entry.name}`);
      return;
    }

    if (entry.isDirectory()) {
      ensureDirSync(testPath);
      processDirectory(sourcePath, testPath);
    } else if (entry.isFile() && path.extname(entry.name) === FILE_EXTENSION) {
      const testFileName = entry.name.replace(FILE_EXTENSION, `.spec${FILE_EXTENSION}`);
      const testFilePath = path.join(testDir, testFileName);
      if (!existsSync(testFilePath)) {
        writeFileSync(testFilePath, TEST_TEMPLATE(entry.name));
        console.log(`Test file created: ${testFilePath}`);
      }
    }
  });
}

/**
 * Function to scroll through the created folders and remove those that are empty
 */
function removeEmptyDirectories(dirPath) {
  const entries = readdirSync(dirPath, { withFileTypes: true });

  if (entries.length === 0) {
    rmdirSync(dirPath);
    console.log(`Empty directory removed:: ${dirPath}`);
  } else {
    entries.forEach((entry) => {
      const subPath = path.join(dirPath, entry.name);
      if (entry.isDirectory()) {
        removeEmptyDirectories(subPath);
      }
    });

    const remainingEntries = readdirSync(dirPath);
    if (remainingEntries.length === 0) {
      rmdirSync(dirPath);
      console.log(`Empty directory removed: ${dirPath}`);
    }
  }
}

/**
 * Main script execution.
 */
function main() {
  ensureDirSync(TEST_DIR);
  processDirectory(SOURCE_DIR, TEST_DIR);
  removeEmptyDirectories(TEST_DIR);
  console.log('Test files generated successfully!');
}

main();
