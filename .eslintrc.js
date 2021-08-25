module.exports = {
    env: {
        node: true,
        es2021: true,
        browser: true,
    },
    parserOptions: {
        sourceType: 'module'
    },
    extends: [
        'eslint:recommended',
        'plugin:react/recommended',
        'plugin:react-hooks/recommended'
    ],
    rules: {
        quotes: ['error', 'single'],
        semi: ['error', 'never'],
        'react/prop-types': 0,
    }
}
