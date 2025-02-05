
const reactCompilerConfig = {};

module.exports = {
  presets: [
    '@babel/preset-env',
    '@babel/preset-react',
    '@babel/preset-typescript',
  ],
  plugins: [
    ['babel-plugin-react-compiler', reactCompilerConfig],
    '@babel/plugin-proposal-class-properties',
    '@babel/plugin-syntax-export-default-from',
    '@babel/plugin-proposal-private-property-in-object',
  ],
};
