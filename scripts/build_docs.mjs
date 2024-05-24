import { execSync } from 'child_process';
import { promises as fs } from 'fs';
import moduleExports from '../rollup.module-exports.mjs';

function removeDuplicates(items) {
  return [...new Set(items)];
}
const order = [
  'src/modules/App',
  'src/modules/GroupChannel',
  'src/modules/GroupChannelList',
  'src/modules',
  'src/ui',
  'src/hooks',
  'src/utils',
];
async function updateEntryPoints() {
  const modulePaths = removeDuplicates(Object.values(moduleExports)).sort((a, b) => {
    const aOrder = order.findIndex((o) => a.startsWith(o)) ?? -1;
    const bOrder = order.findIndex((o) => b.startsWith(o)) ?? -1;
    if (aOrder === -1) return 1;
    if (bOrder === -1) return -1;
    if (aOrder !== bOrder) return aOrder - bOrder;
    return a.localeCompare(b);
  });
  const typedoc = JSON.parse(await fs.readFile('typedoc.json', 'utf-8'));
  typedoc.entryPoints = modulePaths;
  await fs.writeFile('typedoc.json', JSON.stringify(typedoc, null, 2));
}

function execTypedoc() {
  execSync('npx typedoc', (error, stdout, stderr) => {
    if (error) {
      console.error(`exec error: ${error}`);
      return;
    }
    console.log(`stdout: ${stdout}`);
    console.error(`stderr: ${stderr}`);
  });
}

async function run() {
  await updateEntryPoints();
  execTypedoc();
}

run();
