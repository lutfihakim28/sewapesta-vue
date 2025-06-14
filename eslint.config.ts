import { globalIgnores } from 'eslint/config'
import { defineConfigWithVueTs, vueTsConfigs } from '@vue/eslint-config-typescript'
import pluginVue from 'eslint-plugin-vue'
import pluginPlaywright from 'eslint-plugin-playwright'
import pluginOxlint from 'eslint-plugin-oxlint'

// To allow more languages other than `ts` in `.vue` files, uncomment the following lines:
// import { configureVueProject } from '@vue/eslint-config-typescript'
// configureVueProject({ scriptLangs: ['ts', 'tsx'] })
// More info at https://github.com/vuejs/eslint-config-typescript/#advanced-setup

export default defineConfigWithVueTs(
  {
    name: 'app/files-to-lint',
    files: ['**/*.{ts,mts,tsx,vue}'],
  },

  globalIgnores(['**/dist/**', '**/dist-ssr/**', '**/coverage/**']),

  pluginVue.configs['flat/strongly-recommended'],
  vueTsConfigs.recommended,
  {
    rules: {
      '@typescript-eslint/member-ordering': [
        'error',
        {
          default: [
            'signature',
            'field',
            'constructor',
            'method',
          ],
        },
      ],

      // Disallow awaiting a value that is not a Thenable.
      // Helps catch common mistakes with async/await. Requires type information.
      '@typescript-eslint/await-thenable': 'error',

      // Enforce consistent usage of type assertions (`as Type` or `<Type>value`).
      // E.g., prefer `as` over `<Type>value` for consistency.
      '@typescript-eslint/consistent-type-assertions': [
        'error',
        {
          assertionStyle: 'as', // Enforce `as Type` syntax
          objectLiteralTypeAssertions: 'never', // Disallow type assertions on object literals
        },
      ],

      // Enforce consistent usage of type imports (`import type { Type } from '...'`).
      // Separates type imports from value imports, which can help with tree-shaking.
      '@typescript-eslint/consistent-type-imports': [
        'error',
        {
          prefer: 'type-imports',
          disallowTypeAnnotations: false,
          fixStyle: 'inline-type-imports', // Can automatically fix
        },
      ],
      "@typescript-eslint/prefer-for-of": "error",

      // Disallow explicitly defining `any` type.
      // Encourages more specific types and better type safety. Can be very strict.
      // You might set this to 'warn' or 'off' depending on project maturity and preference.
      '@typescript-eslint/no-explicit-any': 'warn',

      // Disallow unused variables. This is an extension of the base ESLint rule.
      // Configured to ignore variables starting with `_` (common for ignored parameters).
      '@typescript-eslint/no-unused-vars': [
        'warn',
        {
          argsIgnorePattern: '^_',
          varsIgnorePattern: '^_',
          caughtErrorsIgnorePattern: '^_',
        },
      ],

      // Disallow the declaration of empty interfaces.
      // Often, an empty interface indicates a missing type or a redundant declaration.
      '@typescript-eslint/no-empty-interface': 'error',

      // Disallow usage of the `delete` operator on array values.
      // `delete` on arrays creates sparse arrays, which is generally bad practice.
      '@typescript-eslint/no-array-delete': 'error',

      // Disallow inferred `any` on parameters of functions.
      // Forces explicit types or more careful inference. Requires type information.
      '@typescript-eslint/no-unsafe-assignment': 'warn', // From recommendedTypeChecked
      '@typescript-eslint/no-unsafe-call': 'warn', // From recommendedTypeChecked
      '@typescript-eslint/no-unsafe-member-access': 'warn', // From recommendedTypeChecked
      '@typescript-eslint/no-unsafe-argument': 'warn', // From recommendedTypeChecked
      '@typescript-eslint/no-unsafe-return': 'warn', // From recommendedTypeChecked

      // Requires `void` expressions to be used in statement position.
      // Prevents common pitfalls with promises that return void. Requires type information.
      '@typescript-eslint/no-floating-promises': ['error', { ignoreVoid: true }],

      // Enforces naming conventions for variables, functions, classes, etc.
      // Highly customizable. Example: PascalCase for types, camelCase for variables.
      '@typescript-eslint/naming-convention': [
        'error',
        {
          selector: 'variable',
          format: ['camelCase', 'PascalCase', 'UPPER_CASE'],
          leadingUnderscore: 'allow',
          trailingUnderscore: 'allow',
        },
        {
          selector: 'function',
          format: ['camelCase', 'PascalCase'],
        },
        {
          selector: 'typeLike', // classes, interfaces, type aliases, enums
          format: ['PascalCase'],
        },
        {
          selector: 'parameter',
          format: ['camelCase'],
          leadingUnderscore: 'allow',
        },
      ],
    }
  },

  {
    ...pluginPlaywright.configs['flat/recommended'],
    files: ['e2e/**/*.{test,spec}.{js,ts,jsx,tsx}'],
  },
  ...pluginOxlint.configs['flat/recommended'],
)
