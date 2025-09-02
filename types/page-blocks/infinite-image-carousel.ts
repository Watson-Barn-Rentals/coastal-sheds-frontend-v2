import { z } from 'zod'
import { ImageMediaItemSchema, type ImageMediaItem } from '../image-media-item'

export const INFINITE_IMAGE_CAROUSEL_BLOCK_TYPE = 'infinite-image-carousel' as const

export const InfiniteImageCarouselBlockDataSchema = z.object({
  images: z.array(ImageMediaItemSchema),
  loopTimeInSeconds: z.number().finite(),
  maxImageRotation: z.string(),
}).strict()

export type InfiniteImageCarouselBlockData = z.infer<typeof InfiniteImageCarouselBlockDataSchema>

export const InfiniteImageCarouselBlockSchema = z.object({
  type: z.literal(INFINITE_IMAGE_CAROUSEL_BLOCK_TYPE),
  spaceAfter: z.string(),
  data: InfiniteImageCarouselBlockDataSchema,
}).strict()

export type InfiniteImageCarouselBlock = z.infer<typeof InfiniteImageCarouselBlockSchema>

// Boolean guard (same API name)
export const isInfiniteImageCarouselBlock = (x: unknown): x is InfiniteImageCarouselBlock =>
  InfiniteImageCarouselBlockSchema.safeParse(x).success

// Optional: assertion with readable error details
export function assertInfiniteImageCarouselBlock(x: unknown): asserts x is InfiniteImageCarouselBlock {
  const r = InfiniteImageCarouselBlockSchema.safeParse(x)
  if (!r.success) {
    const details = r.error.issues
      .map(i => `• ${i.path.join('.') || '(root)'}: ${i.message}`)
      .join('\n')
    throw new Error(`InfiniteImageCarouselBlock validation failed:\n${details}`)
  }
}
