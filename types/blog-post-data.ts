// types/blog-post-data.ts
import { z } from 'zod'
import { ImageMediaItemSchema, type ImageMediaItem } from './image-media-item'
import { PageBlockSchema } from './page-blocks'

// Use an interface to avoid TS2456 cycles and give the lazy schema a concrete target type.
export interface BlogPostData {
  heroImage: ImageMediaItem | null
  slug: string
  title: string
  short_description: string
  published_at: string
  updated_at: string
  // Inline type import avoids tightening the cycle at the top level
  blocks: import('./page-blocks').PageBlock[]
  relatedBlogPosts?: BlogPostData[]
}

export const BlogPostDataSchema: z.ZodType<BlogPostData> = z.lazy(() =>
  z
    .object({
      heroImage: ImageMediaItemSchema.nullable(),
      slug: z.string(),
      title: z.string(),
      short_description: z.string(),
      published_at: z.string(),
      updated_at: z.string(),
      blocks: z.array(PageBlockSchema),
      relatedBlogPosts: z.array(BlogPostDataSchema).optional(),
    })
    .strict()
)

// Boolean guard (preserves existing API)
export function isBlogPostData(obj: unknown): obj is BlogPostData {
  return BlogPostDataSchema.safeParse(obj).success
}

// Optional: assertion with readable errors
export function assertBlogPostData(obj: unknown): asserts obj is BlogPostData {
  const r = BlogPostDataSchema.safeParse(obj)
  if (!r.success) {
    const details = r.error.issues
      .map(i => `• ${i.path.join('.') || '(root)'}: ${i.message}`)
      .join('\n')
    throw new Error(`BlogPostData validation failed:\n${details}`)
  }
}
