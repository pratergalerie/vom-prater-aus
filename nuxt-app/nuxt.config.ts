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

  // Configure Nitro to use a different directory for temporary files
  nitro: {
    storage: {
      fs: {
        driver: 'fs',
        base: '/tmp/nitro-storage',
      },
    },
  },

  // Configure app to listen on all interfaces
  app: {
    baseURL: '/',
    head: {
      meta: [
        { charset: 'utf-8' },
        { name: 'viewport', content: 'width=device-width, initial-scale=1' },
      ],
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
            wght: '400',
          },
          'Crimson Pro': {
            wght: '200',
            ital: '200',
          },
        },
      },
    ],
    '@nuxt/eslint',
    '@vueuse/nuxt',
    '@nuxtjs/stylelint-module',
    '@nuxt/test-utils',
    '@nuxt/image',
    '@nuxtjs/device',
    '@nuxt/icon',
    '@nuxtjs/i18n',
    'nuxt-rellax',
    '@tresjs/nuxt',
    '@hypernym/nuxt-anime',
    '@nuxtjs/strapi',
  ],

  image: {
    format: ['webp', 'jpg'],
    // The screen sizes predefined by `@nuxt/image`:
    screens: {
      xs: 320,
      sm: 640,
      md: 768,
      lg: 1024,
      xl: 1280,
      xxl: 1536,
      '2xl': 1536,
    },
  },

  i18n: {
    locales: [
      {
        code: 'en',
        iso: 'en-UK',
        file: 'en.json',
      },
      {
        code: 'de',
        iso: 'de-DE',
        file: 'de.json',
      },
    ],
    defaultLocale: 'de',
    strategy: 'no_prefix',
  },

  anime: {
    composables: true,
  },

  icon: {
    customCollections: [
      {
        prefix: 'custom',
        dir: './app/assets/icons',
      },
    ],
  },

  routeRules: {},

  runtimeConfig: {
    strapi: {
      url: '',
      token: '',
    },
    public: {
      strapi: {
        url: '',
        token: '',
      },
    },
  },

  strapi: {},
})
