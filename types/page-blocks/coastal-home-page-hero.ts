import { z } from 'zod'
import { ImageMediaItemSchema, type ImageMediaItem } from '../image-media-item'

export const COASTAL_HOME_PAGE_HERO_BLOCK_TYPE = 'coastal-home-page-hero' as const

export const CoastalHomePageHeroBlockDataSchema = z.object({
  backgroundImage: ImageMediaItemSchema,
  logoImage: ImageMediaItemSchema,
  title: z.string(),
  logoTopOffset: z.string(),
}).strict()

export type CoastalHomePageHeroBlockData = z.infer<typeof CoastalHomePageHeroBlockDataSchema>

export const CoastalHomePageHeroBlockSchema = z.object({
  type: z.literal(COASTAL_HOME_PAGE_HERO_BLOCK_TYPE),
  spaceAfter: z.string(),
  data: CoastalHomePageHeroBlockDataSchema,
}).strict()

export type CoastalHomePageHeroBlock = z.infer<typeof CoastalHomePageHeroBlockSchema>

// Boolean guard (same API name)
export const isCoastalHomePageHeroBlock = (x: unknown): x is CoastalHomePageHeroBlock =>
  CoastalHomePageHeroBlockSchema.safeParse(x).success

// Optional: assertion with readable error details
export function assertCoastalHomePageHeroBlock(x: unknown): asserts x is CoastalHomePageHeroBlock {
  const r = CoastalHomePageHeroBlockSchema.safeParse(x)
  if (!r.success) {
    const details = r.error.issues
      .map(i => `• ${i.path.join('.') || '(root)'}: ${i.message}`)
      .join('\n')
    throw new Error(`CoastalHomePageHeroBlock validation failed:\n${details}`)
  }
}
