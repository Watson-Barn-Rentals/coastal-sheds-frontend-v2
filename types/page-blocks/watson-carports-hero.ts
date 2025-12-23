import { z } from 'zod'
import { ImageMediaItemSchema, type ImageMediaItem } from '../image-media-item'
import { CustomCssStylingSchema } from '../custom-css-styling'

export const WATSON_CARPORTS_HERO_BLOCK_TYPE = 'watson-carports-hero' as const

export const SlideSchema = z.object({
  image: ImageMediaItemSchema,
  title: z.string(),
  subtitle: z.string(),
  slideDurationSeconds: z.number().min(1),
}).strict()

export const WatsonCarportsHeroBlockDataSchema = z.object({
  logo: ImageMediaItemSchema,
  slides: z.array(SlideSchema),
}).strict()

export type WatsonCarportsHeroBlockData = z.infer<typeof WatsonCarportsHeroBlockDataSchema>

export const WatsonCarportsHeroBlockSchema = z.object({
  type: z.literal(WATSON_CARPORTS_HERO_BLOCK_TYPE),
  spaceAfter: z.string(),
  data: WatsonCarportsHeroBlockDataSchema,
}).strict()

export type WatsonCarportsHeroBlock = z.infer<typeof WatsonCarportsHeroBlockSchema>

// Boolean guard (same API name)
export const isWatsonCarportsHeroBlock = (x: unknown): x is WatsonCarportsHeroBlock =>
  WatsonCarportsHeroBlockSchema.safeParse(x).success
// Optional: assertion with readable error details
export function assertWatsonCarportsHeroBlock(x: unknown): asserts x is WatsonCarportsHeroBlock {
  const r = WatsonCarportsHeroBlockSchema.safeParse(x)
  if (!r.success) {
    const details = r.error.issues
      .map(i => `• ${i.path.join('.') || '(root)'}: ${i.message}`)
      .join('\n')
    throw new Error(`WatsonCarportsHeroBlock validation failed:\n${details}`)
  }
}
