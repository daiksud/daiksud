<script setup lang="ts">
const page = await queryCollection('blog').first()

const route = useRoute()
const { data: posts } = await useAsyncData(route.path, () => {
  return queryCollection('posts').order('date', 'DESC').all()
})

useSeoMeta({
  title: page.title,
  ogTitle: page.title,
  description: page.description,
  ogDescription: page.description
})
</script>

<template>
  <UContainer>
    <UPageHeader
      v-bind="page"
      class="py-[50px]"
    />

    <UPageBody>
      <UBlogPosts>
        <UBlogPost
          v-for="(post, index) in posts"
          :key="index"
          :to="post.path"
          :title="post.title"
          :description="post.description"
          :image="post.image"
          :date="new Date(post.date).toLocaleDateString('en', { year: 'numeric', month: 'short', day: 'numeric' })"
          :badge="post.tags?.join(', ')"
          :orientation="index === 0 ? 'horizontal' : 'vertical'"
          :class="[index === 0 && 'col-span-full']"
          variant="naked"
          :ui="{ description: 'line-clamp-2', badge: 'capitalize' }"
        />
      </UBlogPosts>
    </UPageBody>
  </UContainer>
</template>
