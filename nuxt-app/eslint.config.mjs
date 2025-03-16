import withNuxt from './.nuxt/eslint.config.mjs'
import pluginVueA11y from 'eslint-plugin-vuejs-accessibility'

export default withNuxt(...pluginVueA11y.configs['flat/recommended'], {
  rules: {
    'prefer-template': 'error',
    'vue/script-setup-no-uses-vars': 'off',
    'vue/multi-word-component-names': 'off',
    'vue/component-definition-name-casing': ['error', 'PascalCase'],
    'vue/component-name-in-template-casing': [
      'error',
      'PascalCase',
      { registeredComponentsOnly: true },
    ],
    'vue/singleline-html-element-content-newline': [
      'error',
      {
        ignoreWhenNoAttributes: true,
        ignoreWhenEmpty: true,
        ignores: [
          'pre',
          'textarea',
          'button',
          'NuxtLink',
          'span',
          'a',
          'option',
          'p',
          'h1',
          'h2',
          'h3',
          'h4',
          'h5',
          'h6',
        ],
      },
    ],
    'vue/max-attributes-per-line': [
      'error',
      {
        singleline: {
          max: 1,
        },
        multiline: {
          max: 1,
        },
      },
    ],
    'vue/block-order': [
      'error',
      {
        order: ['script', 'template', 'style'],
      },
    ],
    'vue/no-deprecated-v-on-native-modifier': 'off',
    'vuejs-accessibility/media-has-caption': 'off',
    'vuejs-accessibility/aria-props': 'error',
    'vue/html-self-closing': 'off',
    'vue/require-typed-ref': 'error',
  },
  ignores: ['node_modules/'],
})
