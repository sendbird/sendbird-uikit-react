/**
 * Node script to append the version number to index.d.ts & package.json
 */
const fs = require('fs');
const path = require('path');
const packageJson = require('../package.json');
const packageTemplate = require('./package.template.json');

const { version } = packageJson;
const getDistPath = (subPath) => path.resolve(__dirname, subPath != null ? `../dist${subPath}` : '../dist');

function appendVersionToTypeDefn() {
  const indexDtsPath = path.resolve(getDistPath(), 'index.d.ts');
  const indexDts = fs.readFileSync(indexDtsPath, 'utf8');
  const indexDtsWithVersion = indexDts.replace(
    'Type Definitions for @sendbird/uikit-react@{{ version }}',
    `Type Definitions for @sendbird/uikit-react@${version}`,
  );

  fs.writeFileSync(indexDtsPath, indexDtsWithVersion);
}

/**
 * Remove all the unnecessary fields from package.json in root of the project
 */
function cleanupPackageJSON(json) {
  /**
   * We remove scripts, module, main, types, and private fields from package.json
   * Becuase folder structure is different in dist
   * And, we don't want to run obligatory scripts in dist
  */
  const cleanedPkgJSON = {
    version: json.version,
    ...packageTemplate,
    peerDependencies: json.peerDependencies,
    dependencies: json.dependencies,
    devDependencies: json.devDependencies,
    browserslist: json.browserslist,
  };
  return cleanedPkgJSON;
}

function movePackageJSON() {
  const packageJSONDistPath = path.resolve(getDistPath(), 'package.json');
  const cleanedUpPackageJSON = cleanupPackageJSON(packageJson);
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
    JSON.stringify({
      main: 'index.js',
      type: 'commonjs',
      typings: '../index.d.ts',
    }, null, 2),
    { flag: 'w' },
  );
}


/** Add version information to index.d.ts in dist */
appendVersionToTypeDefn();
/** Copy content of package.json to dist, but remove unnecessary fields */
movePackageJSON();
/** Copy content of package.json to dist/cjs, to support cjs module separately */
copyCJSPackageJSON();
