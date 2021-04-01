module.exports = {
  stories: [
    '../src/**/*.stories.(js|mdx)',
    '../docs/**/*.(js|mdx)',
  ],
  addons: [
    '@storybook/addon-docs',
    '@storybook/addon-actions',
    '@storybook/addon-links',
    '@storybook/preset-scss'
  ],
};
