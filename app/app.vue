<script setup lang="ts">
const colorMode = useColorMode()
const img = useImage()
const siteConfig = useSiteConfig()

const color = computed(() => (colorMode.value === 'dark' ? '#111827' : 'white'))

useHead({
  meta: [
    { charset: 'utf-8' },
    { name: 'viewport', content: 'width=device-width, initial-scale=1' },
    { key: 'theme-color', name: 'theme-color', content: color },
  ],
  link: [{ rel: 'icon', href: '/favicon.svg' }],
  htmlAttrs: {
    lang: 'en',
  },
})

const ogImage = `${siteConfig.url}${img('/main.jpg', { format: 'webp', quality: 80, width: 1200, height: 600 })}`

useSeoMeta({
  titleTemplate: '%s - daiksud',
  ogImage,
  twitterImage: ogImage,
  twitterCard: 'summary_large_image',
})

const { data: navigation } = await useAsyncData(
  'navigation',
  () => queryCollectionNavigation('posts'),
  {
    transform: (data) =>
      data.find((item) => item.path === '/blog')?.children || [],
  },
)
const { data: files } = useLazyAsyncData(
  'search',
  () => queryCollectionSearchSections('posts'),
  {
    server: false,
  },
)

const links = [
  {
    label: 'Blog',
    icon: 'fa6-solid:blog',
    to: '/blog',
  },
]

provide('navigation', navigation)
</script>

<template>
  <UApp>
    <NuxtRouteAnnouncer />
    <NuxtLoadingIndicator />

    <NuxtLayout>
      <NuxtPage />
    </NuxtLayout>

    <ClientOnly>
      <LazyUContentSearch
        :files="files"
        shortcut="meta_k"
        :navigation="navigation"
        :links="links"
        :fuse="{ resultLimit: 42 }"
      />
    </ClientOnly>
  </UApp>
</template>
