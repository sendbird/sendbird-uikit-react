import { createHash } from 'crypto';
import { existsSync, mkdirSync, readFileSync, readdirSync, statSync, writeFileSync } from 'fs';
import { dirname, join, relative, resolve } from 'path';
import { fileURLToPath } from 'url';

import ts from 'typescript';

import moduleExports from '../rollup.module-exports.mjs';

const ROOT = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const TYPES = join(ROOT, 'dist', 'types');
const SRC = join(ROOT, 'src');
const OUT = join(ROOT, 'api', 'surface.d.ts');

const SPECIFIER = /(?:from\s*['"]([^'"]+)['"])|(?:import\(\s*['"]([^'"]+)['"]\s*\))/g;
const RELATIVE_SPECIFIER = /(from\s*['"])(\.[^'"]*)(['"])|(import\(\s*['"])(\.[^'"]*)(['"]\s*\))/g;
const NAMED_LIST = /^(import|export)\s+(type\s+)?\{([^}]*)\}\s*from\s*['"]([^'"]*)['"];?$/;
const DEFAULT_IMPORT = /^import\s+(type\s+)?([A-Za-z0-9_$]+)\s*from\s*['"]([^'"]*)['"];?$/;
const MIXED_IMPORT = /^import\s+(type\s+)?([A-Za-z0-9_$]+)\s*,\s*(\{[^}]*\})\s*from\s*['"]([^'"]*)['"];?$/;
const INLINE_MEMBER = /import\(\s*['"](\.[^'"]*)['"]\s*\)\s*\.\s*([A-Za-z0-9_$]+)/g;
const DECLARATION = /^(export|declare|abstract|interface|type|const|let|var|function|class|enum|namespace|module)\b/;
const DECLARED_NAME = /^(?:export\s+)?(?:default\s+)?(?:declare\s+)?(?:abstract\s+)?(?:type|interface|const|let|var|function|class|enum|namespace|module)\s+([A-Za-z0-9_$]+)/;
const RE_EXPORT = /^export\s*[{*][\s\S]*?\bfrom\b/;
const COMMENT = /^\s*(\/\*|\*|\/\/)/;

const DECLARATION_FOR = {
  '.js': ['.d.ts'],
  '.jsx': ['.d.ts'],
  '.mjs': ['.d.mts'],
  '.cjs': ['.d.cts'],
};
const DECLARATION_EXTENSIONS = ['.d.ts', '.d.mts', '.d.cts'];

const cache = new Map();
const read = (file) => {
  if (!cache.has(file)) cache.set(file, readFileSync(file, 'utf-8'));
  return cache.get(file);
};

const noteKey = (ctx, key) => {
  if (ctx.trace) ctx.trace.add(key);
  return key;
};

const digest = (text) => createHash('sha1').update(text).digest('hex').slice(0, 8);

export function entryDeclaration(typesDir, sourcePath) {
  return join(typesDir, sourcePath.replace(/^src\//, '').replace(/\.tsx?$/, '.d.ts'));
}

export function resolveSpecifier(fromFile, specifier) {
  if (!specifier.startsWith('.')) return null;
  const base = resolve(dirname(fromFile), specifier);
  const runtime = Object.keys(DECLARATION_FOR).find((extension) => base.endsWith(extension));
  const candidates = runtime
    ? DECLARATION_FOR[runtime].map((extension) => base.slice(0, -runtime.length) + extension)
    : [];
  if (DECLARATION_EXTENSIONS.some((extension) => base.endsWith(extension))) candidates.push(base);
  candidates.push(`${base}.d.ts`, join(base, 'index.d.ts'));
  for (const candidate of candidates) {
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

    const text = readFileSync(file, 'utf-8');
    for (const match of text.matchAll(SPECIFIER)) {
      const next = resolveSpecifier(file, match[1] ?? match[2]);
      if (next && !seen.has(next)) pending.push(next);
    }
    for (const reference of ts.preProcessFile(text, false, false).referencedFiles) {
      const next = resolve(dirname(file), reference.fileName);
      if (!seen.has(next) && existsSync(next) && statSync(next).isFile()) pending.push(next);
    }
  }

  return [...seen].sort();
}

export function splitBlocks(text) {
  const imports = [];
  const blocks = [];
  let current = null;
  let lead = [];

  for (const line of text.split('\n')) {
    if (DECLARATION.test(line)) {
      if (current) blocks.push(current);
      current = [...lead, line];
      lead = [];
    } else if (/^import\b/.test(line)) {
      if (current) blocks.push(current);
      if (lead.length > 0) blocks.push(lead);
      current = null;
      lead = [];
      imports.push(line);
    } else if (COMMENT.test(line)) {
      lead.push(line);
    } else if (current) {
      current.push(...lead, line);
      lead = [];
    } else {
      lead = [];
    }
  }
  if (current) blocks.push(current);
  if (lead.length > 0) blocks.push(lead);

  return { imports, blocks: blocks.map((lines) => lines.join('\n').replace(/\s+$/, '')) };
}

export function importBindings(line) {
  const names = [];
  const braces = line.match(/\{([^}]*)\}/);
  if (braces) {
    for (const part of braces[1].split(',')) {
      const local = part.trim().replace(/^type\s+/, '').split(/\s+as\s+/).pop();
      if (local) names.push(local.trim());
    }
  }
  const head = line.match(/^import\s+(?:type\s+)?(?:\*\s+as\s+([A-Za-z0-9_$]+)|([A-Za-z0-9_$]+))\s*(?:,|from\b)/);
  if (head) names.push(head[1] ?? head[2]);
  return names;
}

export function declaredNames(block) {
  const line = block.split('\n').find((candidate) => DECLARATION.test(candidate));
  const match = line && line.match(DECLARED_NAME);
  if (!match) return [];
  if (!/^(?:export\s+)?(?:declare\s+)?(?:const|let|var)\s/.test(line)) return [match[1]];

  const parsed = ts.createSourceFile('block.d.ts', block, ts.ScriptTarget.Latest, false);
  const [statement] = parsed.statements;
  if (statement && ts.isVariableStatement(statement)) {
    return statement.declarationList.declarations
      .map((declaration) => declaration.name.getText(parsed))
      .filter((name) => /^[A-Za-z0-9_$]+$/.test(name));
  }
  if (statement && statement.name && ts.isIdentifier(statement.name)) return [statement.name.text];
  return [match[1]];
}

export function declaredName(block) {
  return declaredNames(block)[0] ?? null;
}

function indexSymbols(declarations) {
  const declared = new Map();
  for (const file of declarations) {
    const own = new Map();
    for (const block of splitBlocks(read(file)).blocks) {
      if (RE_EXPORT.test(block)) continue;
      for (const name of declaredNames(block)) {
        own.set(name, own.has(name) ? `${own.get(name)}\n${block}` : block);
      }
    }
    declared.set(file, own);
  }
  return declared;
}

function reExportTargets(file) {
  const out = [];
  for (const block of splitBlocks(read(file)).blocks) {
    const line = block.split('\n').find((candidate) => DECLARATION.test(candidate)) ?? '';
    const specifier = line.match(/from\s*['"]([^'"]*)['"]/);
    if (!specifier) continue;
    const literal = specifier[1];
    const target = literal.startsWith('.') ? resolveSpecifier(file, literal) : null;

    const namespace = line.match(/^export\s*\*\s+as\s+([A-Za-z0-9_$]+)/);
    if (namespace) { out.push({ target, literal, namespace: namespace[1], star: false, pairs: [] }); continue; }
    if (/^export\s*\*/.test(line)) { out.push({ target, literal, star: true, pairs: [] }); continue; }

    const list = line.match(/^export\s+(type\s+)?\{([^}]*)\}/);
    if (!list) continue;
    const listIsType = list[1] !== undefined;
    const pairs = list[2]
      .split(',')
      .map((part) => part.trim())
      .filter(Boolean)
      .map((part) => {
        const typeOnly = listIsType || /^type\s/.test(part);
        const [inner, outer] = part.replace(/^type\s+/, '').split(/\s+as\s+/).map((piece) => piece.trim());
        return { inner, outer: outer ?? inner, typeOnly };
      });
    out.push({ target, literal, star: false, pairs });
  }
  return out;
}

function importBindingMap(file) {
  const bindings = new Map();
  for (const line of splitBlocks(read(file)).imports) {
    const specifier = line.match(/from\s*['"]([^'"]*)['"]/);
    if (!specifier) continue;
    const literal = specifier[1];
    const target = literal.startsWith('.') ? resolveSpecifier(file, literal) : null;
    const statementIsType = /^import\s+type\b/.test(line);
    const list = line.match(/\{([^}]*)\}/);
    if (list) {
      for (const part of list[1].split(',').map((piece) => piece.trim()).filter(Boolean)) {
        const typeOnly = statementIsType || /^type\s/.test(part);
        const [inner, outer] = part.replace(/^type\s+/, '').split(/\s+as\s+/).map((piece) => piece.trim());
        bindings.set(outer ?? inner, { target, literal, inner, typeOnly });
      }
    }
    const head = line.match(/^import\s+(?:type\s+)?(?:\*\s+as\s+([A-Za-z0-9_$]+)|([A-Za-z0-9_$]+))\s*(?:,|from\b)/);
    if (head) bindings.set(head[1] ?? head[2], { target, literal, inner: head[1] ? '*' : 'default', typeOnly: statementIsType });
  }
  return bindings;
}

function exportedNames(file, ctx, seen = new Set()) {
  const cached = ctx.exported.get(file);
  if (cached) {
    if (ctx.trace) for (const key of cached.deps) ctx.trace.add(key);
    return cached.signature;
  }
  if (seen.has(file)) {
    ctx.cycleHits += 1;
    return [];
  }
  if (!ctx.declared.has(file)) return [];
  seen.add(file);

  const outer = ctx.trace;
  const local = new Set();
  const hitsBefore = ctx.cycleHits;
  ctx.trace = local;
  const finish = (signature) => {
    ctx.trace = outer;
    if (outer) for (const key of local) outer.add(key);
    if (ctx.cycleHits === hitsBefore) ctx.exported.set(file, { signature, deps: local });
    return signature;
  };

  const entries = new Map();

  for (const { target, literal, star } of reExportTargets(file)) {
    if (!star) continue;
    if (target) {
      for (const entry of exportedNames(target, ctx, new Set(seen))) {
        const published = entry.startsWith('*=') ? entry : entry.replace(/^type /, '').split('=')[0];
        if (published !== 'default') entries.set(published, entry);
      }
    } else entries.set(`*${literal}`, `*=${literal}`);
  }

  for (const block of splitBlocks(read(file)).blocks) {
    if (RE_EXPORT.test(block)) continue;
    const line = block.split('\n').find((candidate) => DECLARATION.test(candidate)) ?? '';

    if (/^export\s+default\b/.test(line)) {
      const name = defaultExportName(file);
      entries.set('default', `default=${name ? localKey(name, file, ctx, new Set(seen)) : 'anonymous'}`);
      continue;
    }

    const list = line.match(/^export\s+(type\s+)?\{([^}]*)\}/);
    if (list) {
      const listIsType = list[1] !== undefined;
      for (const part of list[2].split(',').map((piece) => piece.trim()).filter(Boolean)) {
        const typeOnly = listIsType || /^type\s/.test(part);
        const [inner, outer] = part.replace(/^type\s+/, '').split(/\s+as\s+/).map((piece) => piece.trim());
        const name = outer ?? inner;
        const key = ctx.declared.get(file).has(inner) ? noteKey(ctx, ctx.keys.get(file).get(inner)) : localKey(inner, file, ctx, new Set(seen));
        entries.set(name, `${typeOnly ? 'type ' : ''}${name}=${key}`);
      }
      continue;
    }

    if (/^export\b/.test(line)) {
      for (const name of declaredNames(block)) {
        entries.set(name, `${name}=${noteKey(ctx, ctx.keys.get(file)?.get(name) ?? `#${name}`)}`);
      }
    }
  }

  for (const { target, literal, star, namespace, pairs } of reExportTargets(file)) {
    if (star) continue;
    if (namespace) {
      entries.set(namespace, `${namespace}=namespace(${target ? moduleKey(target, ctx, new Set(seen)) : literal})`);
      continue;
    }
    for (const { inner, outer, typeOnly } of pairs) {
      const key = target ? symbolKey(inner, target, ctx, new Set(seen)) : `${literal}:${inner}`;
      entries.set(outer, `${typeOnly ? 'type ' : ''}${outer}=${key}`);
    }
  }

  return finish([...entries.values()].sort());
}

function localExports(file) {
  const names = new Set();
  for (const block of splitBlocks(read(file)).blocks) {
    const line = block.split('\n').find((candidate) => DECLARATION.test(candidate)) ?? '';
    if (/\bfrom\b/.test(line)) continue;
    const dflt = line.match(/^export\s+default\s+([A-Za-z0-9_$]+)\s*;/);
    if (dflt) { names.add(dflt[1]); continue; }
    const list = line.match(/^export\s*\{([^}]*)\}/);
    if (!list) continue;
    for (const part of list[1].split(',')) {
      const inner = part.trim().replace(/^type\s+/, '').split(/\s+as\s+/)[0];
      if (inner) names.add(inner.trim());
    }
  }
  return names;
}

function localAliases(file) {
  const aliases = new Map();
  for (const block of splitBlocks(read(file)).blocks) {
    const line = block.split('\n').find((candidate) => DECLARATION.test(candidate)) ?? '';
    if (/\bfrom\b/.test(line)) continue;
    const list = line.match(/^export\s+(type\s+)?\{([^}]*)\}/);
    if (!list) continue;
    const listIsType = list[1] !== undefined;
    for (const part of list[2].split(',').map((piece) => piece.trim()).filter(Boolean)) {
      const typeOnly = listIsType || /^type\s/.test(part);
      const [inner, outer] = part.replace(/^type\s+/, '').split(/\s+as\s+/).map((piece) => piece.trim());
      aliases.set(outer ?? inner, { inner, typeOnly });
    }
  }
  return aliases;
}

function locateExported(file, name, ctx, seen = new Set(), typeOnly = false) {
  const visit = `export ${name} ${file}`;
  if (seen.has(visit) || !ctx.declared.has(file)) return null;
  seen.add(visit);

  const alias = localAliases(file).get(name);
  if (alias) return locateLocal(file, alias.inner, ctx, seen, typeOnly || alias.typeOnly);

  if (ctx.declared.get(file).has(name)) return { file, name, typeOnly };

  if (name === 'default') {
    const bound = defaultExportName(file);
    if (bound) return locateLocal(file, bound, ctx, seen, typeOnly);
  }

  const externalStars = [];
  const relativeStars = [];
  for (const { target, literal, star, namespace, pairs } of reExportTargets(file)) {
    if (namespace) {
      if (namespace === name) return { namespaceOf: target, literal, typeOnly };
      continue;
    }
    if (star) {
      if (target) relativeStars.push(target);
      else externalStars.push(literal);
      continue;
    }
    const match = pairs.find((pair) => pair.outer === name);
    if (!match) continue;
    if (!target) return { external: `${literal}:${match.inner}`, typeOnly: typeOnly || match.typeOnly };
    const found = locateExported(target, match.inner, ctx, seen, typeOnly || match.typeOnly);
    if (found) return found;
  }

  if (name !== 'default') {
    for (const target of relativeStars) {
      const found = locateExported(target, name, ctx, seen, typeOnly);
      if (found) return found;
    }
    if (externalStars.length > 0) return { external: `${externalStars.sort().join('|')}:${name}`, typeOnly };
  }
  return null;
}

function locateLocal(file, name, ctx, seen = new Set(), typeOnly = false) {
  const visit = `local ${name} ${file}`;
  if (seen.has(visit) || !ctx.declared.has(file)) return null;
  seen.add(visit);

  if (ctx.declared.get(file).has(name)) return { file, name, typeOnly };

  const binding = importBindingMap(file).get(name);
  if (!binding) return null;
  if (binding.inner === '*') return { namespaceOf: binding.target, literal: binding.literal, typeOnly: typeOnly || binding.typeOnly };
  if (!binding.target) return { external: `${binding.literal}:${binding.inner}`, typeOnly: typeOnly || binding.typeOnly };
  return locateExported(binding.target, binding.inner, ctx, seen, typeOnly || binding.typeOnly);
}

function defaultExportName(file) {
  const text = read(file);
  const declared = text.match(/^export\s+default\s+(?:abstract\s+)?(?:function|class|interface)\s+([A-Za-z0-9_$]+)/m);
  if (declared) return declared[1];
  const bound = text.match(/^export\s+default\s+([A-Za-z0-9_$]+)\s*;/m);
  return bound ? bound[1] : null;
}

function declaredKeys(file, ctx) {
  const own = ctx.declared.get(file);
  if (!own) return [];
  return [...own.keys()].sort().map((name) => noteKey(ctx, ctx.keys.get(file)?.get(name) ?? `#${name}`));
}

function moduleKey(file, ctx, seen = new Set()) {
  if (seen.has(file)) {
    ctx.cycleHits += 1;
    return `#cycle(${[...seen].indexOf(file)}:${digest(declaredKeys(file, ctx).join(','))})`;
  }
  const signature = exportedNames(file, ctx, seen);
  const first = signature.length > 0 ? signature[0].replace(/^type /, '').split('=')[0] : 'empty';
  return `#${first}~${digest(signature.join(','))}`;
}

function keyOf(located, name, ctx, seen) {
  if (!located) return `#${name}`;
  let key;
  if (located.namespaceOf !== undefined) key = `#namespace(${located.namespaceOf ? moduleKey(located.namespaceOf, ctx, new Set(seen)) : located.literal})`;
  else if (located.external) key = `#${located.external}`;
  else key = noteKey(ctx, ctx.keys.get(located.file).get(located.name) ?? `#${located.name}`);
  return located.typeOnly ? `${key}:type` : key;
}

function symbolKey(name, targetFile, ctx, seen = new Set()) {
  return keyOf(locateExported(targetFile, name, ctx), name, ctx, seen);
}

function localKey(name, file, ctx, seen = new Set()) {
  return keyOf(locateLocal(file, name, ctx), name, ctx, seen);
}

function targetKey(file, specifier, name, ctx) {
  const target = resolveSpecifier(file, specifier);
  if (!target) return null;
  if (!name) return moduleKey(target, ctx);
  if (name !== 'default') return symbolKey(name, target, ctx);
  const located = locateExported(target, name, ctx);
  return located ? keyOf(located, name, ctx, new Set()) : moduleKey(target, ctx);
}

function foldInline(file, text, ctx) {
  return text
    .replace(INLINE_MEMBER, (all, specifier, name) => {
      const key = targetKey(file, specifier, name, ctx);
      return key ? `import("${key}").${name}` : all;
    })
    .replace(RELATIVE_SPECIFIER, (all, from, before, close, open, inline, after) => {
      const key = targetKey(file, before ?? inline, null, ctx);
      if (!key) return all;
      return before ? `${from}${key}${close}` : `${open}${key}${after}`;
    });
}

function foldLine(file, line, ctx) {
  const mixed = line.match(MIXED_IMPORT);
  if (mixed) {
    const [, typeOnly, binding, names, specifier] = mixed;
    return [
      foldLine(file, `import ${typeOnly ?? ''}${binding} from '${specifier}';`, ctx),
      foldLine(file, `import ${typeOnly ?? ''}${names} from '${specifier}';`, ctx),
    ].join('\n');
  }

  const list = line.match(NAMED_LIST);
  if (list) {
    const [, keyword, typeOnly, names, specifier] = list;
    const importing = keyword === 'import';
    const reExported = importing ? localExports(file) : null;
    return names
      .split(',')
      .map((part) => part.trim())
      .filter(Boolean)
      .map((part) => {
        const bare = part.replace(/^type\s+/, '');
        const local = bare.split(/\s+as\s+/).pop().trim();
        const name = bare.split(/\s+as\s+/)[0].trim();
        const key = specifier.startsWith('.') ? targetKey(file, specifier, name, ctx) : null;
        if (!importing) return `export ${typeOnly ?? ''}{ ${part} } from '${key ?? specifier}';`;
        const typeOnlyBinding = (typeOnly !== undefined || /^type\s/.test(part)) && reExported.has(local);
        return `import ${typeOnlyBinding ? 'type ' : ''}{ ${bare} } from '${key ?? specifier}';`;
      })
      .sort()
      .join('\n');
  }

  const single = line.match(DEFAULT_IMPORT);
  if (single) {
    const key = single[3].startsWith('.') ? targetKey(file, single[3], 'default', ctx) : null;
    const keep = single[1] !== undefined && localExports(file).has(single[2]);
    return `import ${keep ? 'type ' : ''}${single[2]} from '${key ?? single[3]}';`;
  }

  return foldInline(file, line, ctx);
}

function renderBody(file, block, ctx) {
  const { imports } = splitBlocks(read(file));
  const identifiers = new Set(block.match(/[A-Za-z_$][A-Za-z0-9_$]*/g) ?? []);
  const used = imports
    .flatMap((line) => foldLine(file, line, ctx).split('\n'))
    .filter((line) => {
      const bindings = importBindings(line);
      return bindings.length > 0 && bindings.some((name) => identifiers.has(name));
    });
  return `${[...used, foldLine(file, block, ctx)].join('\n')}\n`;
}

function referencedIn(block) {
  const parsed = ts.createSourceFile('block.d.ts', block, ts.ScriptTarget.Latest, false);
  const found = new Set();
  const walk = (node) => {
    if (ts.isIdentifier(node)) { found.add(node.text); return; }
    ts.forEachChild(node, (child) => {
      if (node.name !== child || ts.isComputedPropertyName(child)) walk(child);
    });
  };
  walk(parsed);
  return found;
}

function identityOf(file, self, block, ctx) {
  const own = ctx.declared.get(file);
  const referenced = [...referencedIn(block)]
    .filter((name) => name !== self && own.has(name))
    .sort()
    .map((name) => noteKey(ctx, ctx.keys.get(file).get(name)))
    .join(',');
  return `${renderBody(file, block, ctx)}\u0000${referenced}`;
}

function resolveKeys(ctx) {
  for (const [file, own] of ctx.declared) {
    ctx.keys.set(file, new Map([...own.keys()].map((name) => [name, `#${name}`])));
  }

  const bodies = new Map();
  const deps = new Map();
  const idOf = (file, name) => `${file}\u0000${name}`;
  let dirty = null;

  const visited = new Set();
  const symbols = [...ctx.declared.values()].reduce((count, own) => count + own.size, 0);
  for (let round = 0; round < symbols + 8; round++) {
    ctx.exported.clear();
    const perName = new Map();

    for (const [file, own] of ctx.declared) {
      for (const [name, block] of own) {
        const id = idOf(file, name);
        const stale = dirty === null || [...(deps.get(id) ?? [])].some((key) => dirty.has(key));
        if (stale) {
          ctx.trace = new Set();
          const body = identityOf(file, name, block, ctx);
          deps.set(id, ctx.trace);
          ctx.trace = null;
          bodies.set(id, body);
        }
        const body = bodies.get(id);
        if (!perName.has(name)) perName.set(name, new Set());
        perName.get(name).add(body);
      }
    }

    dirty = new Set();
    for (const [file, own] of ctx.declared) {
      const next = new Map();
      for (const name of own.keys()) {
        const key = perName.get(name).size > 1 ? `#${name}~${digest(bodies.get(idOf(file, name)))}` : `#${name}`;
        const before = ctx.keys.get(file).get(name);
        if (before !== key) { dirty.add(before); dirty.add(key); }
        next.set(name, key);
      }
      ctx.keys.set(file, next);
    }

    if (dirty.size === 0) break;
    const state = digest([...ctx.keys].map(([file, m]) => `${file}:${[...m].join(',')}`).sort().join('\n'));
    if (visited.has(state)) break;
    visited.add(state);
  }
}

export function renderSnapshot(typesDir, declarations, entries) {
  cache.clear();
  const ctx = { declared: indexSymbols(declarations), keys: new Map(), exported: new Map(), trace: null, cycleHits: 0 };
  resolveKeys(ctx);
  ctx.exported.clear();

  const entryNames = new Map();
  for (const [name, source] of Object.entries(entries ?? {})) {
    const declaration = entryDeclaration(typesDir, source);
    if (!entryNames.has(declaration)) entryNames.set(declaration, []);
    entryNames.get(declaration).push(name);
  }

  const grouped = new Map();
  const add = (key, body) => {
    if (!grouped.has(key)) grouped.set(key, new Set());
    grouped.get(key).add(body);
  };

  for (const file of declarations) {
    if (entryNames.has(file)) {
      const folded = read(file)
        .split('\n')
        .map((line) => foldLine(file, line, ctx))
        .join('\n');
      add(`@${[...entryNames.get(file)].sort().join('|')}`, folded);
      continue;
    }

    const { imports, blocks } = splitBlocks(read(file));
    for (const line of imports) {
      if (importBindings(line).length === 0) add(`#unnamed~${digest(line)}`, `${foldLine(file, line, ctx)}\n`);
    }
    for (const block of blocks) {
      if (RE_EXPORT.test(block) || declaredName(block)) continue;
      add(`#unnamed~${digest(block)}`, `${foldLine(file, block, ctx)}\n`);
    }
    for (const [name, merged] of ctx.declared.get(file)) {
      add(ctx.keys.get(file).get(name), renderBody(file, merged, ctx));
    }
  }

  const rendered = [];
  for (const [key, bodies] of grouped) {
    const distinct = [...bodies].sort();
    if (distinct.length === 1) rendered.push([key, distinct[0]]);
    else for (const body of distinct) rendered.push([`${key}~${digest(body)}`, body]);
  }
  rendered.sort(([a], [b]) => (a < b ? -1 : a > b ? 1 : 0));

  const header = entries
    ? `// ===== public entry points =====\n${Object.keys(entries).sort().map((name) => `// ${name}\n`).join('')}`
    : '';

  return header + rendered.map(([key, body]) => `// ===== ${key} =====\n${body}`).join('');
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
