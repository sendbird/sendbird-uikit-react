import { mergeConfig } from 'vite';
import svgr from 'vite-plugin-svgr';
import path, { dirname, join } from 'path';

/**
 * This function is used to resolve the absolute path of a package.
 * It is needed in projects that use Yarn PnP or are set up within a monorepo.
 */
function getAbsolutePath(value: string): any {
  return dirname(require.resolve(join(value, 'package.json')));
}

export default {
  stories: ['../src/stories/**/*.mdx', '../src/stories/**/*.stories.@(js|jsx|mjs|ts|tsx)'],
  addons: [getAbsolutePath('@storybook/addon-essentials')],
  core: {
    builder: getAbsolutePath('@storybook/builder-vite'),
  },
  framework: {
    name: getAbsolutePath('@storybook/react-vite'),
    options: {},
  },
  viteFinal: async (config) => {
    return mergeConfig(config, {
      css: {
        preprocessorOptions: {
          scss: {
            quietDeps: true,
            additionalData: `@import '${path.resolve(__dirname, '../src')}/styles/variables';`,
          },
        },
      },
      plugins: [
        svgr({
          include: '**/*.svg',
        }),
      ],
    });
  },
  docs: {
    autodocs: 'tag',
    toc: true,
  },
};
