const fs = require('fs');
const path = require('path');

// Folder where the source code lives
const SRC_DIR = path.join(__dirname, 'src');

// Match '~/Utility/anything' and replace with '@utils'
const importRegex = /(['"])~\/Utility\/[^'"]*\1/g;

// Recursively find .ts and .tsx files
function getAllTsFiles(dirPath, arrayOfFiles = []) {
  const files = fs.readdirSync(dirPath);

  files.forEach(file => {
    const fullPath = path.join(dirPath, file);
    const stat = fs.statSync(fullPath);

    if (stat.isDirectory()) {
      getAllTsFiles(fullPath, arrayOfFiles);
    } else if (file.endsWith('.ts') || file.endsWith('.tsx')) {
      arrayOfFiles.push(fullPath);
    }
  });

  return arrayOfFiles;
}

// Read, replace, and save each file
function replaceImports(filePath) {
  let content = fs.readFileSync(filePath, 'utf8');

  const updated = content.replace(importRegex, (_, quote) => `${quote}@utils${quote}`);

  if (content !== updated) {
    fs.writeFileSync(filePath, updated, 'utf8');
    console.log(`✅ Updated: ${filePath}`);
  }
}

// Run it
function run() {
  console.log('🔍 Scanning for imports to refactor...');
  const files = getAllTsFiles(SRC_DIR);
  files.forEach(replaceImports);
  console.log('🎉 Done!');
}

run();
