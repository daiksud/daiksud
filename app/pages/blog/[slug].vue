<script setup lang="ts">
const route = useRoute()

const { data: post } = await useAsyncData(route.path, () => {
  return queryCollection('posts').path(route.path).first()
})

const { data: surround } = await useAsyncData(`${route.path}-surround`, () => {
  return queryCollectionItemSurroundings('posts', route.path, {
    fields: ['description']
  })
})

const links = post.value.tags?.map(tag => ({
  label: tag,
  to: `/blog/tag/${tag}`
}))

const title = post.value.title
const description = post.value.description

useSeoMeta({
  title,
  ogTitle: title,
  description,
  ogDescription: description
})

defineOgImage({
  url: post.value.image.src
})
</script>

<template>
  <UContainer v-if="post">
    <UPage>
      <UPageHeader
        :title="post.title"
        :description="post.description"
        :headline="new Date(post.date).toLocaleDateString('en', { year: 'numeric', month: 'short', day: 'numeric' })"
        :links="links"
        :ui="{ links: 'capitalize' }"
      />
      <UPageBody>
        <ContentRenderer
          v-if="post"
          :value="post"
        />

        <USeparator v-if="surround?.length" />

        <UContentSurround :surround="surround" />
      </UPageBody>

      <template
        v-if="post?.body?.toc?.links?.length"
        #right
      >
        <UContentToc :links="post.body.toc.links" />
      </template>
    </UPage>
  </UContainer>
</template>
