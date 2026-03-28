import tseslint from 'typescript-eslint'
import solid from 'eslint-plugin-solid/configs/typescript'
import prettier from 'eslint-config-prettier'

export default tseslint.config(
  {
    ignores: ['dist/**', 'node_modules/**', '*.css.ts'],
  },
  ...tseslint.configs.recommended,
  {
    ...solid,
    files: ['src/**/*.{ts,tsx}'],
  },
  prettier,
  {
    files: ['src/**/*.{ts,tsx}'],
    rules: {
      '@typescript-eslint/no-unused-vars': [
        'warn',
        { argsIgnorePattern: '^_', varsIgnorePattern: '^_' },
      ],
      '@typescript-eslint/no-explicit-any': 'warn',
    },
  },
)
