import { z } from 'zod'
import { CustomCssStylingSchema, type CustomCssStyling } from '~/types/custom-css-styling'

export const PARAGRAPH_COLUMN_SECTION_TYPE = 'paragraph-column-section' as const

export const ParagraphColumnSectionDataSchema = z.object({
  text: z.string(),
  bodyTextColor: z.string(),
  bodyTextSize: z.string(),
  bodyFont: z.string(),
  bodyCustomStyling: CustomCssStylingSchema,
  textAlignment: z.enum(['center', 'left']),
}).strict()

export type ParagraphColumnSectionData = z.infer<typeof ParagraphColumnSectionDataSchema>

export const ParagraphColumnSectionSchema = z.object({
  type: z.literal(PARAGRAPH_COLUMN_SECTION_TYPE),
  mobileOrder: z.number().nullable(),
  mobileOnly: z.boolean(),
  spaceAfter: z.string(),
  data: ParagraphColumnSectionDataSchema,
}).strict()

export type ParagraphColumnSection = z.infer<typeof ParagraphColumnSectionSchema>

// Boolean guard (same API name)
export const isParagraphColumnSection = (x: unknown): x is ParagraphColumnSection =>
  ParagraphColumnSectionSchema.safeParse(x).success

// Optional: assertion with readable error details
export function assertParagraphColumnSection(x: unknown): asserts x is ParagraphColumnSection {
  const r = ParagraphColumnSectionSchema.safeParse(x)
  if (!r.success) {
    const details = r.error.issues
      .map(i => `• ${i.path.join('.') || '(root)'}: ${i.message}`)
      .join('\n')
    throw new Error(`ParagraphColumnSection validation failed:\n${details}`)
  }
}
