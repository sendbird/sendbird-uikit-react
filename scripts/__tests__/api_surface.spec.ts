import { mkdirSync, mkdtempSync, readFileSync, rmSync, writeFileSync } from 'fs';
import { tmpdir } from 'os';
import { join, relative } from 'path';

import {
  collectDeclarations,
  declaredName,
  entryDeclaration,
  importBindings,
  renderSnapshot,
  resolveSpecifier,
  splitBlocks,
} from '../api_surface.mjs';

let typesDir: string;

function write(path: string, body: string) {
  const full = join(typesDir, path);
  mkdirSync(join(full, '..'), { recursive: true });
  writeFileSync(full, body);
  return full;
}

const reachable = (...entries: string[]) =>
  collectDeclarations(typesDir, entries).map((f) => relative(typesDir, f).replace(/\\/g, '/'));

const snapshot = (entries: Record<string, string>) =>
  renderSnapshot(typesDir, collectDeclarations(typesDir, Object.values(entries)), entries);

const headers = (out: string) =>
  out.split('\n').filter((l) => l.startsWith('// ===== ')).map((l) => l.slice(9, -6));

const block = (out: string, key: string) =>
  out.split('// ===== ').find((b) => b.startsWith(`${key} =====`)) ?? '';

beforeEach(() => {
  typesDir = mkdtempSync(join(tmpdir(), 'api-surface-'));
});

afterEach(() => {
  rmSync(typesDir, { recursive: true, force: true });
});

describe('entryDeclaration', () => {
  it('maps a source entry to its emitted declaration', () => {
    expect(relative(typesDir, entryDeclaration(typesDir, 'src/modules/App/index.tsx'))).toBe(
      join('modules', 'App', 'index.d.ts'),
    );
  });
});

describe('resolveSpecifier', () => {
  it('resolves a sibling module', () => {
    const from = write('a.d.ts', '');
    const target = write('b.d.ts', '');
    expect(resolveSpecifier(from, './b')).toBe(target);
  });

  it('resolves a directory through its index', () => {
    const from = write('a.d.ts', '');
    const target = write('nested/index.d.ts', '');
    expect(resolveSpecifier(from, './nested')).toBe(target);
  });

  it('ignores package specifiers', () => {
    const from = write('a.d.ts', '');
    expect(resolveSpecifier(from, '@sendbird/chat')).toBeNull();
  });

  it('returns null when nothing matches', () => {
    const from = write('a.d.ts', '');
    expect(resolveSpecifier(from, './missing')).toBeNull();
  });
});

describe('collectDeclarations', () => {
  it('keeps the entry and drops modules nothing reaches', () => {
    write('entry.d.ts', 'export declare const a: number;\n');
    write('orphan.d.ts', 'export declare const b: number;\n');

    expect(reachable('src/entry.ts')).toEqual(['entry.d.ts']);
  });

  it('follows a star re-export', () => {
    write('entry.d.ts', "export * from './shared';\n");
    write('shared.d.ts', 'export interface Shared {}\n');

    expect(reachable('src/entry.ts')).toEqual(['entry.d.ts', 'shared.d.ts']);
  });

  it('follows a named re-export through a directory index', () => {
    write('entry.d.ts', "export { thing } from './nested';\n");
    write('nested/index.d.ts', "export { thing } from './thing';\n");
    write('nested/thing.d.ts', 'export declare const thing: number;\n');

    expect(reachable('src/entry.ts')).toEqual(['entry.d.ts', 'nested/index.d.ts', 'nested/thing.d.ts']);
  });

  it('follows an inline import type, which only appears in a signature', () => {
    write('entry.d.ts', 'export declare const f: (p: import("./params").Params) => void;\n');
    write('params.d.ts', 'export interface Params {}\n');

    expect(reachable('src/entry.ts')).toEqual(['entry.d.ts', 'params.d.ts']);
  });

  it('terminates on a cycle', () => {
    write('a.d.ts', "export * from './b';\n");
    write('b.d.ts', "export * from './a';\n");

    expect(reachable('src/a.ts')).toEqual(['a.d.ts', 'b.d.ts']);
  });

  it('merges the closures of several entries without duplicating', () => {
    write('one.d.ts', "export * from './shared';\n");
    write('two.d.ts', "export * from './shared';\n");
    write('shared.d.ts', 'export interface Shared {}\n');

    expect(reachable('src/one.ts', 'src/two.ts')).toEqual(['one.d.ts', 'shared.d.ts', 'two.d.ts']);
  });

  it('skips an entry whose declaration was never emitted', () => {
    write('entry.d.ts', 'export declare const a: number;\n');

    expect(reachable('src/entry.ts', 'src/never-built.ts')).toEqual(['entry.d.ts']);
  });
});

describe('splitBlocks', () => {
  it('keeps every line, so a declaration cannot go missing between the parts', () => {
    const text = [
      '/// <reference types="react" />',
      '/** module note */',
      "import { A } from './a';",
      '/** doc */',
      'export interface B {',
      '    a: A;',
      '}',
      '/** trailing */',
    ].join('\n');

    const { imports, blocks } = splitBlocks(text);
    const before = text.split('\n').filter(Boolean).sort();
    const after = [...imports, ...blocks].join('\n').split('\n').filter(Boolean).sort();

    expect(after).toEqual(before);
  });

  it('attaches a leading doc comment to the declaration it documents', () => {
    const { blocks } = splitBlocks('/** @deprecated */\nexport type A = string;\n');

    expect(blocks).toEqual(['/** @deprecated */\nexport type A = string;']);
  });

  it('starts a block at a declaration that is neither exported nor declared', () => {
    const { blocks } = splitBlocks('interface Hidden {\n    a: string;\n}\n');

    expect(blocks).toEqual(['interface Hidden {\n    a: string;\n}']);
  });
});

describe('declaredName', () => {
  it('reads the name past a leading doc comment', () => {
    expect(declaredName('/** doc */\nexport declare const a: number;')).toBe('a');
  });

  it('returns null for a statement that declares nothing', () => {
    expect(declaredName('export {};')).toBeNull();
  });
});

describe('entry points', () => {
  const entries = {
    'Channel/components/MessageInput': 'src/modules/Channel/components/MessageInputWrapper/index.tsx',
    'Channel/components/MessageInputWrapper': 'src/modules/Channel/components/MessageInputWrapper/index.tsx',
    App: 'src/modules/App/index.tsx',
  };

  const build = (map: Record<string, string>) => {
    write('modules/App/index.d.ts', 'export declare const App: unknown;\n');
    write('modules/Channel/components/MessageInputWrapper/index.d.ts', 'export declare const W: unknown;\n');
    return snapshot(map);
  };

  it('lists the public paths in sorted order', () => {
    const listed = build(entries).split('\n').filter((l) => /^\/\/ [A-Za-z]/.test(l)).map((l) => l.slice(3));

    expect(listed).toEqual(['App', 'Channel/components/MessageInput', 'Channel/components/MessageInputWrapper']);
  });

  it('shows a removed path even though another path keeps its declaration reachable', () => {
    const rest = { ...entries };
    delete rest['Channel/components/MessageInput'];

    expect(build(rest)).not.toBe(build(entries));
  });

  it('shows a renamed path', () => {
    const renamed = { ...entries, 'Channel/components/MessageInputRenamed': entries['Channel/components/MessageInput'] };
    delete renamed['Channel/components/MessageInput'];

    expect(build(renamed)).not.toBe(build(entries));
  });

  it('keys an entry block by its public path, not by the source file it came from', () => {
    write('modules/App/index.d.ts', 'export declare const App: unknown;\n');

    expect(headers(snapshot({ App: 'src/modules/App/index.ts' }))).toContain('@App');
  });

  it('does not move when the entry source moves and the public path stays', () => {
    write('ui/Toggle/index.d.ts', 'export declare const Toggle: unknown;\n');
    const before = snapshot({ 'ui/Toggle': 'src/ui/Toggle/index.tsx' });

    rmSync(join(typesDir, 'ui/Toggle'), { recursive: true });
    write('ui/ToggleButton/index.d.ts', 'export declare const Toggle: unknown;\n');
    const after = snapshot({ 'ui/Toggle': 'src/ui/ToggleButton/index.tsx' });

    expect(after).toBe(before);
  });

  it('records what a public path exports, so moving a symbol out of one shows', () => {
    write('entry.d.ts', 'export interface Props {\n    a: string;\n}\nexport declare const C: (p: Props) => void;\n');
    const before = snapshot({ Entry: 'src/entry.ts' });

    write('entry.d.ts', "import { Props } from './props';\nexport declare const C: (p: Props) => void;\n");
    write('props.d.ts', 'export interface Props {\n    a: string;\n}\n');
    const after = snapshot({ Entry: 'src/entry.ts' });

    expect(after).not.toBe(before);
  });
});

describe('internal declarations', () => {
  const twoModules = () => {
    write('entry.d.ts', "import { Helper } from './helpers';\nexport declare const c: (h: Helper) => void;\n");
    write('helpers.d.ts', 'export type Helper = string;\n');
    write('spare.d.ts', 'export type Spare = number;\n');
  };

  it('keys a block by the symbol it declares rather than by its file', () => {
    twoModules();

    expect(headers(snapshot({ Entry: 'src/entry.ts' }))).toContain('#Helper');
  });

  it('carries every declaration that shares a name with another in its file', () => {
    const build = (low: string) => {
      write('entry.d.ts', "export { Level } from './model';\n");
      write('model.d.ts', `export declare const Level: {\n    readonly Low: "${low}";\n};\nexport type Level = typeof Level[keyof typeof Level];\n`);
      return snapshot({ Entry: 'src/entry.ts' });
    };
    const out = build('low');

    expect(block(out, '#Level')).toContain('readonly Low: "low";');
    expect(block(out, '#Level')).toContain('export type Level = typeof Level[keyof typeof Level];');
    expect(build('lo')).not.toBe(out);
  });

  it('does not move when the declaring file is renamed', () => {
    twoModules();
    const before = snapshot({ Entry: 'src/entry.ts' });

    rmSync(join(typesDir, 'helpers.d.ts'));
    write('helpers-renamed.d.ts', 'export type Helper = string;\n');
    write('entry.d.ts', "import { Helper } from './helpers-renamed';\nexport declare const c: (h: Helper) => void;\n");

    expect(snapshot({ Entry: 'src/entry.ts' })).toBe(before);
  });

  it('does not move when a declaration is moved into another internal module', () => {
    write('entry.d.ts', "import { Helper } from './helpers';\nimport { Spare } from './spare';\nexport declare const c: (h: Helper, s: Spare) => void;\n");
    write('helpers.d.ts', 'export type Helper = string;\n');
    write('spare.d.ts', 'export type Spare = number;\n');
    const before = snapshot({ Entry: 'src/entry.ts' });

    rmSync(join(typesDir, 'helpers.d.ts'));
    write('spare.d.ts', 'export type Spare = number;\nexport type Helper = string;\n');
    write('entry.d.ts', "import { Helper } from './spare';\nimport { Spare } from './spare';\nexport declare const c: (h: Helper, s: Spare) => void;\n");

    expect(snapshot({ Entry: 'src/entry.ts' })).toBe(before);
  });

  it('shows a changed signature', () => {
    twoModules();
    const before = snapshot({ Entry: 'src/entry.ts' });

    write('helpers.d.ts', 'export type Helper = string | null;\n');

    expect(snapshot({ Entry: 'src/entry.ts' })).not.toBe(before);
  });

  it('records both declarations when two modules export the same name differently', () => {
    write('entry.d.ts', "import { Thing } from './one';\nimport { Thing as Other } from './two';\nexport declare const c: (a: Thing, b: Other) => void;\n");
    write('one.d.ts', 'export type Thing = string;\n');
    write('two.d.ts', 'export type Thing = number;\n');

    const bodies = snapshot({ Entry: 'src/entry.ts' });

    expect(bodies).toContain('export type Thing = string;');
    expect(bodies).toContain('export type Thing = number;');
  });

  it('records a local export list, which is how a module says what it exposes', () => {
    write('entry.d.ts', "export { Thing } from './inner';\n");
    write('inner.d.ts', 'declare type Thing = string;\nexport { Thing };\n');

    expect(snapshot({ Entry: 'src/entry.ts' })).toContain('export { Thing };');
  });

  it('shows an import repointed at a different declaration of the same name', () => {
    write('entry.d.ts', "import { Thing } from './one';\nimport { Thing as Other } from './two';\nexport declare const c: (a: Thing, b: Other) => void;\n");
    write('one.d.ts', 'export type Thing = string;\n');
    write('two.d.ts', 'export type Thing = number;\n');
    const before = snapshot({ Entry: 'src/entry.ts' });

    write('entry.d.ts', "import { Thing } from './two';\nimport { Thing as Other } from './two';\nexport declare const c: (a: Thing, b: Other) => void;\n");

    expect(snapshot({ Entry: 'src/entry.ts' })).not.toBe(before);
  });
});

describe('importBindings', () => {
  it('reads every name a named import binds, not just the first', () => {
    expect(importBindings("import { Alpha, Beta } from './x';")).toEqual(['Alpha', 'Beta']);
  });

  it('reads the local name of an aliased import', () => {
    expect(importBindings("import { Alpha as Local } from './x';")).toEqual(['Local']);
  });

  it('reads a default binding, which has no braces to match on', () => {
    expect(importBindings("import Thing from './x';")).toEqual(['Thing']);
  });

  it('reads a namespace binding', () => {
    expect(importBindings("import * as NS from './x';")).toEqual(['NS']);
  });

  it('reads both halves of a default plus named import', () => {
    expect(importBindings("import Thing, { Alpha } from './x';")).toEqual(['Alpha', 'Thing']);
  });

  it('binds nothing for a side-effect import', () => {
    expect(importBindings("import './x.scss';")).toEqual([]);
  });
});

describe('what an internal block binds', () => {
  const useSecondName = () => {
    write('entry.d.ts', "import { Helper } from './holder';\nexport declare const c: (h: Helper) => void;\n");
    write('holder.d.ts', "import { Alpha, Beta } from './types';\nexport type Helper = Beta;\n");
    write('types.d.ts', 'export type Alpha = string;\nexport type Beta = number;\n');
  };

  it('keeps the import that binds a name the block uses, wherever it sits in the list', () => {
    useSecondName();

    expect(block(snapshot({ Entry: 'src/entry.ts' }), '#Helper')).toMatch(/^import .*\bBeta\b/m);
  });

  it('leaves out an import the block does not use', () => {
    useSecondName();

    expect(block(snapshot({ Entry: 'src/entry.ts' }), '#Helper')).not.toMatch(/^import .*\bAlpha\b/m);
  });

  it('keeps a default import, which binds without braces', () => {
    write('entry.d.ts', "import { Helper } from './holder';\nexport declare const c: (h: Helper) => void;\n");
    write('holder.d.ts', "import Thing from './thing';\nexport type Helper = Thing;\n");
    write('thing.d.ts', 'declare const Thing: string;\nexport default Thing;\n');

    expect(block(snapshot({ Entry: 'src/entry.ts' }), '#Helper')).toMatch(/^import Thing from/m);
  });

  it('keeps an aliased import under the name the block actually uses', () => {
    write('entry.d.ts', "import { Helper } from './holder';\nexport declare const c: (h: Helper) => void;\n");
    write('holder.d.ts', "import { Alpha as Local } from './types';\nexport type Helper = Local;\n");
    write('types.d.ts', 'export type Alpha = string;\n');

    expect(block(snapshot({ Entry: 'src/entry.ts' }), '#Helper')).toMatch(/^import .*\bLocal\b/m);
  });

  it('records a side-effect import, which binds nothing to attach it to', () => {
    write('entry.d.ts', "import { Helper } from './holder';\nexport declare const c: (h: Helper) => void;\n");
    write('holder.d.ts', "import './holder.scss';\nexport type Helper = string;\n");

    expect(snapshot({ Entry: 'src/entry.ts' })).toContain("import './holder.scss';");
  });
});

describe('what a reference names', () => {
  it('names the symbol a named re-export brings across, not the module holding it', () => {
    write('entry.d.ts', "export { Helper } from './holder';\n");
    write('holder.d.ts', 'export type Alpha = string;\nexport type Helper = number;\n');

    expect(snapshot({ Entry: 'src/entry.ts' })).toContain("export { Helper } from '#Helper';");
  });

  it('splits a re-export list so each name points at its own declaration', () => {
    write('entry.d.ts', "export { Alpha, Helper } from './holder';\n");
    write('holder.d.ts', 'export type Alpha = string;\nexport type Helper = number;\n');

    const out = snapshot({ Entry: 'src/entry.ts' });

    expect(out).toContain("export { Alpha } from '#Alpha';");
    expect(out).toContain("export { Helper } from '#Helper';");
  });

  it('names the declaration a default import resolves to', () => {
    write('entry.d.ts', "import Thing from './thing';\nexport declare const c: (t: Thing) => void;\n");
    write('thing.d.ts', 'declare const Thing: string;\nexport default Thing;\nexport type Spare = number;\n');

    expect(snapshot({ Entry: 'src/entry.ts' })).toContain("import Thing from '#Thing';");
  });

  it('names the symbol an inline import type reaches for', () => {
    write('entry.d.ts', 'export declare const c: (p: import("./params").Params) => void;\n');
    write('params.d.ts', 'export interface Params {\n    a: string;\n}\nexport type Spare = number;\n');

    expect(snapshot({ Entry: 'src/entry.ts' })).toContain('import("#Params").Params');
  });

  it('keeps a star re-export pointed at the module, whose export set is the contract', () => {
    write('entry.d.ts', "export * from './holder';\n");
    write('holder.d.ts', 'export type Alpha = string;\n');

    expect(snapshot({ Entry: 'src/entry.ts' })).toMatch(/export \* from '#Alpha~[0-9a-f]+';/);
  });

  it('does not move a reference when an unrelated export joins the module it points at', () => {
    const references = (out: string) => out.split('\n').filter((l) => l.includes("from '#") || l.includes('import("#'));

    write('entry.d.ts', 'export declare const c: (p: import("./params").Params) => void;\n');
    write('params.d.ts', 'export interface Params {\n    a: string;\n}\n');
    const before = references(snapshot({ Entry: 'src/entry.ts' }));

    write('params.d.ts', 'export interface Params {\n    a: string;\n}\nexport type Moved = boolean;\n');

    expect(references(snapshot({ Entry: 'src/entry.ts' }))).toEqual(before);
  });
});

describe('package imports', () => {
  const twoUsers = (extra: string) => {
    write('entry.d.ts', "import { Helper } from './holder';\nexport declare const c: (h: Helper) => void;\n");
    write('holder.d.ts', `import { User${extra} } from 'pkg';\nexport interface Helper {\n    user: User;\n}\n`);
  };

  it('splits a package import per name and leaves its specifier alone', () => {
    twoUsers(', Unrelated');

    expect(block(snapshot({ Entry: 'src/entry.ts' }), '#Helper')).toContain("import { User } from 'pkg';");
  });

  it('leaves out a package binding the block does not use', () => {
    twoUsers(', Unrelated');

    expect(block(snapshot({ Entry: 'src/entry.ts' }), '#Helper')).not.toContain('Unrelated');
  });

  it('gives one block to a declaration two modules share, whatever else they import', () => {
    write('entry.d.ts', "import { A } from './one';\nimport { B } from './two';\nexport declare const c: (a: A, b: B) => void;\n");
    write('one.d.ts', "import { User } from 'pkg';\nexport interface Shared {\n    user: User;\n}\nexport type A = Shared;\n");
    write('two.d.ts', "import { User, Spare } from 'pkg';\nexport interface Shared {\n    user: User;\n}\nexport type B = Spare;\n");

    expect(headers(snapshot({ Entry: 'src/entry.ts' })).filter((k) => k.startsWith('#Shared'))).toHaveLength(1);
  });

  it('splits a default and named import that share one statement', () => {
    write('entry.d.ts', "import { Helper } from './holder';\nexport declare const c: (h: Helper) => void;\n");
    write('holder.d.ts', "import React, { ReactNode } from 'react';\nexport type Helper = ReactNode;\n");

    const helper = block(snapshot({ Entry: 'src/entry.ts' }), '#Helper');

    expect(helper).toContain("import { ReactNode } from 'react';");
    expect(helper).not.toContain('React,');
  });
});

describe('the type modifier', () => {
  it('is dropped on an import, where it says nothing about the type', () => {
    write('entry.d.ts', "import { Helper } from './holder';\nexport declare const c: (h: Helper) => void;\n");
    write('holder.d.ts', "import type { User } from 'pkg';\nexport interface Helper {\n    user: User;\n}\n");

    expect(block(snapshot({ Entry: 'src/entry.ts' }), '#Helper')).toContain("import { User } from 'pkg';");
  });

  it('does not split one declaration in two when only the modifier differs', () => {
    write('entry.d.ts', "import { A } from './one';\nimport { B } from './two';\nexport declare const c: (a: A, b: B) => void;\n");
    write('one.d.ts', "import { User } from 'pkg';\nexport interface Shared {\n    user: User;\n}\nexport type A = Shared;\n");
    write('two.d.ts', "import type { User } from 'pkg';\nexport interface Shared {\n    user: User;\n}\nexport type B = Shared;\n");

    expect(headers(snapshot({ Entry: 'src/entry.ts' })).filter((k) => k.startsWith('#Shared'))).toHaveLength(1);
  });

  it('is kept on a re-export, where it decides whether a consumer can import a value', () => {
    write('entry.d.ts', "export { type Helper } from './holder';\n");
    write('holder.d.ts', 'export type Helper = string;\n');

    expect(snapshot({ Entry: 'src/entry.ts' })).toContain("export { type Helper } from '#Helper';");
  });
});

describe('what a module exports', () => {
  const barrel = (list: string) => ({
    'entry.d.ts': "export * from './barrel';\n",
    'barrel.d.ts': `export { ${list} } from './types';\n`,
    'types.d.ts': 'export type A = string;\nexport type B = number;\n',
  });
  const build = (files: Record<string, string>) => {
    for (const [path, body] of Object.entries(files)) write(path, body);
    return snapshot({ Entry: 'src/entry.ts' });
  };

  it('shows an internal barrel dropping a name, which a consumer imports through', () => {
    const before = build(barrel('A, B'));

    expect(build(barrel('A'))).not.toBe(before);
  });

  it('shows an internal barrel renaming what it re-exports', () => {
    const before = build(barrel('A as X'));

    expect(build(barrel('A as Y'))).not.toBe(before);
  });

  it('keeps a type-only re-export marked, since it decides what a consumer may import', () => {
    write('entry.d.ts', "export type { Helper } from './holder';\n");
    write('holder.d.ts', 'export type Helper = string;\n');

    expect(snapshot({ Entry: 'src/entry.ts' })).toContain('export type {');
  });
});

describe('what a declaration refers to', () => {
  const pair = (one: string, two: string) => {
    write('one.d.ts', `export { Foo } from './${one}';\n`);
    write('two.d.ts', `export { Foo } from './${two}';\n`);
    write('a.d.ts', "import { Value } from './va';\nexport interface Foo {\n    value: Value;\n}\n");
    write('b.d.ts', "import { Value } from './vb';\nexport interface Foo {\n    value: Value;\n}\n");
    write('va.d.ts', 'export type Value = string;\n');
    write('vb.d.ts', 'export type Value = number;\n');
    return snapshot({ One: 'src/one.ts', Two: 'src/two.ts' });
  };

  it('tells two same-looking declarations apart by what they reference', () => {
    expect(pair('a', 'b')).not.toBe(pair('b', 'a'));
  });

  it('merges declarations that share a name in one file into a single block', () => {
    write('entry.d.ts', "import { Level } from './levels';\nexport declare const c: (l: Level) => void;\n");
    write('levels.d.ts', 'export declare const Level: {\n    readonly LOW: "LOW";\n};\nexport type Level = typeof Level[keyof typeof Level];\n');

    expect(headers(snapshot({ Entry: 'src/entry.ts' })).filter((k) => k.startsWith('#Level'))).toHaveLength(1);
  });
});

describe('a binding a module re-exports', () => {
  const widget = (modifier: string) => {
    write('entry.d.ts', `import ${modifier}{ Widget } from './w';\nexport { Widget };\n`);
    write('w.d.ts', 'export declare class Widget {\n    id: string;\n}\n');
    return snapshot({ Entry: 'src/entry.ts' });
  };

  it('shows it turning type-only, which stops a consumer constructing it', () => {
    expect(widget('type ')).not.toBe(widget(''));
  });

  it('keeps the modifier rather than normalising it away', () => {
    expect(widget('type ')).toContain('import type {');
  });
});

describe('what a name resolves to', () => {
  it('follows a barrel alias to the declaration behind it', () => {
    const build = (inner: string) => {
      write('entry.d.ts', "import { Selected } from './barrel';\nexport declare const c: (s: Selected) => void;\n");
      write('barrel.d.ts', `export { ${inner} as Selected } from './types';\n`);
      write('types.d.ts', 'export type A = string;\nexport type B = number;\n');
      return snapshot({ Entry: 'src/entry.ts' });
    };

    expect(build('A')).not.toBe(build('B'));
  });

  it('follows a local export alias to the import behind it', () => {
    const build = (inner: string) => {
      write('entry.d.ts', "export { Selected } from './barrel';\n");
      write('barrel.d.ts', `import { ${inner} as Local } from './types';\nexport { Local as Selected };\n`);
      write('types.d.ts', 'export type A = string;\nexport type B = number;\n');
      return snapshot({ Entry: 'src/entry.ts' });
    };

    expect(build('A')).not.toBe(build('B'));
  });

  it('reads a namespace import a module publishes under its own name', () => {
    const build = (models: string, other: string) => {
      write('entry.d.ts', "export { Models, Other } from './barrel';\n");
      write('barrel.d.ts', `import * as Models from './${models}';\nimport * as Other from './${other}';\nexport { Models, Other };\n`);
      write('one.d.ts', 'export type Value = string;\n');
      write('two.d.ts', 'export type Value = number;\n');
      return snapshot({ Entry: 'src/entry.ts' });
    };

    expect(build('one', 'two')).not.toBe(build('two', 'one'));
  });

  it('keeps a local name out of the export names an alias list publishes', () => {
    const build = (inner: string) => {
      write('entry.d.ts', "export * from './barrel';\n");
      write('barrel.d.ts', `import { ${inner} as Local, C as Other } from './types';\nexport { Local as Value, Other as Local };\n`);
      write('types.d.ts', 'export type A = string;\nexport type B = number;\nexport type C = boolean;\n');
      return snapshot({ Entry: 'src/entry.ts' });
    };

    expect(build('A')).not.toBe(build('B'));
  });

  it('follows a default import through the re-export the module behind it publishes', () => {
    const build = (inner: string) => {
      write('entry.d.ts', "export { Selected } from './barrel';\n");
      write('barrel.d.ts', "import Selected from './bridge';\nexport { Selected };\n");
      write('bridge.d.ts', `export { ${inner} as default } from './types';\n`);
      write('types.d.ts', 'export type A = string;\nexport type B = number;\n');
      return snapshot({ Entry: 'src/entry.ts' });
    };

    expect(build('A')).not.toBe(build('B'));
  });

  it('reads a second export of a module it has already passed through', () => {
    const build = (inner: string) => {
      write('entry.d.ts', "export { Selected } from './a';\n");
      write('a.d.ts', `export { Foo as Selected } from './b';\nexport { ${inner} as Base } from './types';\n`);
      write('b.d.ts', "import { Base } from './a';\nexport { Base as Foo };\n");
      write('types.d.ts', 'export type A = string;\nexport type B = number;\n');
      return snapshot({ Entry: 'src/entry.ts' });
    };

    expect(build('A')).not.toBe(build('B'));
  });

  it('reads a second binding of a module it has already passed through', () => {
    const build = (inner: string) => {
      write('entry.d.ts', "export { One } from './a';\n");
      write('a.d.ts', `import { P } from './b';\nimport { ${inner} as Q } from './types';\nexport { P as One, Q as Two };\n`);
      write('b.d.ts', "import { Two } from './a';\nexport { Two as P };\n");
      write('types.d.ts', 'export type A = string;\nexport type B = number;\n');
      return snapshot({ Entry: 'src/entry.ts' });
    };

    expect(build('A')).not.toBe(build('B'));
  });

  it('tells declarations apart by the types they name in their own file', () => {
    const build = (one: string, two: string) => {
      write('one.d.ts', `export { Foo } from './${one}';\n`);
      write('two.d.ts', `export { Foo } from './${two}';\n`);
      write('a.d.ts', 'type Value = string;\nexport interface Foo {\n    value: Value;\n}\n');
      write('b.d.ts', 'type Value = number;\nexport interface Foo {\n    value: Value;\n}\n');
      return snapshot({ One: 'src/one.ts', Two: 'src/two.ts' });
    };

    expect(build('a', 'b')).not.toBe(build('b', 'a'));
  });
});

describe('a value that becomes type-only', () => {
  it('shows when a barrel a public path spreads marks it type-only', () => {
    const build = (modifier: string) => {
      write('entry.d.ts', "export * from './barrel';\n");
      write('barrel.d.ts', `export { ${modifier}Widget } from './w';\n`);
      write('w.d.ts', 'export declare class Widget {\n    id: string;\n}\n');
      return snapshot({ Entry: 'src/entry.ts' });
    };

    expect(build('type ')).not.toBe(build(''));
  });

  it('shows when the binding a module default-exports turns type-only', () => {
    const build = (modifier: string) => {
      write('entry.d.ts', `import ${modifier}{ Widget } from './w';\nexport default Widget;\n`);
      write('w.d.ts', 'export declare class Widget {\n    id: string;\n}\n');
      return snapshot({ Entry: 'src/entry.ts' });
    };

    expect(build('type ')).not.toBe(build(''));
  });
});

describe('what a re-export chain carries', () => {
  it('shows a name narrowed to type-only further down the chain', () => {
    const build = (modifier: string) => {
      write('entry.d.ts', "export { Widget } from './barrel';\n");
      write('barrel.d.ts', `export { ${modifier}Widget } from './holder';\n`);
      write('holder.d.ts', 'export declare class Widget {\n    id: string;\n}\n');
      return snapshot({ Entry: 'src/entry.ts' });
    };

    expect(build('type ')).not.toBe(build(''));
  });

  it('follows a binding that was imported and then exported locally', () => {
    const build = (inner: string) => {
      write('entry.d.ts', "export { Selected } from './barrel';\n");
      write('barrel.d.ts', `import { ${inner} as Selected } from './types';\nexport { Selected };\n`);
      write('types.d.ts', 'export type A = string;\nexport type B = number;\n');
      return snapshot({ Entry: 'src/entry.ts' });
    };

    expect(build('A')).not.toBe(build('B'));
  });

  it('records the name a namespace re-export is published under', () => {
    const build = (alias: string) => {
      write('entry.d.ts', "export * from './barrel';\n");
      write('barrel.d.ts', `export * as ${alias} from './models';\n`);
      write('models.d.ts', 'export type Model = string;\n');
      return snapshot({ Entry: 'src/entry.ts' });
    };

    expect(build('Models')).not.toBe(build('Entities'));
  });

  it('keeps the package a re-export reaches outside for', () => {
    const build = (pkg: string) => {
      write('entry.d.ts', "export { Value } from './barrel';\n");
      write('barrel.d.ts', `export { Value } from '${pkg}';\n`);
      return snapshot({ Entry: 'src/entry.ts' });
    };

    expect(build('pkg-a')).not.toBe(build('pkg-b'));
  });

  it('carries a difference along a reference chain longer than a fixed number of rounds', () => {
    const chain = (tail: string) => {
      const lines = ['export type Value8 = ' + tail + ';'];
      for (let level = 7; level >= 0; level -= 1) lines.unshift(`export type Value${level} = Value${level + 1};`);
      return `${lines.join('\n')}\n`;
    };
    const build = (one: string, two: string) => {
      write('one.d.ts', `export { Value0 } from './${one}';\n`);
      write('two.d.ts', `export { Value0 } from './${two}';\n`);
      write('a.d.ts', chain('string'));
      write('b.d.ts', chain('number'));
      return snapshot({ One: 'src/one.ts', Two: 'src/two.ts' });
    };

    expect(build('a', 'b')).not.toBe(build('b', 'a'));
  });
});

describe('how far a reference is followed', () => {
  it('carries a difference along a chain longer than the number of files it sits in', () => {
    const chain = (tail: string) => {
      const lines = [`export type Value19 = ${tail};`];
      for (let level = 18; level >= 0; level -= 1) lines.unshift(`export type Value${level} = Value${level + 1};`);
      return `${lines.join('\n')}\n`;
    };
    const build = (one: string, two: string) => {
      write('one.d.ts', `export { Value0 } from './${one}';\n`);
      write('two.d.ts', `export { Value0 } from './${two}';\n`);
      write('a.d.ts', chain('string'));
      write('b.d.ts', chain('number'));
      return snapshot({ One: 'src/one.ts', Two: 'src/two.ts' });
    };

    expect(build('a', 'b')).not.toBe(build('b', 'a'));
  });

  it('finishes when two modules re-export each other as namespaces', () => {
    write('entry.d.ts', "export * as A from './a';\n");
    write('a.d.ts', "export * as B from './b';\nexport type Value = string;\n");
    write('b.d.ts', "export * as A from './a';\n");

    expect(() => snapshot({ Entry: 'src/entry.ts' })).not.toThrow();
  });

  it('shows a namespace passed on by name being pointed somewhere else', () => {
    const build = (models: string, other: string) => {
      write('entry.d.ts', "export { Models, Other } from './barrel';\n");
      write('barrel.d.ts', `export * as Models from './${models}';\nexport * as Other from './${other}';\n`);
      write('a.d.ts', 'export type Value = string;\n');
      write('b.d.ts', 'export type Value = number;\n');
      return snapshot({ Entry: 'src/entry.ts' });
    };

    expect(build('a', 'b')).not.toBe(build('b', 'a'));
  });

  it('keeps the package behind a star re-export that leaves this repository', () => {
    const build = (pkg: string) => {
      write('entry.d.ts', "export * from './barrel';\n");
      write('barrel.d.ts', `export * from '${pkg}';\n`);
      return snapshot({ Entry: 'src/entry.ts' });
    };

    expect(build('pkg-a')).not.toBe(build('pkg-b'));
  });
});

describe('walking the export graph', () => {
  it('carries a difference along a chain longer than any fixed round count', () => {
    const chain = (tail: string) => {
      const depth = 520;
      const lines = [`export type Value${depth} = ${tail};`];
      for (let level = depth - 1; level >= 0; level -= 1) lines.unshift(`export type Value${level} = Value${level + 1};`);
      return `${lines.join('\n')}\n`;
    };
    const build = (one: string, two: string) => {
      write('one.d.ts', `export { Value0 } from './${one}';\n`);
      write('two.d.ts', `export { Value0 } from './${two}';\n`);
      write('a.d.ts', chain('string'));
      write('b.d.ts', chain('number'));
      return snapshot({ One: 'src/one.ts', Two: 'src/two.ts' });
    };

    expect(build('a', 'b')).not.toBe(build('b', 'a'));
  });

  it('does not mistake a module reached twice by different branches for a cycle', () => {
    const build = (other: string) => {
      write('entry.d.ts', "export * from './barrel';\n");
      write('barrel.d.ts', `export * as Models from './models';\nexport * as Other from './${other}';\n`);
      write('models.d.ts', 'export type Value = string;\n');
      return snapshot({ Entry: 'src/entry.ts' });
    };

    expect(build('models')).not.toBe(build('barrel'));
  });

  it('finishes when a namespace cycle is reached through a named re-export', () => {
    write('entry.d.ts', "export { A } from './a';\n");
    write('a.d.ts', "export { Self as A } from './b';\nexport type Value = string;\n");
    write('b.d.ts', "export * as Self from './a';\n");

    expect(() => snapshot({ Entry: 'src/entry.ts' })).not.toThrow();
  });

  it('keeps every package behind several star re-exports passed on again', () => {
    const build = (first: string) => {
      write('entry.d.ts', "export * from './bridge';\n");
      write('bridge.d.ts', "export * from './barrel';\n");
      write('barrel.d.ts', `export * from '${first}';\nexport * from 'pkg-z';\n`);
      return snapshot({ Entry: 'src/entry.ts' });
    };

    expect(build('pkg-a')).not.toBe(build('pkg-b'));
  });
});

describe('keeping the identity up to date', () => {
  const swap = (build: (one: string, two: string) => string) =>
    expect(build('one', 'two')).not.toBe(build('two', 'one'));

  it('notices a change behind a type-only re-export two modules away', () => {
    swap((one, two) => {
      write('entry.d.ts', `export { Foo as First } from './${one}';\nexport { Foo as Second } from './${two}';\n`);
      write('one.d.ts', "import { Value } from './va';\nexport interface Foo {\n    value: Value;\n}\n");
      write('two.d.ts', "import { Value } from './vb';\nexport interface Foo {\n    value: Value;\n}\n");
      write('va.d.ts', "export { type Value } from './ta';\n");
      write('vb.d.ts', "export { type Value } from './tb';\n");
      write('ta.d.ts', 'export type Value = string;\n');
      write('tb.d.ts', 'export type Value = number;\n');
      return snapshot({ Entry: 'src/entry.ts' });
    });
  });

  it('notices a change behind a namespace import', () => {
    swap((one, two) => {
      write('entry.d.ts', `export { Foo as First } from './${one}';\nexport { Foo as Second } from './${two}';\n`);
      write('one.d.ts', "import * as Model from './ta';\nexport interface Foo {\n    value: Model.Value;\n}\n");
      write('two.d.ts', "import * as Model from './tb';\nexport interface Foo {\n    value: Model.Value;\n}\n");
      write('ta.d.ts', 'export type Value = string;\n');
      write('tb.d.ts', 'export type Value = number;\n');
      return snapshot({ Entry: 'src/entry.ts' });
    });
  });

  it('keeps which module a cycle turns back to', () => {
    const build = (back: string) => {
      write('entry.d.ts', "export * from './a';\n");
      write('a.d.ts', "export type Value = string;\nexport * as Next from './b';\n");
      write('b.d.ts', `export type Value = number;\nexport * as Back from './${back}';\n`);
      return snapshot({ Entry: 'src/entry.ts' });
    };

    expect(build('a')).not.toBe(build('b'));
  });
});

describe('what a shared lookup carries', () => {
  it('notices a change behind a namespace a second declaration also reached', () => {
    const build = (one: string, two: string) => {
      write('entry.d.ts', `export { Foo as First } from './${one}';\nexport { Foo as Second } from './${two}';\n`);
      write('one.d.ts', "import * as Model from './ta';\nexport type Prelude = Model.Value;\nexport interface Foo {\n    value: Model.Value;\n}\n");
      write('two.d.ts', "import * as Model from './tb';\nexport type Prelude = Model.Value;\nexport interface Foo {\n    value: Model.Value;\n}\n");
      write('ta.d.ts', 'export type Value = string;\n');
      write('tb.d.ts', 'export type Value = number;\n');
      return snapshot({ Entry: 'src/entry.ts' });
    };

    expect(build('one', 'two')).not.toBe(build('two', 'one'));
  });

  it('keeps a cycle destination apart when neither module declares anything itself', () => {
    const build = (back: string) => {
      write('entry.d.ts', "export * from './a';\n");
      write('a.d.ts', "export { Value } from './ta';\nexport * as Next from './b';\n");
      write('b.d.ts', `export { Value } from './tb';\nexport * as Back from './${back}';\n`);
      write('ta.d.ts', 'export type Value = string;\n');
      write('tb.d.ts', 'export type Value = number;\n');
      return snapshot({ Entry: 'src/entry.ts' });
    };

    expect(build('a')).not.toBe(build('b'));
  });
});

describe('precedence and path-dependence', () => {
  it('lets an explicit re-export win over a star that also covers the name', () => {
    const build = (modifier: string) => {
      write('entry.d.ts', "export * from './barrel';\n");
      write('barrel.d.ts', `export { ${modifier}Widget } from './model';\nexport * from './model';\n`);
      write('model.d.ts', 'export declare class Widget {\n    id: string;\n}\n');
      return snapshot({ Entry: 'src/entry.ts' });
    };

    expect(build('type ')).not.toBe(build(''));
  });

  it('does not let a star carry the default export of the module behind it', () => {
    const build = (explicit: string) => {
      write('entry.d.ts', "export * as API from './barrel';\n");
      write('barrel.d.ts', `${explicit}export * from './model';\n`);
      write('model.d.ts', 'export declare class Widget {\n    id: string;\n}\nexport { Widget as default };\n');
      return snapshot({ Entry: 'src/entry.ts' });
    };

    expect(build("export { Widget as default } from './model';\n")).not.toBe(build(''));
  });

  it('does not move when an internal file behind a cycle is only renamed', () => {
    const build = (holder: string) => {
      write('entry.d.ts', `export { Foo } from './${holder}';\nexport { Bar } from './two';\n`);
      write(`${holder}.d.ts`, "import * as Model from './a';\nexport interface Foo {\n    value: Model.Value;\n}\n");
      write('two.d.ts', "import * as Model from './b';\nexport interface Bar {\n    value: Model.Value;\n}\n");
      write('a.d.ts', "export type Value = string;\nexport * as Next from './b';\n");
      write('b.d.ts', "export type Value = number;\nexport * as Next from './c';\n");
      write('c.d.ts', "export type Value = boolean;\nexport * as Next from './a';\n");
      return snapshot({ Entry: 'src/entry.ts' });
    };

    expect(build('z')).toBe(build('one'));
  });
});

describe('the snapshot as a whole', () => {
  const tree = () => {
    write('entry.d.ts', "/** @deprecated */\nimport { Helper } from './helpers';\nexport declare const c: (h: Helper) => void;\n");
    write('helpers.d.ts', '/// <reference types="react" />\n/** note */\nexport type Helper = string;\ninterface Hidden {\n    a: string;\n}\n');
  };

  it('carries every declaration line of every collected file', () => {
    tree();
    const out = snapshot({ Entry: 'src/entry.ts' });
    const canon = (l: string) => l.replace(/from\s*['"][^'"]*['"]/g, 'from X').trimEnd();
    const present = new Set(out.split('\n').map(canon));

    for (const file of collectDeclarations(typesDir, ['src/entry.ts'])) {
      for (const line of readFileSync(file, 'utf-8').split('\n')) {
        if (!line.trim() || /^import\b/.test(line)) continue;
        expect(present.has(canon(line))).toBe(true);
      }
    }
  });

  it('gives every block a unique key, so one cannot hide another', () => {
    tree();
    const keys = headers(snapshot({ Entry: 'src/entry.ts' }));

    expect(new Set(keys).size).toBe(keys.length);
  });

  it('orders blocks the same way whatever locale the machine is set to', () => {
    tree();
    const keys = headers(snapshot({ Entry: 'src/entry.ts' })).filter((k) => k !== 'public entry points');

    expect(keys).toEqual([...keys].sort());
  });

  it('is byte-identical across runs', () => {
    tree();

    expect(snapshot({ Entry: 'src/entry.ts' })).toBe(snapshot({ Entry: 'src/entry.ts' }));
  });
});
