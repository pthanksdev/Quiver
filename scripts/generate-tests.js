const fs = require('fs');
const path = require('path');

const packagesDir = path.join(__dirname, '../packages');
const packages = fs.readdirSync(packagesDir).filter(pkg => fs.statSync(path.join(packagesDir, pkg)).isDirectory());

let testsGenerated = 0;

for (const pkg of packages) {
  const hooksDir = path.join(packagesDir, pkg, 'src/hooks');
  if (!fs.existsSync(hooksDir)) continue;

  const hookFiles = fs.readdirSync(hooksDir).filter(f => f.endsWith('.ts') && !f.endsWith('.test.ts'));

  for (const file of hookFiles) {
    const hookName = file.slice(0, -3);
    const testFile = path.join(hooksDir, `${hookName}.test.ts`);
    
    if (!fs.existsSync(testFile)) {
      const isClient = hookName === 'useWebCrypto' || hookName === 'useWebAuthn' || pkg === 'hardware';
      
      const content = `import { renderHook } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import { ${hookName} } from './${hookName}';

describe('${hookName}', () => {
  it('should be defined', () => {
    expect(${hookName}).toBeDefined();
  });

  // TODO: Add robust unit tests for ${hookName}
});
`;
      fs.writeFileSync(testFile, content);
      testsGenerated++;
    }
  }
}

console.log(`✅ Generated ${testsGenerated} test boilerplates!`);
