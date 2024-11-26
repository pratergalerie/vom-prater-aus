// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: '2024-04-03',

  future: {
    compatibilityVersion: 4,
  },

  devtools: {
    enabled: true,

    timeline: {
      enabled: true,
    },
  },
  css: ['@/assets/css/main.css'],
  modules: [
    '@pinia/nuxt',
    [
      '@nuxtjs/google-fonts',
      {
        families: {
          'Sometype Mono': {
            wght: '400..700',
          },
          'Crimson Pro': {
            wght: '200..900',
            ital: '200',
          },
        },
      },
    ],
    '@nuxt/eslint',
    'pinia-plugin-persistedstate',
    '@vueuse/nuxt',
    '@nuxtjs/stylelint-module',
    '@nuxt/test-utils',
    '@nuxt/image',
    '@nuxtjs/device',
    '@nuxt/icon',
  ],
})
