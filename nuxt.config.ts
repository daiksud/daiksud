// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  modules: [
    '@nuxt/ui-pro',
    '@nuxtjs/seo',
    '@nuxt/content',
    '@nuxt/eslint',
    '@nuxt/image',
    '@nuxthub/core',
    '@vueuse/nuxt'
  ],

  devtools: {
    enabled: true
  },

  css: ['~/assets/css/main.css'],

  site: {
    url: 'https://daiksud.me'
  },

  content: {
    preview: {
      api: 'https://api.nuxt.studio'
    }
  },

  future: {
    compatibilityVersion: 4
  },

  compatibilityDate: '2025-03-01',

  nitro: {
    prerender: {
      routes: ['/'],
      crawlLinks: true
    }
  },

  typescript: {
    strict: false
  },

  eslint: {
    config: {
      stylistic: {
        commaDangle: 'never',
        braceStyle: '1tbs'
      }
    }
  }
})
