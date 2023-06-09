module.exports = {
  stories: [
    '../src/**/*.stories.@(js|tsx|mdx)',
    // todo - print docs on storybook later
    // '../docs/**/*.@(js|mdx)',
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
    }, {
      test: /\.(ts|tsx)$/,
      use: [
        {
          loader: require.resolve('babel-loader'),
        },
      ]
    });
    config.resolve.extensions.push('.ts', '.tsx');
    return config;
  },
};
