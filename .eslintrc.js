module.exports = {
  env: {
    browser: true,
    es6: true,
  },
  ignorePatterns: ['**/*.ts', '**/*.tsx', 'node_modules', 'src/legacy'],
  extends: [
    'plugin:react/recommended',
    'airbnb',
  ],
  globals: {
    Atomics: 'readonly',
    SharedArrayBuffer: 'readonly',
  },
  parser: 'babel-eslint',
  parserOptions: {
    ecmaFeatures: {
      jsx: true,
    },
    ecmaVersion: 2018,
    sourceType: 'module',
  },
  plugins: [
    'react',
  ],
  rules: {
    // uncomment 'linebreak-style' to build in windows - its not adviced to commit from windows
    // read more - https://community.perforce.com/s/article/3096
    // ['linebreak-style']: 0,
    "import/extensions": [
      "error",
      "ignorePackages",
      {
        "js": "never",
        "jsx": "never",
        "ts": "never",
        "tsx": "never",
      },
    ],
    "react/forbid-prop-types": 0,
    // read more - https://github.com/babel/babel-eslint/issues/681#issuecomment-420663038
    "template-curly-spacing" : "off"
  },
  settings: {
    "import/resolver": {
      node: {
        extensions: [".js", ".jsx", ".ts", ".tsx"],
      },
    },
  },
};
