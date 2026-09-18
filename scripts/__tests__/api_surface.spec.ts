import { mkdirSync, mkdtempSync, rmSync, writeFileSync } from 'fs';
import { tmpdir } from 'os';
import { join, relative } from 'path';

import {
  collectDeclarations,
  entryDeclaration,
  renderSnapshot,
  resolveSpecifier,
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

describe('entry point map', () => {
  const entries = {
    'Channel/components/MessageInput': 'src/modules/Channel/components/MessageInputWrapper/index.tsx',
    'Channel/components/MessageInputWrapper': 'src/modules/Channel/components/MessageInputWrapper/index.tsx',
    App: 'src/modules/App/index.tsx',
  };

  const snapshotOf = (map: Record<string, string>) => {
    write('modules/App/index.d.ts', 'export declare const App: unknown;\n');
    write('modules/Channel/components/MessageInputWrapper/index.d.ts', 'export declare const W: unknown;\n');
    return renderSnapshot(typesDir, collectDeclarations(typesDir, Object.values(map)), map);
  };

  it('sorts by public path so the diff does not move with declaration order', () => {
    const paths = snapshotOf(entries)
      .split('\n')
      .filter((l) => l.includes('  <-  '))
      .map((l) => l.slice(3).split('  <-  ')[0].trim());

    expect(paths).toEqual(['App', 'Channel/components/MessageInput', 'Channel/components/MessageInputWrapper']);
  });

  it('shows a removed path even though another path keeps its declaration reachable', () => {
    const rest = { ...entries };
    delete rest['Channel/components/MessageInput'];

    expect(snapshotOf(rest)).not.toBe(snapshotOf(entries));
  });

  it('shows a renamed path', () => {
    const renamed = { ...entries, 'Channel/components/MessageInputRenamed': entries['Channel/components/MessageInput'] };
    delete renamed['Channel/components/MessageInput'];

    expect(snapshotOf(renamed)).not.toBe(snapshotOf(entries));
  });

  it('shows a path repointed at a source another entry already reaches', () => {
    const repointed = { ...entries, 'Channel/components/MessageInput': 'src/modules/App/index.tsx' };

    expect(snapshotOf(repointed)).not.toBe(snapshotOf(entries));
  });
});

describe('renderSnapshot', () => {
  it('labels every declaration with its path so a diff names the file', () => {
    write('entry.d.ts', "export * from './shared';\n");
    write('shared.d.ts', 'export interface Shared {}\n');

    expect(renderSnapshot(typesDir, collectDeclarations(typesDir, ['src/entry.ts']))).toBe(
      '// ===== entry.d.ts =====\n' +
        "export * from './shared';\n" +
        '// ===== shared.d.ts =====\n' +
        'export interface Shared {}\n',
    );
  });

  it('puts the entry points ahead of the declarations', () => {
    write('entry.d.ts', 'export declare const a: number;\n');

    const out = renderSnapshot(typesDir, collectDeclarations(typesDir, ['src/entry.ts']), {
      Entry: 'src/entry.ts',
    });

    expect(out).toBe(
      '// ===== public entry points =====\n' +
        '// Entry  <-  src/entry.ts\n' +
        '// ===== entry.d.ts =====\n' +
        'export declare const a: number;\n',
    );
  });

  it('is byte-identical across runs', () => {
    write('entry.d.ts', "export * from './shared';\n");
    write('shared.d.ts', 'export interface Shared {}\n');

    const once = renderSnapshot(typesDir, collectDeclarations(typesDir, ['src/entry.ts']));
    const twice = renderSnapshot(typesDir, collectDeclarations(typesDir, ['src/entry.ts']));
    expect(once).toBe(twice);
  });
});
