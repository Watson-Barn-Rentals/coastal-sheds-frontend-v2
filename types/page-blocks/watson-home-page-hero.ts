import { z } from 'zod'
import { ImageMediaItemSchema, type ImageMediaItem } from '../image-media-item'
import { CustomCssStylingSchema } from '../custom-css-styling'

export const WATSON_HOME_PAGE_HERO_BLOCK_TYPE = 'watson-home-page-hero' as const

export const SlideSchema = z.object({
  image: ImageMediaItemSchema,
  title: z.string(),
  centerPointX: z.number().min(0).max(100),
  centerPointY: z.number().min(0).max(100),
  slideDurationSeconds: z.number().min(1),
}).strict()

export const ButtonDataSchema = z.object({
  destination: z.string(), // keep as string since it may be a route, not a full URL
  label: z.string(),
  iconPresets: z.enum(['custom-icon', 'animated-right-side-arrow']),
  iconName: z.string().nullable(),
  customIconStyling: CustomCssStylingSchema,
  buttonStyling: z.string(),
  trackingEventName: z.string(),
}).strict()
export type LinkButtonData = z.infer<typeof ButtonDataSchema>

export const WatsonHomePageHeroBlockDataSchema = z.object({
  slides: z.array(SlideSchema),
  titleLetterSpeedMilliseconds: z.number().min(0),
  buttonSpacing: z.enum(['center', 'space-between', 'space-around']),
  buttons: z.array(ButtonDataSchema),
}).strict()

export type WatsonHomePageHeroBlockData = z.infer<typeof WatsonHomePageHeroBlockDataSchema>

export const WatsonHomePageHeroBlockSchema = z.object({
  type: z.literal(WATSON_HOME_PAGE_HERO_BLOCK_TYPE),
  spaceAfter: z.string(),
  data: WatsonHomePageHeroBlockDataSchema,
}).strict()

export type WatsonHomePageHeroBlock = z.infer<typeof WatsonHomePageHeroBlockSchema>

// Boolean guard (same API name)
export const isWatsonHomePageHeroBlock = (x: unknown): x is WatsonHomePageHeroBlock =>
  WatsonHomePageHeroBlockSchema.safeParse(x).success

// Optional: assertion with readable error details
export function assertWatsonHomePageHeroBlock(x: unknown): asserts x is WatsonHomePageHeroBlock {
  const r = WatsonHomePageHeroBlockSchema.safeParse(x)
  if (!r.success) {
    const details = r.error.issues
      .map(i => `• ${i.path.join('.') || '(root)'}: ${i.message}`)
      .join('\n')
    throw new Error(`WatsonHomePageHeroBlock validation failed:\n${details}`)
  }
}
