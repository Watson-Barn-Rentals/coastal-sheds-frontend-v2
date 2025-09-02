import { z } from 'zod'

export const SPACER_COLUMN_SECTION_TYPE = 'spacer-column-section' as const

export const SpacerColumnSectionDataSchema = z.object({
  height: z.string(),
}).strict()

export type SpacerColumnSectionData = z.infer<typeof SpacerColumnSectionDataSchema>

export const SpacerColumnSectionSchema = z.object({
  type: z.literal(SPACER_COLUMN_SECTION_TYPE),
  mobileOrder: z.number().nullable(),
  mobileOnly: z.boolean(),
  spaceAfter: z.string(),
  data: SpacerColumnSectionDataSchema,
}).strict()

export type SpacerColumnSection = z.infer<typeof SpacerColumnSectionSchema>

// Boolean guard (keeps the same API name)
export const isSpacerColumnSection = (x: unknown): x is SpacerColumnSection =>
  SpacerColumnSectionSchema.safeParse(x).success

// Optional: assertion with readable error output
export function assertSpacerColumnSection(x: unknown): asserts x is SpacerColumnSection {
  const r = SpacerColumnSectionSchema.safeParse(x)
  if (!r.success) {
    const details = r.error.issues
      .map(i => `• ${i.path.join('.') || '(root)'}: ${i.message}`)
      .join('\n')
    throw new Error(`SpacerColumnSection validation failed:\n${details}`)
  }
}
