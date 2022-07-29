// plugins
import { babel } from '@rollup/plugin-babel';
// import external from 'rollup-plugin-peer-deps-external';
import commonjs from '@rollup/plugin-commonjs';
import resolve from '@rollup/plugin-node-resolve';
// import extensions from 'rollup-plugin-extensions';
import svgr from '@svgr/rollup';
import scss from 'rollup-plugin-scss';
import postcss from 'rollup-plugin-postcss';
import replace from '@rollup/plugin-replace';
import typescript from '@rollup/plugin-typescript';
import autoprefixer from 'autoprefixer';
import copy from 'rollup-plugin-copy';
import nodePolyfills from 'rollup-plugin-polyfill-node';
// import { sizeSnapshot } from 'rollup-plugin-size-snapshot';

// config from package.json
import pkg from './package.json';
import inputs from './exports';

const APP_VERSION_STRING = '__uikit_app_version__';
const IS_ROLLUP = '__is_rollup__';
const IS_ROLLUP_REPLACE = '__is_rollup_replace__';

module.exports = ({
  // To bundle split
  input: inputs,
  output: [
    {
      dir: 'dist/cjs',
      format: 'cjs',
      sourcemap: true,
    },
    {
      dir: 'dist',
      format: 'esm',
      sourcemap: true,
    },
  ],
  external: [
    'sendbird',
    'prop-types',
    'react',
    'react-dom',
    'css-vars-ponyfill',
    'date-fns',
  ],
  plugins: [
    postcss({
      preprocessor: (content, id) => new Promise((resolvecss) => {
        const result = scss.renderSync({ file: id });
        resolvecss({ code: result.css.toString() });
      }),
      plugins: [
        autoprefixer,
      ],
      sourceMap: true,
      extract: 'dist/index.css',
      extensions: ['.sass', '.scss', '.css'],
    }),
    replace({
      preventAssignment: false,
      exclude: 'node_modules/**',
      [APP_VERSION_STRING]: pkg.version,
      [IS_ROLLUP]: IS_ROLLUP_REPLACE,
    }),
    typescript({ jsx: 'preserve' }),
    // external(),
    // extensions({
    //   // Supporting Typescript files
    //   // Uses ".mjs, .js" by default
    //   extensions: ['.tsx', '.ts', '.jsx', '.js'],
    //   // Resolves index dir files based on supplied extensions
    //   // This is enable by default
    //   resolveIndex: true,
    // }),
    svgr(),
    babel({
      presets: [
        '@babel/preset-react',
        [
          '@babel/preset-env',
          {
            modules: false,
            targets: {
              browsers: '> 1%, IE 10-11, not op_mini all, not dead',
              node: 8,
            },
          },
        ],
      ],
      babelHelpers: 'bundled',
      extensions: ['.tsx', '.ts', '.jsx', '.js'],
      exclude: 'node_modules/**',
      plugins: [
        '@babel/plugin-proposal-export-default-from',
        '@babel/plugin-proposal-class-properties',
      ],
    }),
    resolve({
      preferBuiltins: true,
    }),
    commonjs(),
    nodePolyfills({
      include: ['buffer', 'stream']
    }),
    copy({
      verbose: true,
      targets: [
        {
          src: './src/index.d.ts',
          dest: 'dist',
        },
        {
          src: './package.lock.json',
          dest: 'dist',
        },
      ],
    }),
  ],
});
