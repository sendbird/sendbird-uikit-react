// plugins
import { babel } from '@rollup/plugin-babel';
import commonjs from '@rollup/plugin-commonjs';
import resolve from '@rollup/plugin-node-resolve';
import svgr from '@svgr/rollup';
import scss from 'rollup-plugin-scss';
import postcss from 'rollup-plugin-postcss';
import replace from '@rollup/plugin-replace';
import typescript from '@rollup/plugin-typescript';
import autoprefixer from 'autoprefixer';
import copy from 'rollup-plugin-copy';
import nodePolyfills from 'rollup-plugin-polyfill-node';
import { visualizer } from 'rollup-plugin-visualizer';

// config from package.json
import pkg from './package.json';
import inputs from './rollup.module-exports';

const APP_VERSION_STRING = '__react_dev_mode__';

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
    '@sendbird/chat',
    '@sendbird/chat/groupChannel',
    '@sendbird/chat/openChannel',
    '@sendbird/chat/message',
    '@sendbird/uikit-tools',
    'react',
    'react-dom',
    'css-vars-ponyfill',
    'date-fns',
    'dompurify',
    // todo@v4: remove this
    // we do not add ts-pattern as dep to avoid conflict with client base
    // 'ts-pattern',
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
    }),
    typescript({ jsx: 'preserve' }),
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
      include: ['buffer', 'stream'],
    }),
    copy({
      verbose: true,
      targets: [
        {
          src: './scripts/index.d.ts',
          dest: 'dist',
          rename: 'index.d.ts',
        },
        {
          src: './README.md',
          dest: 'dist',
        },
        {
          src: './LICENSE',
          dest: 'dist',
        },
        {
          src: './CHANGELOG.md',
          dest: 'dist',
        },
      ],
    }),
    visualizer({
      filename: 'bundle-analysis.json',
      gzipSize: true,
      template: 'raw-data',
      brotliSize: false,
    }),
    // Uncomment the below line, if you want to see box-graph of bundle size
    // visualizer(),
  ],
});
