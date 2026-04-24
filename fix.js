const { Project } = require("ts-morph");

async function fixUnused() {
  const project = new Project();
  project.addSourceFilesAtPaths([
    "packages/*/src/**/*.ts",
    "packages/*/src/**/*.tsx"
  ]);

  const sourceFiles = project.getSourceFiles();
  let count = 0;
  for (const sf of sourceFiles) {
    try {
      sf.fixUnusedIdentifiers();
      // We can also let the language service fix missing return types natively if there was a codefix? No, fixUnusedIdentifiers is enough for unused vars
      count++;
    } catch (e) {
      console.error(`Failed on ${sf.getFilePath()}`, e);
    }
  }

  await project.save();
  console.log(`Fixed unused identifiers in ${count} files.`);
}

fixUnused().catch(console.error);
