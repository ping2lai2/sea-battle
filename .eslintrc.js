module.exports = {
  env: {
    browser: true,
    node: true,
    commonjs: true,
    es6: true,
  },
  parser: 'babel-eslint',
  settings: {
    'import/parser': 'babel-eslint',
    react: {
      version: require('react/package.json').version,
    },
  },
  extends: ['eslint:recommended', 'plugin:react/recommended'],
  parserOptions: {
    ecmaFeatures: {
      jsx: true,
    },
    ecmaVersion: 2018,
    sourceType: 'module',
  },
  plugins: ['react'],
  globals: {
    __dirname: true,
  },
  rules: {
    indent: ['error', 2],
    'linebreak-style': ['error', 'windows'],
    quotes: ['error', 'single'],
    semi: ['error', 'always'],
  },
};
