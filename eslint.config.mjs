import js from '@eslint/js'
import globals from 'globals'
import tseslint from 'typescript-eslint'
import { defineConfig } from 'eslint/config'

export default defineConfig([
  { files: ['**/*.{js,mjs,cjs,ts}'], plugins: { js }, extends: ['js/recommended'] },
  {
    files: ['**/*.{js,mjs,cjs,ts}'],
    languageOptions: {
      env: {
        node: true,
        browser: true
      },
      globals: globals.node
    }
  },
  tseslint.configs.recommended
])
