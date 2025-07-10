module.exports = {
  env: {
    browser: true,
    es2021: true,
    'cypress/globals': true
  },
  extends: ['plugin:react/recommended', 'standard'],
  overrides: [],
  parserOptions: {
    ecmaVersion: 'latest',
    sourceType: 'module'
  },
  plugins: ['react', 'cypress'],
  rules: {
    indent: ['error', 2]
  },
  settings: {
    react: {
      version: 'detect'
    }
  }
}
