export default {
  customSyntax: 'postcss-html',
  plugins: [
    'stylelint-color-format',
    '@double-great/stylelint-a11y',
    'stylelint-use-nesting',
    'stylelint-no-indistinguishable-colors',
    'stylelint-value-no-unknown-custom-properties',
    './stylelint/plugins/no-unused-selectors.mjs',
  ],
  extends: [
    'stylelint-config-standard',
    'stylelint-config-recommended-vue',
    'stylelint-config-recess-order',
  ],
  rules: {
    'selector-pseudo-element-no-unknown': [
      true,
      {
        ignorePseudoElements: ['v-deep'],
      },
    ],
    'at-rule-no-unknown': [
      true,
      {
        ignoreAtRules: ['apply', 'variants', 'responsive', 'screen'],
      },
    ],
    'no-empty-source': null,
    'property-no-unknown': true,
    'color-format/format': {
      format: 'rgb',
    },
    'media-feature-range-notation': null,
    'selector-class-pattern': null,
    'value-keyword-case': null,
    'declaration-no-important': [
      true,
      {
        severity: 'warning',
      },
    ],
    'declaration-property-value-no-unknown': [
      true,
      { ignoreProperties: { '/.+/': '/(v-bind(.*))|($.*)/' } },
    ],

    'a11y/media-prefers-reduced-motion': true,
    'a11y/no-outline-none': true,
    'a11y/selector-pseudo-class-focus': true,
    'a11y/content-property-no-static-value': true,
    'a11y/no-display-none': true,
    'a11y/no-obsolete-attribute': true,
    'a11y/no-obsolete-element': true,
    'a11y/no-text-align-justify': true,
    'a11y/font-size-is-readable': null,
    'a11y/line-height-is-vertical-rhythmed': true,
    'a11y/media-prefers-color-scheme': null,
    'a11y/no-spread-text': true,

    'plugin/stylelint-no-indistinguishable-colors': true,

    'csstools/use-nesting': 'always',
    'csstools/value-no-unknown-custom-properties': [
      true,
      {
        importFrom: [
          process.env.STYLELINT_CSS_VARIABLES_PATH ||
            'nuxt-app/app/assets/css/variables.css',
        ],
      },
    ],

    'plugins/no-unused-selectors': [
      true,
      {
        severity: 'warning',
        ignore: [
          '#app',
          '^\\.v-',
          '^\\.router-link-',
          '.*-leave-active$',
          '.*-enter-active$',
          '.*-enter-to$',
          '.*-leave-to$',
          '.*-enter$',
          '.*-leave$',
          '.*-leave-from$',
          '.*-enter-from$',
        ],
        ignoredSelectors: ['from', 'to'],
      },
    ],
  },
}
