import nextCoreWebVitals from "eslint-config-next/core-web-vitals";
import nextTypescript from "eslint-config-next/typescript";
import { dirname } from 'path'
import { fileURLToPath } from 'url'

const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)

const eslintConfig = [{
  ignores: ['node_modules/**', '.next/**', 'out/**', 'build/**', 'next-env.d.ts'],
}, ...nextCoreWebVitals, ...nextTypescript, {
  rules: {
    '@typescript-eslint/ban-ts-comment': 'warn',
    '@typescript-eslint/no-empty-object-type': 'warn',
    '@typescript-eslint/no-explicit-any': 'off', // Set to warn if you are hunting for the any type
    'import/no-unresolved': ['error', { caseSensitive: true }],
    '@typescript-eslint/no-unused-vars': [
      'warn',
      {
        vars: 'all',
        args: 'none', // Don't warn about unused function parameters. Set to 'after-used' for normal behavior
        ignoreRestSiblings: true, // This allows unused destructured variables. Set to false for normal behavior
        argsIgnorePattern: '^_',
        varsIgnorePattern: '^_',
        destructuredArrayIgnorePattern: '^_',
        caughtErrorsIgnorePattern: '^(_|ignore)',
      },
    ],
  },
}, { ignores: ['.next/'] }]

export default eslintConfig
