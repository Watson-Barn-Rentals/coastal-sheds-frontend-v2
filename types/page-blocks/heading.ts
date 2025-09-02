// types/blocks/heading.ts
import { z } from 'zod'
import { CustomCssStylingSchema, type CustomCssStyling } from '../custom-css-styling'

export const HEADING_BLOCK_TYPE = 'heading' as const

export const HeadingBlockDataSchema = z.object({
  content: z.string(),
  headingTextSize: z.string(),
  headingFont: z.string(),
  headingTextColor: z.string(),
  headingLevel: z.enum(['h1', 'h2', 'h3', 'p']),
  textAlignment: z.enum(['left', 'center']),
  topMargin: z.string(),
  customTextStyling: CustomCssStylingSchema,
}).strict()

export type HeadingBlockData = z.infer<typeof HeadingBlockDataSchema>

export const HeadingBlockSchema = z.object({
  type: z.literal(HEADING_BLOCK_TYPE),
  spaceAfter: z.string(),
  data: HeadingBlockDataSchema,
}).strict()

export type HeadingBlock = z.infer<typeof HeadingBlockSchema>

// Boolean guard (preserves existing API)
export const isHeadingBlock = (x: unknown): x is HeadingBlock =>
  HeadingBlockSchema.safeParse(x).success

// Optional: assertion with readable error output
export function assertHeadingBlock(x: unknown): asserts x is HeadingBlock {
  const r = HeadingBlockSchema.safeParse(x)
  if (!r.success) {
    const details = r.error.issues
      .map(i => `• ${i.path.join('.') || '(root)'}: ${i.message}`)
      .join('\n')
    throw new Error(`HeadingBlock validation failed:\n${details}`)
  }
}
