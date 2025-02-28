// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  modules: ['@nuxt/ui', '@nuxt/content', '@nuxthub/core'],
  app: {
    head: {
      link: [{ rel: 'icon', href: '/favicon.svg' }],
    },
  },
  css: ['~/assets/css/main.css'],
  devtools: {
    enabled: true,
  },
  icon: {
    serverBundle: 'remote',
  },
  nitro: {
    prerender: {
      routes: ['/'],
      crawlLinks: true,
    },
  },
  compatibilityDate: '2024-11-01',
  future: {
    compatibilityVersion: 4,
  },
})
