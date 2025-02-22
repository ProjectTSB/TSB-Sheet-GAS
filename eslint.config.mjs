import pluginJs from '@eslint/js'
import tseslint from 'typescript-eslint'
import stylistic from '@stylistic/eslint-plugin'

/** @type {import('eslint').Linter.Config[]} */
export default [
  { files: ['**/*.{js,mjs,cjs,ts,jsx,tsx}'] },
  pluginJs.configs.recommended,
  ...tseslint.configs.recommended,
  stylistic.configs['recommended'],
  {
    rules: {
      'no-import-assign': 'warn',
      '@typescript-eslint/no-unused-vars': 'off',
      '@stylistic/jsx-max-props-per-line': 'off',
      'yoda': ['warn', 'never', { exceptRange: true }],
      'no-shadow': 'warn',
      'spaced-comment': ['warn', 'always'],
      'no-var': 'error',
      'prefer-const': 'error',
      'prefer-spread': 'error',
      'prefer-template': 'warn',
      '@stylistic/quotes': ['warn', 'double', { avoidEscape: true }],
    },
  },
]
