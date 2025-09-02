import { z } from 'zod'
import { CustomCssStylingSchema, type CustomCssStyling } from '~/types/custom-css-styling'

export const HEADING_COLUMN_SECTION_TYPE = 'heading-column-section' as const

export const HeadingColumnSectionDataSchema = z.object({
  text: z.string(),
  headingFont: z.string(),
  headingTextSize: z.string(),
  headingTextColor: z.string(),
  headingLevel: z.enum(['h1', 'h2', 'h3', 'p']),
  textAlignment: z.enum(['center', 'left']),
  customTextStyling: CustomCssStylingSchema,
}).strict()

export type HeadingColumnSectionData = z.infer<typeof HeadingColumnSectionDataSchema>

export const HeadingColumnSectionSchema = z.object({
  type: z.literal(HEADING_COLUMN_SECTION_TYPE),
  mobileOrder: z.number().nullable(),
  mobileOnly: z.boolean(),
  spaceAfter: z.string(),
  data: HeadingColumnSectionDataSchema,
}).strict()

export type HeadingColumnSection = z.infer<typeof HeadingColumnSectionSchema>

// Boolean type guard (same name as before)
export const isHeadingColumnSection = (x: unknown): x is HeadingColumnSection =>
  HeadingColumnSectionSchema.safeParse(x).success

// (Optional) assertion with helpful error
export function assertHeadingColumnSection(x: unknown): asserts x is HeadingColumnSection {
  const r = HeadingColumnSectionSchema.safeParse(x)
  if (!r.success) {
    const details = r.error.issues.map(i => `• ${i.path.join('.') || '(root)'}: ${i.message}`).join('\n')
    throw new Error(`HeadingColumnSection validation failed:\n${details}`)
  }
}
