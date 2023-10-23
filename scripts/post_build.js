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
async function cleanupPackageJSON(json) {
  const exportList = (await moduleExports).default;
  const typesVersions = {};
  const exports = Object.entries(exportList).reduce(
    (acc, [module, filePath]) => {
      const types = `./${filePath
        .replace('src', 'types')
        .replace(/\.tsx?$/, '.d.ts')}`;
      typesVersions[module === 'index' ? '.' : `${module}`] = [types];
      return {
        ...acc,
        [module === 'index' ? '.' : `./${module}`]: {
          types,
          require: `./cjs/${module}`,
          import: `./${module}`,
          default: `./${module}`,
        },
      };
    },
    {}
  );
  return {
    ...packageTemplate,
    exports,
    typesVersions: { '*': typesVersions },
    version: json.version,
    peerDependencies: json.peerDependencies,
    dependencies: json.dependencies,
    browserslist: json.browserslist,
  };
}

async function movePackageJSON() {
  const packageJSONDistPath = path.resolve(getDistPath(), 'package.json');
  const cleanedUpPackageJSON = await cleanupPackageJSON(packageJson);
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
    JSON.stringify(
      { type: 'commonjs' },
      null,
      2,
    ),
    { flag: 'w' },
  );
}

/** Copy content of package.json to dist, but remove unnecessary fields */
movePackageJSON();
/** Copy content of package.json to dist/cjs, to support cjs module separately */
copyCJSPackageJSON();
execSync('rm dist/cjs/index.css', { stdio: 'inherit' });
execSync('mkdir -p dist/dist', { stdio: 'inherit' });
execSync('mv dist/index.css dist/dist/index.css', { stdio: 'inherit' });
execSync('tsc --project tsconfig.json --emitDeclarationOnly --declarationDir dist/types --declaration');
