const fs = require('fs');
const path = require('path');

const targetDir = path.resolve(__dirname, 'src'); 
const fromImport = '@utils';
const toImport = '~/Utility';

function walkAndReplace(dir) {
  const files = fs.readdirSync(dir);

  for (const file of files) {
    const fullPath = path.join(dir, file);
    const stat = fs.statSync(fullPath);

    if (stat.isDirectory()) {
      walkAndReplace(fullPath);
    } else if (stat.isFile() && /\.(ts|tsx|js|jsx)$/.test(file)) {
      let content = fs.readFileSync(fullPath, 'utf8');

      if (content.includes(fromImport)) {
        const updated = content.replace(
          new RegExp(`(['"\`])${fromImport}\\1`, 'g'),
          `'${toImport}'`
        );

        fs.writeFileSync(fullPath, updated, 'utf8');
        console.log(`✅ Updated: ${fullPath}`);
      }
    }
  }
}

walkAndReplace(targetDir);
console.log('🎉 Done replacing @utils with ~/Utility');
