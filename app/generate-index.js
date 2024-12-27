const { writeFile, readdirSync, lstatSync } = require('fs');
const path = require('path');

const directoryPath = path.join(__dirname, './src');

const getAllFiles = (dirPath, arrayOfFiles) => {
  arrayOfFiles = arrayOfFiles || [];
  const files = readdirSync(dirPath);

  files.forEach((file) => {
    const fullPath = path.join(dirPath, file);
    if (lstatSync(fullPath).isDirectory()) {
      arrayOfFiles = getAllFiles(fullPath, arrayOfFiles);
    } else if (file.endsWith('.ts')) {
      arrayOfFiles.push(fullPath);
    }
  });

  return arrayOfFiles;
};

const generateIndexFiles = (baseDir) => {
  const allFiles = getAllFiles(baseDir);

  const filesByDir = allFiles.reduce((acc, file) => {
    const dir = path.dirname(file);
    if (!acc[dir]) {
      acc[dir] = [];
    }
    acc[dir].push(file);
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

generateIndexFiles(directoryPath);
