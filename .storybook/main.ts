import { mergeConfig } from 'vite';
import svgr from 'vite-plugin-svgr';

export default {
  stories: ['../src/**/*.mdx', '../src/**/*.stories.@(js|jsx|mjs|ts|tsx)'],
  addons: [
    '@storybook/addon-links',
    '@storybook/addon-essentials',
    '@storybook/preset-scss',
    '@storybook/addon-docs',
  ],
  core: {
    builder: '@storybook/builder-vite',
  },
  framework: {
    name: '@storybook/react-vite',
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
  docs: {
    autodocs: true
  },
};
