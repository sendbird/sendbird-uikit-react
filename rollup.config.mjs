// plugins
import commonjs from "@rollup/plugin-commonjs";
import resolve from "@rollup/plugin-node-resolve";
import svgr from "@svgr/rollup";
import scss from "rollup-plugin-scss";
import postcss from "rollup-plugin-postcss";
import replace from "@rollup/plugin-replace";
import autoprefixer from "autoprefixer";
import copy from "rollup-plugin-copy";
import nodePolyfills from "rollup-plugin-polyfill-node";
import {visualizer} from "rollup-plugin-visualizer";
import ts2 from "rollup-plugin-typescript2"

// config from package.json
import pkg from "./package.json" assert {type: "json"};
import inputs from "./rollup.module-exports.mjs";

const APP_VERSION_STRING = "__react_dev_mode__";

export default {
  // To bundle split
  input: inputs,
  output: [
    {
      dir: "./dist",
      chunkFileNames: 'chunks/bundle-[hash].js',
      format: "esm",
      sourcemap: true,
    },
    {
      dir: "./dist/cjs",
      chunkFileNames: 'chunks/bundle-[hash].js',
      format: "cjs",
      sourcemap: true,
    },
  ],
  external: [
    "@sendbird/chat",
    "@sendbird/chat/groupChannel",
    "@sendbird/chat/openChannel",
    "@sendbird/chat/message",
    "@sendbird/uikit-tools",
    "react",
    "react-dom",
    "css-vars-ponyfill",
    "date-fns",
    "dompurify",
    // todo@v4: remove this
    // we do not add ts-pattern as dep to avoid conflict with client base
    // 'ts-pattern',
  ],
  plugins: [
    postcss({
      preprocessor: (content, id) =>
        new Promise((resolvecss) => {
          const result = scss.renderSync({ file: id });
          resolvecss({ code: result.css.toString() });
        }),
      plugins: [autoprefixer],
      sourceMap: true,
      extract: "dist/index.css",
      extensions: [".sass", ".scss", ".css"],
    }),
    replace({
      preventAssignment: false,
      exclude: "node_modules/**",
      [APP_VERSION_STRING]: pkg.version,
    }),
    ts2({
      tsconfig: 'tsconfig.json',
      tsconfigOverride: {
        compilerOptions:{
          declaration: false,
        }
      }
    }),
    svgr(),
    resolve({
      preferBuiltins: true,
    }),
    commonjs(),
    nodePolyfills({
      include: ["buffer", "stream"],
    }),
    copy({
      verbose: true,
      targets: [
        {
          src: "./README.md",
          dest: "dist",
        },
        {
          src: "./LICENSE",
          dest: "dist",
        },
        {
          src: "./CHANGELOG.md",
          dest: "dist",
        },
      ],
    }),
    visualizer({
      filename: "bundle-analysis.json",
      gzipSize: true,
      template: "raw-data",
      brotliSize: false,
    }),
    // Uncomment the below line, if you want to see box-graph of bundle size
    // visualizer(),
  ],
};
