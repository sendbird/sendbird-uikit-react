/**
 * Node script to append the version number to index.d.ts & package.json
 */
const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');
const packageJson = require('../package.json');
const packageTemplate = require('./package.template.json');

const moduleExports = import('../rollup.module-exports.mjs');

const getDistPath = (subPath) => path.resolve(__dirname, subPath != null ? `../dist${subPath}` : '../dist');

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
    { flag: 'w' },
  );
}

function copyCJSPackageJSON() {
  const packageJSONDistPath = path.resolve(getDistPath('/cjs'), 'package.json');
  fs.writeFileSync(
    packageJSONDistPath,
    JSON.stringify({ type: 'commonjs' }, null, 2),
    { flag: 'w' },
  );
}

function removeUnusedCSS() {
  execSync('rm -rf dist/cjs/dist', { stdio: 'inherit' });
}

function buildTypeDefinitions() {
  execSync('tsc --project tsconfig.json --emitDeclarationOnly --declarationDir dist/types --declaration', { stdio: 'inherit' });
}

// TODO [APP-7035] We should be able to do this in Rollup or Postcss.
function removeGoogleFontImports() {
  const data = fs.readFileSync('dist/dist/index.css', 'utf-8');
  const newValue = data.replaceAll("@import url('https://fonts.googleapis.com/css?family=Roboto:400,500,600,700&display=swap');", '');
  fs.writeFileSync('dist/dist/index.css', newValue, 'utf-8');
}

/** Copy content of package.json to dist, but remove unnecessary fields */
movePackageJSON();
/** Copy content of package.json to dist/cjs, to support cjs module separately */
copyCJSPackageJSON();

removeUnusedCSS();
buildTypeDefinitions();

removeGoogleFontImports();
