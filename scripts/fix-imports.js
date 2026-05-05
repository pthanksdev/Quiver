const fs = require('fs');
const path = require('path');

const packagesDir = path.join(__dirname, '../packages');
const packages = fs.readdirSync(packagesDir).filter(pkg => fs.statSync(path.join(packagesDir, pkg)).isDirectory());

for (const pkg of packages) {
  const hooksDir = path.join(packagesDir, pkg, 'src/hooks');
  if (!fs.existsSync(hooksDir)) continue;

  const hookFiles = fs.readdirSync(hooksDir).filter(f => f.endsWith('.ts'));
  const exportedNames = hookFiles.map(f => f.slice(0, -3)); // ['useTable', 'useSorting', ...]

  for (const file of hookFiles) {
    const filePath = path.join(hooksDir, file);
    const content = fs.readFileSync(filePath, 'utf-8');
    const requiredImports = [];

    for (const name of exportedNames) {
      if (name === file.slice(0, -3)) continue; // skip self
      
      // If the word appears in the file
      const regex = new RegExp(`\\b${name}\\b`);
      if (regex.test(content)) {
        requiredImports.push(`import { ${name} } from './${name}';`);
      }
    }

    if (requiredImports.length > 0) {
      // Find the last import line in the file
      const lines = content.split('\n');
      let lastImportIndex = -1;
      for (let i = 0; i < lines.length; i++) {
        if (lines[i].startsWith('import ')) {
          lastImportIndex = i;
        }
      }

      const importsStr = requiredImports.join('\n');
      if (lastImportIndex !== -1) {
        lines.splice(lastImportIndex + 1, 0, importsStr);
      } else {
        lines.unshift(importsStr);
      }
      fs.writeFileSync(filePath, lines.join('\n'));
      console.log(`🔧 ${pkg}/${file}: added ${requiredImports.length} cross-imports.`);
    }
  }
}
