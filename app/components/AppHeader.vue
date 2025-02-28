<script setup lang="ts">
const items = computed(() => [{
  label: 'Blog',
  icon: 'fa6-solid:blog',
  to: '/blog'
}])
</script>

<template>
  <UHeader>
    <template #left>
      <NuxtLink to="/">daiksud</NuxtLink>
    </template>

    <template #right>
      <UNavigationMenu
        :items="items"
        variant="link"
      />
      <UContentSearchButton />
      <UButton
        to="https://github.com/daiksud"
        target="_blank"
        icon="i-simple-icons-github"
        aria-label="GitHub"
        color="neutral"
        variant="ghost"
      />
    </template>

    <template #body>
      <UNavigationMenu
        :items="items"
        orientation="vertical"
        class="-mx-2.5"
      />
    </template>
  </UHeader>
</template>
