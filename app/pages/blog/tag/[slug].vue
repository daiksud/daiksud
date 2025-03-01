<script setup lang="ts">
const route = useRoute()
const tag = route.params.slug

const { data: posts } = await useAsyncData(route.path, () => {
  return queryCollection('posts').where('tags', 'LIKE', `%${tag}%`).order('date', 'DESC').all()
})

const title = `Articles tagged ${tag}`

useSeoMeta({
  title,
  ogTitle: title
})
</script>

<template>
  <UContainer>
    <UPageHeader
      :title="title"
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
