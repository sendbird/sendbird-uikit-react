import { mergeConfig } from 'vite';
import svgr from "vite-plugin-svgr";

export default {
  stories: ['../src/**/*.mdx', '../src/**/*.stories.@(js|jsx|mjs|ts|tsx)'],
  addons: ['@storybook/addon-links', '@storybook/addon-essentials'],
  framework: {
    name: '@storybook/react-vite'
  },
  core: {
    builder: '@storybook/builder-vite',
  },
  viteFinal: async (config) => {
    return mergeConfig(config, {
      plugins: [
        svgr({
          include: "**/*.svg",
        }),
      ],
    });
  },
};

// import type { StorybookConfig } from '@storybook/react-webpack5';
// const config: StorybookConfig = {
//   framework: '@storybook/react-webpack5',
//   stories: ['../src/**/*.mdx', '../src/**/*.stories.@(js|jsx|mjs|ts|tsx)'],
//   addons: [
//     {
//       name: '@storybook/addon-docs',
//       options: { configureJSX: true },
//     }
//   ],
//   webpackFinal: async (config) => {
//     // @ts-ignore
//     const fileLoaderRule = config.module.rules.find(rule => rule.test && rule.test.test('.svg'));
//     // @ts-ignore
//     fileLoaderRule.exclude = /\.svg$/;
//     return {
//       ...config,
//       module: {
//         ...config.module,
//         rules: [
//           {
//             test: /\.svg$/,
//             enforce: 'pre',
//             loader: require.resolve('@svgr/webpack'),
//           },
//           {
//             test: /\.(scss)$/,
//             use: [
//               {
//                 loader: 'style-loader',
//               },
//               {
//                 loader: 'css-loader',
//               },
//               {
//                 loader: 'postcss-loader',
//                 options: {
//                   postcssOptions: {
//                     plugins: function () {
//                       return [require('precss'), require('autoprefixer')];
//                     },
//                   },
//                 },
//               },
//               {
//                 loader: require.resolve('sass-loader'),
//                 options: {
//                   implementation: require('sass'),
//                 },
//               },
//             ],
//           },
//         ]
//       }
//     }
//   },
// };
// export default config;
