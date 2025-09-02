import { z } from 'zod'
import { CustomCssStylingSchema, type CustomCssStyling } from '~/types/custom-css-styling'
import { ImageMediaItemSchema, type ImageMediaItem } from '~/types/image-media-item'

export const IMAGE_CAROUSEL_COLUMN_SECTION_TYPE = 'image-carousel-column-section' as const

export const ImageCarouselColumnSectionDataSchema = z.object({
  images: z.array(ImageMediaItemSchema),
  showThumbnails: z.boolean(),
  marginTop: z.string(),
  marginBottom: z.string(),
  marginLeft: z.string(),
  marginRight: z.string(),
  customImageStyling: CustomCssStylingSchema,
}).strict()

export type ImageCarouselColumnSectionData = z.infer<typeof ImageCarouselColumnSectionDataSchema>

export const ImageCarouselColumnSectionSchema = z.object({
  type: z.literal(IMAGE_CAROUSEL_COLUMN_SECTION_TYPE),
  mobileOrder: z.number().nullable(),
  mobileOnly: z.boolean(),
  spaceAfter: z.string(),
  data: ImageCarouselColumnSectionDataSchema,
}).strict()

export type ImageCarouselColumnSection = z.infer<typeof ImageCarouselColumnSectionSchema>

// Boolean guard (keeps existing API name)
export const isImageCarouselColumnSection = (x: unknown): x is ImageCarouselColumnSection =>
  ImageCarouselColumnSectionSchema.safeParse(x).success

// Optional: assertion with readable error output
export function assertImageCarouselColumnSection(x: unknown): asserts x is ImageCarouselColumnSection {
  const r = ImageCarouselColumnSectionSchema.safeParse(x)
  if (!r.success) {
    const details = r.error.issues.map(i => `• ${i.path.join('.') || '(root)'}: ${i.message}`).join('\n')
    throw new Error(`ImageCarouselColumnSection validation failed:\n${details}`)
  }
}

