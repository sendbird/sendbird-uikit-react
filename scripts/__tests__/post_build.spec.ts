import { execFileSync } from 'child_process';
import { chmodSync, cpSync, existsSync, mkdirSync, mkdtempSync, readFileSync, rmSync, writeFileSync } from 'fs';
import { tmpdir } from 'os';
import { dirname, join } from 'path';
import { fileURLToPath } from 'url';

const SCRIPTS = join(dirname(fileURLToPath(import.meta.url)), '..');

let sandbox: string;

function run() {
  try {
    execFileSync(process.execPath, ['scripts/post_build.js'], {
      cwd: sandbox,
      env: { PATH: `${join(sandbox, 'bin')}:/usr/bin:/bin` },
      stdio: 'pipe',
    });
    return 0;
  } catch (error) {
    return (error as { status: number }).status;
  }
}

beforeEach(() => {
  sandbox = mkdtempSync(join(tmpdir(), 'post-build-'));

  mkdirSync(join(sandbox, 'dist', 'cjs'), { recursive: true });
  mkdirSync(join(sandbox, 'scripts'));
  mkdirSync(join(sandbox, 'bin'));

  for (const file of ['post_build.js', 'package_exports.js', 'package.template.json']) {
    cpSync(join(SCRIPTS, file), join(sandbox, 'scripts', file));
  }
  writeFileSync(join(sandbox, 'package.json'), JSON.stringify({ version: '0.0.0' }));
  writeFileSync(join(sandbox, 'rollup.module-exports.mjs'), "export default { index: 'src/index.ts' };\n");

  // Stands in for the declaration build, which is the step that can fail after
  // the manifest write is queued.
  const tsc = join(sandbox, 'bin', 'tsc');
  writeFileSync(tsc, '#!/bin/sh\nexit 1\n');
  chmodSync(tsc, 0o755);
});

afterEach(() => {
  rmSync(sandbox, { recursive: true, force: true });
});

describe('post_build', () => {
  it('reports a failing declaration build', () => {
    expect(run()).not.toBe(0);
  });

  it('has already written the manifest when the declaration build fails', () => {
    run();

    const manifest = join(sandbox, 'dist', 'package.json');
    expect(existsSync(manifest)).toBe(true);
    expect(JSON.parse(readFileSync(manifest, 'utf-8')).exports['.']).toEqual({
      types: './types/index.d.ts',
      require: './cjs/index.js',
      import: './index.js',
      default: './index.js',
    });
  });

  it('writes the manifest when every step succeeds', () => {
    writeFileSync(join(sandbox, 'bin', 'tsc'), '#!/bin/sh\nexit 0\n');
    chmodSync(join(sandbox, 'bin', 'tsc'), 0o755);

    expect(run()).toBe(0);
    expect(existsSync(join(sandbox, 'dist', 'package.json'))).toBe(true);
    expect(existsSync(join(sandbox, 'dist', 'cjs', 'package.json'))).toBe(true);
  });
});
