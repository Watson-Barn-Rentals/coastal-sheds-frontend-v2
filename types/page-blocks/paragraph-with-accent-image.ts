import { z } from 'zod'
import { CustomCssStylingSchema, type CustomCssStyling } from '../custom-css-styling'
import { ImageMediaItemSchema, type ImageMediaItem } from '../image-media-item'

export const PARAGRAPH_WITH_ACCENT_IMAGE_BLOCK_TYPE = 'paragraph-with-accent-image' as const

export const ParagraphWithAccentImageBlockDataSchema = z.object({
  title: z.string().nullable(),
  titleTextSize: z.string(),
  titleFont: z.string(),
  titleTextColor: z.string(),
  titleCustomStyling: CustomCssStylingSchema,

  text: z.string(),
  bodyTextSize: z.string(),
  bodyFont: z.string(),
  bodyTextColor: z.string(),
  bodyCustomStyling: CustomCssStylingSchema,

  image: ImageMediaItemSchema,
  disableImagePlaceholder: z.boolean(),
  alignment: z.enum(['left', 'right']),
  imageWidth: z.string(),
  horizontalImageOffset: z.string(),
  verticalImageOffset: z.string(),
  imageRotation: z.string(),
  imagePadding: z.string(),
  customImageStyling: CustomCssStylingSchema,
}).strict()

export type ParagraphWithAccentImageBlockData = z.infer<typeof ParagraphWithAccentImageBlockDataSchema>

export const ParagraphWithAccentImageBlockSchema = z.object({
  type: z.literal(PARAGRAPH_WITH_ACCENT_IMAGE_BLOCK_TYPE),
  spaceAfter: z.string(),
  data: ParagraphWithAccentImageBlockDataSchema,
}).strict()

export type ParagraphWithAccentImageBlock = z.infer<typeof ParagraphWithAccentImageBlockSchema>

// Boolean guard (same API name)
export const isParagraphWithAccentImageBlock = (x: unknown): x is ParagraphWithAccentImageBlock =>
  ParagraphWithAccentImageBlockSchema.safeParse(x).success

// Optional: assertion with readable errors
export function assertParagraphWithAccentImageBlock(
  x: unknown
): asserts x is ParagraphWithAccentImageBlock {
  const r = ParagraphWithAccentImageBlockSchema.safeParse(x)
  if (!r.success) {
    const details = r.error.issues
      .map(i => `• ${i.path.join('.') || '(root)'}: ${i.message}`)
      .join('\n')
    throw new Error(`ParagraphWithAccentImageBlock validation failed:\n${details}`)
  }
}
