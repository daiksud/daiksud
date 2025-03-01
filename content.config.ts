import { defineCollection, z } from '@nuxt/content'

const variantEnum = z.enum(['solid', 'outline', 'subtle', 'soft', 'ghost', 'link'])
const colorEnum = z.enum(['primary', 'secondary', 'neutral', 'error', 'warning', 'success', 'info'])
const sizeEnum = z.enum(['xs', 'sm', 'md', 'lg', 'xl'])

const baseSchema = z.object({
  title: z.string().nonempty(),
  description: z.string().nonempty()
})

const imageSchema = z.object({
  src: z.string().nonempty(),
  alt: z.string().optional()
})

const linkSchema = z.object({
  label: z.string().nonempty(),
  to: z.string().nonempty(),
  icon: z.string().optional(),
  size: sizeEnum.optional(),
  trailing: z.boolean().optional(),
  target: z.string().optional(),
  color: colorEnum.optional(),
  variant: variantEnum.optional()
})

export const collections = {
  index: defineCollection({
    source: 'index.yml',
    type: 'data',
    schema: baseSchema.extend({
      hero: baseSchema.extend({
        links: z.array(linkSchema)
      })
    })
  }),
  blog: defineCollection({
    source: 'blog.yml',
    type: 'data',
    schema: baseSchema
  }),
  posts: defineCollection({
    type: 'page',
    source: 'blog/**/*',
    schema: baseSchema.extend({
      image: imageSchema,
      date: z.string().nonempty(),
      tags: z.array(z.string().nonempty())
    })
  })
}
