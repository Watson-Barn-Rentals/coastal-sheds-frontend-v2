// types/product-item.ts
import { z } from 'zod'
import { ReviewRequestChannelItemSchema } from './review-request-channel-item'

export const ReviewRequestTemplateItemSchema = z.object({
  requestMessage: z.string(),
  channels: z.array(ReviewRequestChannelItemSchema),
}).strict()

export type ReviewRequestTemplateItem = z.infer<typeof ReviewRequestTemplateItemSchema>

// Boolean guard (same API name)
export const isReviewRequestTemplateItem = (x: unknown): x is ReviewRequestTemplateItem =>
  ReviewRequestTemplateItemSchema.safeParse(x).success

// Optional: assertion with readable errors
export function assertReviewRequestTemplateItem(x: unknown): asserts x is ReviewRequestTemplateItem {
  const r = ReviewRequestTemplateItemSchema.safeParse(x)
  if (!r.success) {
    const details = r.error.issues
      .map(i => `• ${i.path.join('.') || '(root)'}: ${i.message}`)
      .join('\n')
    throw new Error(`ReviewRequestTemplateItem validation failed:\n${details}`)
  }
}
