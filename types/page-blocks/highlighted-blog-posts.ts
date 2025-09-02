import { z } from 'zod'
import { BlogPostDataSchema, type BlogPostData } from '../blog-post-data'

export const HIGHLIGHTED_BLOG_POSTS_BLOCK_TYPE = 'highlighted-blog-posts' as const

export const HighlightedBlogPostsDataSchema = z.object({
  // ⬅ defer access to BlogPostDataSchema to break the cycle
  blogPosts: z.array(z.lazy(() => BlogPostDataSchema)),
}).strict()
export type HighlightedBlogPostsData = z.infer<typeof HighlightedBlogPostsDataSchema>

export const HighlightedBlogPostsBlockSchema = z.object({
  type: z.literal(HIGHLIGHTED_BLOG_POSTS_BLOCK_TYPE),
  spaceAfter: z.string(),
  data: HighlightedBlogPostsDataSchema,
}).strict()
export type HighlightedBlogPostsBlock = z.infer<typeof HighlightedBlogPostsBlockSchema>

// Boolean guard
export const isHighlightedBlogPostsBlock = (x: unknown): x is HighlightedBlogPostsBlock =>
  HighlightedBlogPostsBlockSchema.safeParse(x).success

// Assertion with readable errors
export function assertHighlightedBlogPostsBlock(x: unknown): asserts x is HighlightedBlogPostsBlock {
  const r = HighlightedBlogPostsBlockSchema.safeParse(x)
  if (!r.success) {
    const msg = r.error.issues.map(i => `• ${i.path.join('.') || '(root)'}: ${i.message}`).join('\n')
    throw new Error(`HighlightedBlogPostsBlock validation failed:\n${msg}`)
  }
}
