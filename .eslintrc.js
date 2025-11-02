module.exports = {
  extends: [
    'eslint:recommended',
    '@typescript-eslint/recommended',
    'plugin:react/recommended',
    'plugin:react-hooks/recommended'
  ],
  rules: {
    // Prevent unused files
    'no-unused-vars': 'error',
    '@typescript-eslint/no-unused-vars': 'error',
    
    // Component organization rules
    'import/no-default-export': 'warn',
    'import/prefer-default-export': 'off',
    
    // Prevent empty files
    'no-empty': 'error',
    
    // Enforce consistent imports
    'import/order': [
      'error',
      {
        groups: [
          'builtin',
          'external',
          'internal',
          'parent',
          'sibling',
          'index'
        ],
        'newlines-between': 'always'
      }
    ]
  },
  overrides: [
    {
      files: ['**/*.tsx'],
      rules: {
        // Require components to be used
        'react/jsx-uses-react': 'error',
        'react/jsx-uses-vars': 'error'
      }
    }
  ]
};