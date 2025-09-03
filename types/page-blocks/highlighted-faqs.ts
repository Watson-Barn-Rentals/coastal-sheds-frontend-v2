import { z } from 'zod'
import { FaqSchema } from '../faq-data'

export const HIGHLIGHTED_FAQS_BLOCK_TYPE = 'highlighted-faqs' as const

export const HighlightedFaqsDataSchema = z.object({
  faqs: z.array(FaqSchema),
}).strict()
export type HighlightedFaqsData = z.infer<typeof HighlightedFaqsDataSchema>

export const HighlightedFaqsBlockSchema = z.object({
  type: z.literal(HIGHLIGHTED_FAQS_BLOCK_TYPE),
  spaceAfter: z.string(),
  data: HighlightedFaqsDataSchema,
}).strict()
export type HighlightedFaqsBlock = z.infer<typeof HighlightedFaqsBlockSchema>

// Boolean guard
export const isHighlightedFaqsBlock = (x: unknown): x is HighlightedFaqsBlock =>
  HighlightedFaqsBlockSchema.safeParse(x).success

// Assertion with readable errors
export function assertHighlightedFaqsBlock(x: unknown): asserts x is HighlightedFaqsBlock {
  const r = HighlightedFaqsBlockSchema.safeParse(x)
  if (!r.success) {
    const msg = r.error.issues.map(i => `• ${i.path.join('.') || '(root)'}: ${i.message}`).join('\n')
    throw new Error(`HighlightedFaqsBlock validation failed:\n${msg}`)
  }
}
