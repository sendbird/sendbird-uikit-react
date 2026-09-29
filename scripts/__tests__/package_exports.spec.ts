import { buildExports, declarationPath } from '../package_exports.js';

const LAMEJS = { 'lame.all': 'src/_externals/lamejs/lame.all.js' };

describe('declarationPath', () => {
  it('maps a .ts source onto its emitted declaration', () => {
    expect(declarationPath('src/utils/isVoiceMessage.ts')).toBe('./types/utils/isVoiceMessage.d.ts');
  });

  it('maps a .tsx source onto its emitted declaration', () => {
    expect(declarationPath('src/modules/App/index.tsx')).toBe('./types/modules/App/index.d.ts');
  });

  it('returns null for a source that emits no declaration', () => {
    expect(declarationPath('src/_externals/lamejs/lame.all.js')).toBeNull();
  });
});

describe('buildExports', () => {
  it('names a declaration that the package actually ships for every typed entry', () => {
    const { exports } = buildExports({ App: 'src/modules/App/index.tsx' });

    expect(exports['./App']).toEqual({
      types: './types/modules/App/index.d.ts',
      require: './cjs/App.js',
      import: './App.js',
      default: './App.js',
    });
  });

  it('omits types for an entry whose source emits no declaration', () => {
    const { exports } = buildExports(LAMEJS);

    expect(exports['./lame.all']).not.toHaveProperty('types');
    expect(exports['./lame.all']).toEqual({
      require: './cjs/lame.all.js',
      import: './lame.all.js',
      default: './lame.all.js',
    });
  });

  it('omits the same entry from typesVersions', () => {
    expect(buildExports(LAMEJS).typesVersions).toEqual({ '*': {} });
  });

  it('never names a types target outside the shipped declaration tree', () => {
    const { exports, typesVersions } = buildExports({
      ...LAMEJS,
      App: 'src/modules/App/index.tsx',
      index: 'src/index.ts',
    });

    const targets = [
      ...(Object.values(exports) as Array<string | { types?: string }>)
        .map((e) => (typeof e === 'string' ? undefined : e.types))
        .filter((t): t is string => t !== undefined),
      ...Object.values(typesVersions['*']).flat(),
    ];

    expect(targets.length).toBeGreaterThan(0);
    targets.forEach((target) => expect(target).toMatch(/^\.\/types\/.+\.d\.ts$/));
  });

  it('maps the root entry to "." in exports and typesVersions', () => {
    const { exports, typesVersions } = buildExports({ index: 'src/index.ts' });

    expect(exports['.'].types).toBe('./types/index.d.ts');
    expect(typesVersions['*']['.']).toEqual(['./types/index.d.ts']);
  });

  it('keeps package.json and the stylesheet reachable', () => {
    const { exports } = buildExports({});

    expect(exports['./package.json']).toBe('./package.json');
    expect(exports['./dist/index.css']).toBe('./dist/index.css');
  });
});
