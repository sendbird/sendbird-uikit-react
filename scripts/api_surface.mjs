import { existsSync, mkdirSync, readFileSync, statSync, writeFileSync } from 'fs';
import { dirname, join, relative, resolve } from 'path';
import { fileURLToPath } from 'url';

import moduleExports from '../rollup.module-exports.mjs';

const ROOT = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const TYPES = join(ROOT, 'dist', 'types');
const OUT = join(ROOT, 'api', 'surface.d.ts');

const SPECIFIER = /(?:from\s*['"]([^'"]+)['"])|(?:import\(\s*['"]([^'"]+)['"]\s*\))/g;

function entryDeclaration(sourcePath) {
  return join(TYPES, sourcePath.replace(/^src\//, '').replace(/\.tsx?$/, '.d.ts'));
}

function resolveSpecifier(fromFile, specifier) {
  if (!specifier.startsWith('.')) return null;
  const base = resolve(dirname(fromFile), specifier);
  for (const candidate of [`${base}.d.ts`, join(base, 'index.d.ts')]) {
    if (existsSync(candidate) && statSync(candidate).isFile()) return candidate;
  }
  return null;
}

function reachableDeclarations() {
  const seen = new Set();
  const pending = [];

  for (const sourcePath of Object.values(moduleExports)) {
    const declaration = entryDeclaration(sourcePath);
    if (existsSync(declaration)) pending.push(declaration);
  }

  while (pending.length > 0) {
    const file = pending.pop();
    if (seen.has(file)) continue;
    seen.add(file);

    const text = readFileSync(file, 'utf-8');
    for (const match of text.matchAll(SPECIFIER)) {
      const next = resolveSpecifier(file, match[1] ?? match[2]);
      if (next && !seen.has(next)) pending.push(next);
    }
  }

  return [...seen].sort();
}

if (!existsSync(TYPES)) {
  console.error(`${relative(ROOT, TYPES)} not found. Run \`yarn build\` first.`);
  process.exit(1);
}

const declarations = reachableDeclarations();
const snapshot = declarations
  .map((file) => `// ===== ${relative(TYPES, file)} =====\n${readFileSync(file, 'utf-8')}`)
  .join('');

mkdirSync(dirname(OUT), { recursive: true });
writeFileSync(OUT, snapshot);

console.log(`${relative(ROOT, OUT)}: ${declarations.length} declarations, ${snapshot.split('\n').length} lines`);
