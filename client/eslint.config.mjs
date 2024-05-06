import pluginJs from '@eslint/js'
import globals from 'globals'
import tseslint from 'typescript-eslint'

export default [
  {languageOptions: {globals: globals.browser}},
  pluginJs.configs.recommended,
  ...tseslint.configs.recommended,
  {
    ignores: ['src/graphql/index.tsx'],
    rules: {
      '@typescript-eslint/ban-ts-comment': 0,
      '@typescript-eslint/no-empty-function': 0,
      '@typescript-eslint/no-parameter-properties': 0,
      '@typescript-eslint/ban-types': 0,

      'no-undef': 2,
      'prefer-const': 1,
      'no-unused-vars': 1,
      'max-len': [
        1,
        {
          code: 250,
          ignoreStrings: true,
          ignoreTemplateLiterals: true,
          ignoreTrailingComments: true,
        },
      ],
    },
  },
]
