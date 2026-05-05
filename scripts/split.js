const fs = require('fs');
const path = require('path');

const packagesDir = path.join(__dirname, '../packages');
const packages = fs.readdirSync(packagesDir).filter(pkg => fs.statSync(path.join(packagesDir, pkg)).isDirectory());

for (const pkg of packages) {
  const indexFile = path.join(packagesDir, pkg, 'src/index.ts');
  if (!fs.existsSync(indexFile)) continue;

  const content = fs.readFileSync(indexFile, 'utf-8');
  
  // Find the exact delimiter
  // It's usually like "// ─── useSomething ────"
  const pieces = content.split(/\n\/\/ ─── (?=use)/);
  if (pieces.length <= 1) {
    console.log(`Skipping ${pkg} - no valid delimiters found.`);
    continue;
  }

  const header = pieces[0].trim() + '\n\n';
  const hooksDir = path.join(packagesDir, pkg, 'src/hooks');
  if (!fs.existsSync(hooksDir)) fs.mkdirSync(hooksDir, { recursive: true });

  const exportsList = [];

  for (let i = 1; i < pieces.length; i++) {
    const chunk = pieces[i];
    const match = chunk.match(/^(use[A-Za-z0-9]+)/);
    if (!match) {
      console.log(`Could not find hook name in chunk: ${chunk.slice(0, 50)}`);
      continue;
    }
    const hookName = match[1];

    let fileContent = header + '// ─── ' + chunk.trim() + '\n';
    
    // There's a trailing module declaration in some files (e.g. `import type React from 'react';`)
    // Remove it from individual hooks so it doesn't cause issues, or let it be.
    const cleanContent = fileContent.replace(/\nimport type React from 'react';/, '');

    fs.writeFileSync(path.join(hooksDir, `${hookName}.ts`), cleanContent.trim() + '\n');
    exportsList.push(`export * from './hooks/${hookName}';`);
  }

  // Rewrite index.ts
  fs.writeFileSync(indexFile, exportsList.join('\n') + '\n');
  console.log(`✅ Splitted ${pkg} into ${exportsList.length} files.`);
}
