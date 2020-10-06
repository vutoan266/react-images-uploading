module.exports = {
  root: true,
  parser: '@typescript-eslint/parser',
  plugins: ['@typescript-eslint', 'jest'],
  extends: [
    'airbnb-typescript',
    'plugin:jest/recommended',
    // Make sure to put it last. docs: https://github.com/prettier/eslint-config-prettier#installation
    'prettier',
    'prettier/@typescript-eslint',
  ],
  parserOptions: {
    project: './tsconfig.eslint.json',
  },
  rules: {
    'react/jsx-props-no-spreading': 'off',
    'react/prop-types': 'off',
    'no-unused-expressions': 'off',
    '@typescript-eslint/no-unused-expressions': 'off',
    'no-continue': 'off',
    'no-await-in-loop': 'off',
    'react/require-default-props': ['off'],
    'react/no-array-index-key': 'off',
  },
  env: {
    browser: true,
  },
};
