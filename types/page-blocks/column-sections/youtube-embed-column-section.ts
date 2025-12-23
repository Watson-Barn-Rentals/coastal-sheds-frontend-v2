import { z } from 'zod'

export const YOUTUBE_EMBED_COLUMN_SECTION_TYPE = 'youtube-embed-column-section' as const

export const YoutubeEmbedColumnSectionDataSchema = z.object({
  youtubeVideoId: z.string(), // optionally: .regex(/^[\w-]{11}$/)
  marginTop: z.string(),
  marginBottom: z.string(),
  marginLeft: z.string(),
  marginRight: z.string(),
  aspectRatio: z.string(),
  trackingEventName: z.string(),
}).strict()

export type YoutubeEmbedColumnSectionData = z.infer<typeof YoutubeEmbedColumnSectionDataSchema>

export const YoutubeEmbedColumnSectionSchema = z.object({
  type: z.literal(YOUTUBE_EMBED_COLUMN_SECTION_TYPE),
  mobileOrder: z.number().nullable(),
  mobileOnly: z.boolean(),
  spaceAfter: z.string(),
  data: YoutubeEmbedColumnSectionDataSchema,
}).strict()

export type YoutubeEmbedColumnSection = z.infer<typeof YoutubeEmbedColumnSectionSchema>

// Boolean guard (same API name)
export const isYoutubeEmbedColumnSection = (x: unknown): x is YoutubeEmbedColumnSection =>
  YoutubeEmbedColumnSectionSchema.safeParse(x).success

// Optional: assertion with readable error details
export function assertYoutubeEmbedColumnSection(x: unknown): asserts x is YoutubeEmbedColumnSection {
  const r = YoutubeEmbedColumnSectionSchema.safeParse(x)
  if (!r.success) {
    const details = r.error.issues
      .map(i => `• ${i.path.join('.') || '(root)'}: ${i.message}`)
      .join('\n')
    throw new Error(`YoutubeEmbedColumnSection validation failed:\n${details}`)
  }
}
