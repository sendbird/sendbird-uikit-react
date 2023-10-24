/**
 * Node script to append the version number to index.d.ts & package.json
 */
const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');
const packageJson = require('../package.json');
const packageTemplate = require('./package.template.json');
const moduleExports = import('../rollup.module-exports.mjs');

const getDistPath = (subPath) =>
  path.resolve(__dirname, subPath != null ? `../dist${subPath}` : '../dist');

/**
 * Remove all the unnecessary fields from package.json in root of the project
 */
async function createPackageJSON(json) {
  const exportList = (await moduleExports).default;

  const typesVersions = { '*': {} };
  const exports = {
    './package.json': './package.json',
    './dist/index.css': './dist/index.css',
  };

  Object.entries(exportList).forEach(([module, filePath]) => {
    const dtsPath = `./${filePath
      .replace('src', 'types')
      .replace(/\.tsx?$/, '.d.ts')}`;

    typesVersions['*'][module === 'index' ? '.' : module] = [dtsPath];
    exports[module === 'index' ? '.' : `./${module}`] = {
      types: dtsPath,
      require: `./cjs/${module}.js`,
      import: `./${module}.js`,
      default: `./${module}.js`,
    };
  });
  return {
    ...packageTemplate,
    version: json.version,
    peerDependencies: json.peerDependencies,
    dependencies: json.dependencies,
    browserslist: json.browserslist,
    exports,
    typesVersions,
  };
}

async function movePackageJSON() {
  const packageJSONDistPath = path.resolve(getDistPath(), 'package.json');
  const cleanedUpPackageJSON = await createPackageJSON(packageJson);
  fs.writeFileSync(
    packageJSONDistPath,
    JSON.stringify(cleanedUpPackageJSON, null, 2),
    { flag: 'w' }
  );
}

function copyCJSPackageJSON() {
  const packageJSONDistPath = path.resolve(getDistPath('/cjs'), 'package.json');
  fs.writeFileSync(
    packageJSONDistPath,
    JSON.stringify({ type: 'commonjs' }, null, 2),
    { flag: 'w' }
  );
}

function moveCSS() {
  const cjs = 'dist/cjs';
  const dist = 'dist/dist';
  execSync(`rm ${cjs}/index.css ${cjs}/index.css.map`, { stdio: 'inherit' });
  execSync(`mkdir -p ${dist}`, { stdio: 'inherit' });
  execSync(`mv dist/index.css dist/index.css.map ${dist}`, { stdio: 'inherit' });
}

function buildTypeDefinitions() {
  execSync('tsc --project tsconfig.json --emitDeclarationOnly --declarationDir dist/types --declaration', { stdio: 'inherit' });
}

/** Copy content of package.json to dist, but remove unnecessary fields */
movePackageJSON();
/** Copy content of package.json to dist/cjs, to support cjs module separately */
copyCJSPackageJSON();

moveCSS();
buildTypeDefinitions();
