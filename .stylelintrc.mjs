export default {
  extends: ['stylelint-config-standard'],
  rules: {
    'at-rule-no-deprecated': [true, { ignoreAtRules: ['apply'] }],
    'at-rule-no-unknown': [
      true,
      {
        ignoreAtRules: [
          'apply',
          'plugin',
          'responsive',
          'screen',
          'tailwind',
          'theme',
          'variants',
        ],
      },
    ],
    'import-notation': 'string',
    'value-keyword-case': ['lower', { ignoreKeywords: ['InterVariable'] }],
  },
};
