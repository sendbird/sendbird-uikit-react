module.exports = {
  stories: [
    '../src/**/*.stories.@(js|mdx)',
    '../docs/**/*.@(js|mdx)',
  ],
  addons: [
    '@storybook/addon-docs',
    '@storybook/addon-actions',
    '@storybook/addon-links',
    '@storybook/preset-scss',
  ],
  webpackFinal: async (config, { configType }) => {
    const fileLoaderRule = config.module.rules.find(
      (rule) => !Array.isArray(rule.test) && rule.test.test(".svg"),
    );
    // !important! -> read
    // https://github.com/storybookjs/storybook/issues/6188#issuecomment-654884130
    fileLoaderRule.exclude = /\.svg$/;
    config.module.rules.push({
      test: /\.svg$/,
      use: ["@svgr/webpack"],
    });
    return config;
  },
};
