/**
 * Builds the `exports` and `typesVersions` maps that ship in the published package.
 */

function declarationPath(sourcePath) {
  if (!/\.tsx?$/.test(sourcePath)) return null;
  return `./${sourcePath.replace('src', 'types').replace(/\.tsx?$/, '.d.ts')}`;
}

function buildExports(exportList) {
  const typesVersions = { '*': {} };
  const exports = {
    './package.json': './package.json',
    './dist/index.css': './dist/index.css',
  };

  Object.entries(exportList).forEach(([module, sourcePath]) => {
    const subpath = module === 'index' ? '.' : `./${module}`;
    const dtsPath = declarationPath(sourcePath);

    if (dtsPath) {
      typesVersions['*'][module === 'index' ? '.' : module] = [dtsPath];
    }

    exports[subpath] = {
      ...(dtsPath ? { types: dtsPath } : {}),
      require: `./cjs/${module}.js`,
      import: `./${module}.js`,
      default: `./${module}.js`,
    };
  });

  return { exports, typesVersions };
}

module.exports = { buildExports, declarationPath };
