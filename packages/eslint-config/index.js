const tseslint = require('@typescript-eslint/eslint-plugin');
const angular = require('@angular-eslint/eslint-plugin');
const angularTemplate = require('@angular-eslint/eslint-plugin-template');

module.exports = [
    {
        files: ['**/main.ts'],
        rules: {
            'no-console': 'off' // Bootstrap Angular autorisé
        }
    },
    {
        files: ['**/*.ts'],
        languageOptions: {
            parser: require('@typescript-eslint/parser'),
            parserOptions: {
                ecmaVersion: 2022,
                sourceType: 'module'
            }
        },
        plugins: {
            '@typescript-eslint': tseslint,
            '@angular-eslint': angular,
            'import': require('eslint-plugin-import'),
            'unused-imports': require('eslint-plugin-unused-imports'),
            'prefer-arrow': require('eslint-plugin-prefer-arrow')
        },
        rules: {
            // TypeScript
            '@typescript-eslint/no-unused-vars': 'error',
            '@typescript-eslint/explicit-function-return-type': 'off',
            '@typescript-eslint/no-explicit-any': 'warn',
            '@typescript-eslint/no-empty-function': 'off',

            // Angular
            '@angular-eslint/directive-selector': [
                'error',
                { type: 'attribute', prefix: 'app', style: 'camelCase' }
            ],
            '@angular-eslint/component-selector': [
                'error',
                { type: 'element', prefix: 'app', style: 'kebab-case' }
            ],
            '@angular-eslint/no-empty-lifecycle-method': 'off',

            // Imports
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
            ],
            'unused-imports/no-unused-imports': 'error',

            // Code quality
            'prefer-arrow/prefer-arrow-functions': 'error',
            'no-console': ['warn', { allow: ['warn', 'error'] }],
            'no-debugger': 'error',

            "quotes": ["error", "single"],
        }
    },
    {
        files: ['**/*.html'],
        languageOptions: {
            parser: require('@angular-eslint/template-parser')
        },
        plugins: {
            '@angular-eslint/template': angularTemplate
        },
        rules: {
            '@angular-eslint/template/no-negated-async': 'error'
        }
    }
];