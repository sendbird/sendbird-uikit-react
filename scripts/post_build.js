/**
 * Node script to append the version number to index.d.ts & package.json
 */
const fs = require('fs');
const path = require('path');
const readline = require('readline');
const packageJson = require('../package.json');
const packageTemplate = require('./package.template.json');

const { version } = packageJson;
const distPath = path.resolve(__dirname, '../dist');

function appendVersionToTypeDefn() {
  const indexDtsPath = path.resolve(distPath, 'index.d.ts');
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
  const packageJSONDistPath = path.resolve(distPath, 'package.json');
  const cleanedUpPackageJSON = cleanupPackageJSON(packageJson);
  fs.writeFileSync(
    packageJSONDistPath,
    JSON.stringify(cleanedUpPackageJSON, null, 2),
    { flag: 'w' },
  );
}

// see exports.js // legacy
// Font import should be on top of index.css
// eslint-disable-next-line camelcase
async function test_should_import_url_be_on_top_of_bundled_css() {
  const expected = '@import url("https://fonts.googleapis.com/css?family=Open+Sans:400,600,700&display=swap");';
  const cssPath = path.resolve(distPath, 'dist/index.css');
  const cssFileStream = fs.createReadStream(cssPath);
  // reads the first line of the file instead of the whole file
  const reader = readline.createInterface({ input: cssFileStream });
  const line = await new Promise((resolve) => {
    reader.on('line', (l) => {
      reader.close();
      resolve(l);
    });
  });
  cssFileStream.close();
  if (line !== expected) {
    const err = `CSS integrity check failed.
      Expected: ${expected} to be on top of ${cssPath} file,
      Actual: ${line}
    `;
    throw new Error(err);
  }
}

/** Add version information to index.d.ts in dist */
appendVersionToTypeDefn();
/** Copy content of package.json to dist, but remove unnecessary fields */
movePackageJSON();

test_should_import_url_be_on_top_of_bundled_css();
