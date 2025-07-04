// @ts-check
import sitemap from '@astrojs/sitemap'
import tailwindcss from '@tailwindcss/vite'
import { defineConfig } from 'astro/config'

// https://astro.build/config
export default defineConfig({
  site: 'https://daiksud.com',
  integrations: [sitemap()],
  prefetch: true,
  trailingSlash: 'always',
  image: {
    domains: ['github.com'],
  },
  vite: {
    plugins: [tailwindcss()],
  },
})
