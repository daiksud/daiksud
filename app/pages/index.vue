<script setup lang="ts">
const page = await queryCollection('index').first()

useSeoMeta({
  titleTemplate: '',
  title: page.title,
  ogTitle: page.title,
  description: page.description,
  ogDescription: page.description
})
</script>

<template>
  <div v-if="page">
    <UPageHero
      :title="page.hero.title"
      :description="page.hero.description"
      :links="page.hero.links"
    >
      <template #top>
        <div class="absolute rounded-full dark:bg-(--ui-primary) blur-[300px] size-60 sm:size-80 transform -translate-x-1/2 left-1/2 -translate-y-80" />

        <StarsBg />
      </template>
    </UPageHero>
  </div>
</template>
