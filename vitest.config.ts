import { defineConfig } from 'vitest/config';
import react from '@vitejs/plugin-react';
import { transformWithEsbuild } from 'vite';
import path from 'path';

// Mirror babel.config.js (used by the Rollup build) so tests run through the same
// transforms babel-jest applied — most importantly React Compiler. plugin-react
// handles JSX + TS itself; configFile/babelrc are disabled to avoid double-applying
// preset-react (which would double-transform JSX).
export default defineConfig({
  plugins: [
    // ui tests use `.spec.js` containing JSX. Jest+babel compiled JSX regardless of
    // extension; Vite/esbuild treats `.js` as plain JS → parse error. Pre-compile
    // `.js` source as JSX (esbuild) before other transforms.
    {
      name: 'js-as-jsx',
      enforce: 'pre',
      async transform(code, id) {
        if (id.includes('node_modules') || !/\.js$/.test(id.split('?')[0])) return null;
        return transformWithEsbuild(code, id, { loader: 'jsx', jsx: 'automatic' });
      },
    },
    react({
      include: /\.(jsx|ts|tsx)$/,
      babel: {
        babelrc: false,
        configFile: false,
        plugins: [
          ['babel-plugin-react-compiler', {}],
          '@babel/plugin-proposal-class-properties',
          '@babel/plugin-syntax-export-default-from',
          '@babel/plugin-proposal-private-property-in-object',
        ],
      },
    }),
  ],
  resolve: {
    // Replicate jest.config.js moduleNameMapper: stub styles + binary assets.
    // NOTE: @rollup/plugin-alias does `importee.replace(find, replacement)` for
    // RegExp finds, so the pattern must match the WHOLE specifier (`^.+\.…$`)
    // — otherwise only the extension is replaced, producing a broken path.
    alias: [
      { find: /^.+\.(css|less|sass|scss)$/, replacement: path.resolve(__dirname, './__mocks__/styleMock.js') },
      { find: /^.+\.(gif|ttf|eot|svg)$/, replacement: path.resolve(__dirname, './__mocks__/fileMock.js') },
    ],
  },
  test: {
    globals: true,
    environment: 'jsdom',
    setupFiles: ['./vitest-setup.ts'],
    clearMocks: true,
    // Replaces the bespoke scripts/failed-test-retry.js (rerun failed up to 3x).
    retry: 3,
    include: ['src/**/*.{test,spec}.{js,jsx,ts,tsx}'],
    exclude: [
      'node_modules',
      'dist',
      '**/__visual_tests__/**',
      '**/__snapshots__/**',
      '**/_externals/**',
      '**/stories/**',
      'apps/**',
    ],
    // Default pool (forks) with per-file isolation — matches Jest's per-file module
    // isolation. (An earlier singleFork override caused cross-file state pollution.)
    reporters: ['default', ['junit', { outputFile: './test-results/junit-report.xml' }]],
    coverage: {
      provider: 'v8',
      include: ['src/**/*.{js,jsx,ts,tsx}'],
      exclude: [
        '**/_externals/**',
        '**/stories/**',
        '**/*.{test,spec}.*',
        '**/__tests__/**',
        '**/__test__/**',
        '**/__mocks__/**',
      ],
      reporter: ['text', 'json-summary'],
    },
  },
});
