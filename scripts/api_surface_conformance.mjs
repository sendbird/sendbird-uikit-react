import { mkdirSync, mkdtempSync, readFileSync, rmSync, writeFileSync } from 'fs';
import { tmpdir } from 'os';
import { dirname, join, resolve } from 'path';
import { fileURLToPath } from 'url';

import ts from 'typescript';

import { collectDeclarations, renderSnapshot } from './api_surface.mjs';

const ROOT = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const CASES = JSON.parse(readFileSync(join(ROOT, 'scripts', 'api_surface_conformance.json'), 'utf-8'));

const COMPILER_OPTIONS = {
  strict: true,
  types: [],
  target: ts.ScriptTarget.ES2020,
  module: ts.ModuleKind.ESNext,
  moduleResolution: ts.ModuleResolutionKind.Node10,
};

const describe = (diagnostics) =>
  diagnostics.map((d) => `TS${d.code}: ${ts.flattenDiagnosticMessageText(d.messageText, ' ')}`);

function deepAliasChain(leaf, depth) {
  return `${Array.from({ length: depth }, (_, level) =>
    `${level === 0 ? 'export ' : ''}type Value${level} = ${level === depth - 1 ? leaf : `Value${level + 1}`};`,
  ).join('\n')}\n`;
}

function slowCases(depth) {
  return {
    [`deep-${depth}`]: {
      files: {
        'entry.ts': "export { Value0 as First } from './one';\nexport { Value0 as Second } from './two';\n",
        'one.ts': deepAliasChain('string', depth),
        'two.ts': deepAliasChain('number', depth),
      },
      changed: { 'entry.ts': "export { Value0 as First } from './two';\nexport { Value0 as Second } from './one';\n" },
      consumer: "import type { First } from './dist/entry';\nconst p: First = 'abc';\n",
    },
  };
}

function run(name, spec, root) {
  const dir = join(root, name);
  const src = join(dir, 'src');
  const dist = join(dir, 'dist');
  mkdirSync(src, { recursive: true });

  for (const [file, text] of Object.entries(spec.changed ?? {})) {
    if (!(file in spec.files)) return { name, failure: `changed names ${file}, which the case never compiles` };
    if (spec.files[file] === text) return { name, failure: `changed rewrites ${file} with the text it already had` };
  }

  const write = (base, file, text) => {
    mkdirSync(join(base, file, '..'), { recursive: true });
    writeFileSync(join(base, file), text);
  };
  for (const [file, text] of Object.entries(spec.files)) write(src, file, text);
  for (const [file, text] of Object.entries(spec.support ?? {})) write(dir, file, text);
  writeFileSync(join(dir, 'consumer.ts'), spec.consumer);

  const build = () => {
    const program = ts.createProgram(Object.keys(spec.files).map((file) => join(src, file)), {
      ...COMPILER_OPTIONS,
      declaration: true,
      emitDeclarationOnly: true,
      outDir: dist,
    });
    const diagnostics = ts.getPreEmitDiagnostics(program);
    if (diagnostics.length > 0) return describe(diagnostics);
    if (program.emit().emitSkipped) return ['the compiler skipped the emit'];
    return null;
  };
  const snapshot = () =>
    renderSnapshot(dist, collectDeclarations(dist, ['src/entry.ts']), { Entry: 'src/entry.ts' });
  const consumer = () =>
    describe(ts.getPreEmitDiagnostics(ts.createProgram([join(dir, 'consumer.ts')], { ...COMPILER_OPTIONS, noEmit: true })));

  const buildFailure = build();
  if (buildFailure) return { name, failure: `declarations did not build: ${buildFailure[0]}` };

  let before;
  try {
    before = snapshot();
  } catch (error) {
    return { name, failure: `snapshot threw: ${error.message}` };
  }
  const beforeErrors = consumer();
  if (beforeErrors.length > 0) return { name, failure: `consumer did not compile to begin with: ${beforeErrors[0]}` };

  for (const [file, text] of Object.entries(spec.changed ?? {})) write(src, file, text);
  const rebuildFailure = build();
  if (rebuildFailure) return { name, failure: `declarations did not rebuild: ${rebuildFailure[0]}` };

  let after;
  try {
    after = snapshot();
  } catch (error) {
    return { name, failure: `snapshot threw after the change: ${error.message}` };
  }
  const afterErrors = consumer();

  const consumerBroke = afterErrors.length > 0;
  const snapshotMoved = before !== after;
  if (consumerBroke && !snapshotMoved) {
    return { name, failure: `consumer broke with ${afterErrors[0]} but the snapshot did not move` };
  }
  if (!consumerBroke && snapshotMoved) {
    return { name, failure: 'the snapshot moved while the consumer kept compiling' };
  }
  return { name, outcome: consumerBroke ? 'change reported' : 'no change reported' };
}

function main() {
  const deep = process.argv.includes('--deep');
  const cases = { ...CASES, ...(deep ? slowCases(513) : {}) };
  const root = mkdtempSync(join(tmpdir(), 'api-surface-conformance-'));
  const failures = [];

  try {
    for (const name of Object.keys(cases).sort()) {
      const result = run(name, cases[name], root);
      if (result.failure) failures.push(result);
      console.log(`${result.failure ? 'FAIL' : 'pass'}  ${name}${result.failure ? `\n      ${result.failure}` : ''}`);
    }
  } finally {
    rmSync(root, { recursive: true, force: true });
  }

  console.log(`\n${Object.keys(cases).length} cases, ${failures.length} failing`);
  if (!deep) console.log('Pass --deep to add a 513-link alias chain, which takes about a minute.');
  if (failures.length > 0) process.exit(1);
}

main();
