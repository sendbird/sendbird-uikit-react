#!/usr/bin/env node
// dts-export-walker.mjs — TypeScript-aware analysis of dist/index.d.ts for
// backward-compatibility checks.
//
// Modes:
//   --mode=exports         emit sorted list of exported names from the dts
//                          input (read from stdin)
//   --mode=internal-leak   emit any export whose declaration site cites an
//                          `internal/` source — failure mode for BC-4.
//
// Implementation note: dist/index.d.ts is the rollup-bundled declaration file
// emitted by `yarn build`. Rollup inlines module bodies so we cannot follow
// import specifiers — instead we inspect JSDoc tags (`@module`, `@internal`)
// and identifier comments that rollup-plugin-typescript2 preserves.
//
// For source-import leak detection on .ts/.tsx files (not bundled dts), use
// the `bc-check.sh` BC-5 grep instead.

import process from 'node:process';
import ts from 'typescript';

const mode = (process.argv.find((a) => a.startsWith('--mode=')) || '--mode=exports').split('=')[1];

let buffer = '';
process.stdin.setEncoding('utf8');
process.stdin.on('data', (chunk) => { buffer += chunk; });
process.stdin.on('end', () => {
  const source = ts.createSourceFile('index.d.ts', buffer, ts.ScriptTarget.Latest, true);
  if (mode === 'exports') {
    const out = collectExports(source);
    out.sort();
    process.stdout.write(out.join('\n') + (out.length ? '\n' : ''));
  } else if (mode === 'internal-leak') {
    const leaks = collectInternalLeaks(source);
    process.stdout.write(leaks.join('\n') + (leaks.length ? '\n' : ''));
    process.exitCode = leaks.length === 0 ? 0 : 1;
  } else {
    process.stderr.write(`unknown mode: ${mode}\n`);
    process.exit(64);
  }
});

function collectExports(sourceFile) {
  const out = new Set();
  ts.forEachChild(sourceFile, (node) => {
    if (hasExportModifier(node)) {
      const names = extractDeclarationNames(node);
      for (const n of names) out.add(`${categorize(node)}:${n}`);
    } else if (ts.isExportDeclaration(node) && node.exportClause && ts.isNamedExports(node.exportClause)) {
      for (const spec of node.exportClause.elements) {
        out.add(`re-export:${spec.name.text}`);
      }
    } else if (ts.isExportAssignment(node)) {
      out.add(`default:${node.expression.getText(sourceFile)}`);
    }
  });
  return Array.from(out);
}

function collectInternalLeaks(sourceFile) {
  const leaks = [];
  ts.forEachChild(sourceFile, (node) => {
    const txt = node.getText(sourceFile);
    if (/\binternal\//.test(txt) || /\b__internal\b/.test(txt)) {
      const names = extractDeclarationNames(node);
      const label = names.length ? names.join(',') : (hasExportModifier(node) ? '<unnamed export>' : '<non-export>');
      // Only flag actual exports, not comments. Check that this node is an export.
      if (hasExportModifier(node) || ts.isExportDeclaration(node)) {
        leaks.push(`${label} :: ${txt.slice(0, 200).replace(/\n/g, ' ')}`);
      }
    }
  });
  return leaks;
}

function hasExportModifier(node) {
  return Boolean(
    node.modifiers && node.modifiers.some((m) => m.kind === ts.SyntaxKind.ExportKeyword),
  );
}

function extractDeclarationNames(node) {
  const out = [];
  if (ts.isVariableStatement(node)) {
    for (const decl of node.declarationList.declarations) {
      if (decl.name && ts.isIdentifier(decl.name)) out.push(decl.name.text);
    }
  } else if ('name' in node && node.name && ts.isIdentifier(node.name)) {
    out.push(node.name.text);
  }
  return out;
}

function categorize(node) {
  if (ts.isFunctionDeclaration(node)) return 'function';
  if (ts.isClassDeclaration(node)) return 'class';
  if (ts.isInterfaceDeclaration(node)) return 'interface';
  if (ts.isTypeAliasDeclaration(node)) return 'type';
  if (ts.isEnumDeclaration(node)) return 'enum';
  if (ts.isVariableStatement(node)) return 'var';
  if (ts.isModuleDeclaration(node)) return 'module';
  return 'unknown';
}
