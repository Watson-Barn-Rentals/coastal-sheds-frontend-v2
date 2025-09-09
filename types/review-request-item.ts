// types/product-item.ts
import { z } from 'zod'
import { ReviewRequestTemplateItemSchema } from './review-request-template-item'

export const ReviewRequestItemSchema = z.object({
  slug: z.string(),
  template: ReviewRequestTemplateItemSchema,
}).strict()

export type ReviewRequestItem = z.infer<typeof ReviewRequestItemSchema>

// Boolean guard (same API name)
export const isReviewRequestItem = (x: unknown): x is ReviewRequestItem =>
  ReviewRequestItemSchema.safeParse(x).success

// Optional: assertion with readable errors
export function assertReviewRequestItem(x: unknown): asserts x is ReviewRequestItem {
  const r = ReviewRequestItemSchema.safeParse(x)
  if (!r.success) {
    const details = r.error.issues
      .map(i => `• ${i.path.join('.') || '(root)'}: ${i.message}`)
      .join('\n')
    throw new Error(`ReviewRequestItem validation failed:\n${details}`)
  }
}
