// types/product-item.ts
import { z } from 'zod'

export const ReviewRequestChannelItemSchema = z.object({
  id: z.number().int().nonnegative(),
  logoUrl: z.string().url(),
  reviewUrl: z.string().url(),
}).strict()

export type ReviewRequestChannelItem = z.infer<typeof ReviewRequestChannelItemSchema>

// Boolean guard (same API name)
export const isReviewRequestChannelItem = (x: unknown): x is ReviewRequestChannelItem =>
  ReviewRequestChannelItemSchema.safeParse(x).success

// Optional: assertion with readable errors
export function assertReviewRequestChannelItem(x: unknown): asserts x is ReviewRequestChannelItem {
  const r = ReviewRequestChannelItemSchema.safeParse(x)
  if (!r.success) {
    const details = r.error.issues
      .map(i => `• ${i.path.join('.') || '(root)'}: ${i.message}`)
      .join('\n')
    throw new Error(`ReviewRequestChannelItem validation failed:\n${details}`)
  }
}
