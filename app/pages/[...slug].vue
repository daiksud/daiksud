<script setup lang="ts">
const route = useRoute()

const { data: page } = await useAsyncData('page' + route.path, () => {
  return queryCollection('pages').path(route.path).first()
})

if (!page.value) {
  throw createError({
    statusCode: 404,
    statusMessage: 'Page not found',
    fatal: true,
  })
}

useSeoMeta({
  title: page.value?.title,
  description: page.value?.description,
})
</script>

<template>
  <UContainer class="py-8">
    <template v-if="page">
      <h1 class="text-3xl font-bold border-b mb-4">{{ page.title }}</h1>
      <ContentRenderer :value="page" />
    </template>
  </UContainer>
</template>
