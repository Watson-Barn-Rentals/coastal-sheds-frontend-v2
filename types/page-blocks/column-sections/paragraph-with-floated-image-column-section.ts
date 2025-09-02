import { z } from 'zod'
import { CustomCssStylingSchema, type CustomCssStyling } from '~/types/custom-css-styling'
import { ImageMediaItemSchema, type ImageMediaItem } from '~/types/image-media-item'

export const PARAGRAPH_WITH_FLOATED_IMAGE_COLUMN_SECTION_TYPE =
  'paragraph-with-floated-image-column-section' as const

export const ParagraphWithFloatedImageColumnSectionDataSchema = z.object({
  text: z.string(),
  image: ImageMediaItemSchema,
  disableImagePlaceholder: z.boolean(),
  imagePosition: z.enum(['left', 'right']),
  imageWidth: z.string(),
  marginTop: z.string(),
  marginBottom: z.string(),
  marginLeft: z.string(),
  marginRight: z.string(),
  imageRotation: z.string(),
  customImageStyling: CustomCssStylingSchema,
}).strict()

export type ParagraphWithFloatedImageColumnSectionData =
  z.infer<typeof ParagraphWithFloatedImageColumnSectionDataSchema>

export const ParagraphWithFloatedImageColumnSectionSchema = z.object({
  type: z.literal(PARAGRAPH_WITH_FLOATED_IMAGE_COLUMN_SECTION_TYPE),
  mobileOrder: z.number().nullable(),
  mobileOnly: z.boolean(),
  spaceAfter: z.string(),
  data: ParagraphWithFloatedImageColumnSectionDataSchema,
}).strict()

export type ParagraphWithFloatedImageColumnSection =
  z.infer<typeof ParagraphWithFloatedImageColumnSectionSchema>

// Boolean guard (same API name)
export const isParagraphWithFloatedImageColumnSection = (
  x: unknown
): x is ParagraphWithFloatedImageColumnSection =>
  ParagraphWithFloatedImageColumnSectionSchema.safeParse(x).success

// Optional: assertion with readable errors
export function assertParagraphWithFloatedImageColumnSection(
  x: unknown
): asserts x is ParagraphWithFloatedImageColumnSection {
  const r = ParagraphWithFloatedImageColumnSectionSchema.safeParse(x)
  if (!r.success) {
    const msg = r.error.issues
      .map(i => `• ${i.path.join('.') || '(root)'}: ${i.message}`)
      .join('\n')
    throw new Error(`ParagraphWithFloatedImageColumnSection validation failed:\n${msg}`)
  }
}
