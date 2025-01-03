const { execSync } = require('child_process');
const { writeFile, lstatSync } = require('fs');
const path = require('path');

const getStagedFiles = () => {
  try {
    const output = execSync('git diff --cached --name-only --diff-filter=A').toString();
    return output.split('\n').filter((file) => file.endsWith('.ts'));
  } catch (err) {
    console.error('Error getting staged files:', err.message);
    return [];
  }
};

const generateIndexFilesForNewFiles = (stagedFiles) => {
  const filesByDir = stagedFiles.reduce((acc, file) => {
    const fullPath = path.resolve(file);
    const dir = path.dirname(fullPath);

    if (!lstatSync(fullPath).isDirectory()) {
      if (!acc[dir]) {
        acc[dir] = [];
      }
      acc[dir].push(fullPath);
    }

    return acc;
  }, {});

  Object.entries(filesByDir).forEach(([dir, files]) => {
    const exportStatements = files
      .filter((file) => !file.endsWith('/index.ts'))
      .map((file) => {
        const fileNameWithoutExtension = path.basename(file, '.ts');
        return `export * from './${fileNameWithoutExtension}';`;
      })
      .join('\n');

    const indexPath = path.join(dir, 'index.ts');

    writeFile(indexPath, exportStatements.trim() + '\n', (err) => {
      if (err) {
        console.log(`Unable to write index.ts file in ${dir}: ${err}`);
      } else {
        console.log(`index.ts file has been updated successfully in ${dir}.`);
      }
    });
  });
};

// Main execution
const stagedFiles = getStagedFiles();
if (stagedFiles.length > 0) {
  console.log('Generating index files for newly added files...');
  generateIndexFilesForNewFiles(stagedFiles);
} else {
  console.log('No new TypeScript files to process.');
}