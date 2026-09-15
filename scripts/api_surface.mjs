import { existsSync, mkdirSync, readFileSync, readdirSync, statSync, writeFileSync } from 'fs';
import { dirname, join, relative, resolve } from 'path';
import { fileURLToPath } from 'url';

import moduleExports from '../rollup.module-exports.mjs';

const ROOT = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const TYPES = join(ROOT, 'dist', 'types');
const SRC = join(ROOT, 'src');
const OUT = join(ROOT, 'api', 'surface.d.ts');

const SPECIFIER = /(?:from\s*['"]([^'"]+)['"])|(?:import\(\s*['"]([^'"]+)['"]\s*\))/g;

export function entryDeclaration(typesDir, sourcePath) {
  return join(typesDir, sourcePath.replace(/^src\//, '').replace(/\.tsx?$/, '.d.ts'));
}

export function resolveSpecifier(fromFile, specifier) {
  if (!specifier.startsWith('.')) return null;
  const base = resolve(dirname(fromFile), specifier);
  for (const candidate of [`${base}.d.ts`, join(base, 'index.d.ts')]) {
    if (existsSync(candidate) && statSync(candidate).isFile()) return candidate;
  }
  return null;
}

export function collectDeclarations(typesDir, sourcePaths) {
  const seen = new Set();
  const pending = [];

  for (const sourcePath of sourcePaths) {
    const declaration = entryDeclaration(typesDir, sourcePath);
    if (existsSync(declaration)) pending.push(declaration);
  }

  while (pending.length > 0) {
    const file = pending.pop();
    if (seen.has(file)) continue;
    seen.add(file);

    for (const match of readFileSync(file, 'utf-8').matchAll(SPECIFIER)) {
      const next = resolveSpecifier(file, match[1] ?? match[2]);
      if (next && !seen.has(next)) pending.push(next);
    }
  }

  return [...seen].sort();
}

export function renderEntryPoints(entries) {
  const width = Math.max(...Object.keys(entries).map((name) => name.length));
  return Object.keys(entries)
    .sort()
    .map((name) => `// ${name.padEnd(width)}  <-  ${entries[name]}\n`)
    .join('');
}

export function renderSnapshot(typesDir, declarations, entries) {
  const header = entries
    ? `// ===== public entry points =====\n${renderEntryPoints(entries)}`
    : '';
  return (
    header +
    declarations
      .map((file) => `// ===== ${relative(typesDir, file)} =====\n${readFileSync(file, 'utf-8')}`)
      .join('')
  );
}

function newestMtime(dir) {
  let newest = 0;
  for (const entry of readdirSync(dir, { withFileTypes: true })) {
    const path = join(dir, entry.name);
    const mtime = entry.isDirectory() ? newestMtime(path) : statSync(path).mtimeMs;
    if (mtime > newest) newest = mtime;
  }
  return newest;
}

export function main() {
  if (!existsSync(TYPES)) {
    console.error(`${relative(ROOT, TYPES)} not found. Run \`yarn build\` first.`);
    process.exit(1);
  }

  // A stale tree still snapshots cleanly, so the mismatch would only surface in CI.
  if (existsSync(SRC) && newestMtime(SRC) > newestMtime(TYPES)) {
    console.warn(`warning: src/ is newer than ${relative(ROOT, TYPES)}. Run \`yarn build\` first.`);
  }

  const declarations = collectDeclarations(TYPES, Object.values(moduleExports));
  const snapshot = renderSnapshot(TYPES, declarations, moduleExports);

  mkdirSync(dirname(OUT), { recursive: true });
  writeFileSync(OUT, snapshot);

  console.log(`${relative(ROOT, OUT)}: ${declarations.length} declarations, ${snapshot.split('\n').length} lines`);
}

