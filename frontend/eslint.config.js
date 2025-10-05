import js from '@eslint/js'
import globals from 'globals'
import reactHooks from 'eslint-plugin-react-hooks'
import reactRefresh from 'eslint-plugin-react-refresh'
import tseslint from '@typescript-eslint/eslint-plugin'
import { defineConfig, globalIgnores } from 'eslint/config'

export default defineConfig([
  globalIgnores(['dist']),
  {
    files: ['**/*.{ts,tsx}'],
    languageOptions: {
      ecmaVersion: 2020,
      globals: globals.browser,
    },
    extends: [
      'eslint:recommended',
      js.configs.recommended,
      tseslint.configs.recommended,
      reactHooks.configs['recommended'],
      'plugin:prettier/recommended',
      reactRefresh.configs.vite,
    ],
    plugins: ['prettier'],
    rules: {
      'prettier/prettier': 'error',
    },
  },
])
