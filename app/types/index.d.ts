import type { ParsedContent } from '@nuxt/content'

export interface BlogPost extends ParsedContent {
  title: string
  description: string
  date: string
  image: HTMLImageElement
  tags: string[]
}
