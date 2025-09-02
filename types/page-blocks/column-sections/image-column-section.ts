import { z } from 'zod'
import { CustomCssStylingSchema, type CustomCssStyling } from '~/types/custom-css-styling'
import { ImageMediaItemSchema, type ImageMediaItem } from '~/types/image-media-item'

export const IMAGE_COLUMN_SECTION_TYPE = 'image-column-section' as const

export const ImageColumnSectionDataSchema = z.object({
  image: ImageMediaItemSchema,
  disableImagePlaceholder: z.boolean(),
  marginTop: z.string(),
  marginBottom: z.string(),
  marginLeft: z.string(),
  marginRight: z.string(),
  imageRotation: z.string(),
  customImageStyling: CustomCssStylingSchema,
}).strict()

export type ImageColumnSectionData = z.infer<typeof ImageColumnSectionDataSchema>

export const ImageColumnSectionSchema = z.object({
  type: z.literal(IMAGE_COLUMN_SECTION_TYPE),
  mobileOrder: z.number().nullable(),
  mobileOnly: z.boolean(),
  spaceAfter: z.string(),
  data: ImageColumnSectionDataSchema,
}).strict()

export type ImageColumnSection = z.infer<typeof ImageColumnSectionSchema>

// Boolean guard (same API name)
export const isImageColumnSection = (x: unknown): x is ImageColumnSection =>
  ImageColumnSectionSchema.safeParse(x).success

// Optional: assertion with helpful error details
export function assertImageColumnSection(x: unknown): asserts x is ImageColumnSection {
  const r = ImageColumnSectionSchema.safeParse(x)
  if (!r.success) {
    const details = r.error.issues
      .map(i => `• ${i.path.join('.') || '(root)'}: ${i.message}`)
      .join('\n')
    throw new Error(`ImageColumnSection validation failed:\n${details}`)
  }
}
