// types/location-item.ts
import { z } from 'zod'

export const FaqSchema = z.object({
  question: z.string(),
  answer: z.string(),
}).strict()

export type FaqItem = z.infer<typeof FaqSchema>

// Boolean guard (keeps the same API name)
export const isFaqItem = (x: unknown): x is FaqItem =>
  FaqSchema.safeParse(x).success

// Optional: assertion with readable errors
export function assertFaqItem(x: unknown): asserts x is FaqItem {
  const r = FaqSchema.safeParse(x)
  if (!r.success) {
    const details = r.error.issues
      .map(i => `• ${i.path.join('.') || '(root)'}: ${i.message}`)
      .join('\n')
    throw new Error(`FaqItem validation failed:\n${details}`)
  }
}
