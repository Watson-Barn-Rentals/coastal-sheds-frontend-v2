import { z } from 'zod'

export const REVIEWS_SECTION_BLOCK_TYPE = 'reviews-section' as const

// Single testimonial
export const ReviewSchema = z.object({
  authorsName: z.string(),
  text: z.string(),
  source: z.string(),
  starRating: z.string(), // e.g., 0–5; add .min(0).max(5) if you want bounds
}).strict()
export type Review = z.infer<typeof ReviewSchema>

export const ReviewsSectionBlockDataSchema = z.object({
  autoAdvanceIntervalMs: z.number().int().nonnegative(),
  transitionSpeedMs: z.number().int().nonnegative(),
  scrollSpeedMs: z.number().int().nonnegative(),
  mobileVersionBreakpoint: z.string(),
  cardPadding: z.string(),
  cardBackgroundColor: z.string(),
  cardBackgroundColorDark: z.string(),
  cardBorderColor: z.string(),
  cardBorderColorDark: z.string(),
  cardBorderThickness: z.string(),
  cardBorderRadius: z.string(),
  cardTextFontFamily: z.string(),
  cardTextColor: z.string(),
  cardTextColorDark: z.string(),
  authorsNameFontSize: z.string(),
  reviewTextFontSize: z.string(),
  mobileCardWidth: z.string(),
  mobileCardHeight: z.string(),
  mobileTopOffset: z.string(),
  mobileCardOverlap: z.string(),
  mobileSideCardOpacity: z.number().min(0).max(1),
  mobileSideCardScale: z.number().min(0).max(1),
  mobileReviewTextLinesLimit: z.number().int().nonnegative(),
  desktopCardWidth: z.string(),
  desktopCardHeight: z.string(),
  desktopTopOffset: z.string(),
  desktopCardOverlap: z.string(),
  desktopSideCardOpacity: z.number().min(0).max(1),
  desktopSideCardScale: z.number().min(0).max(1),
  desktopReviewTextLinesLimit: z.number().int().nonnegative(),
  reviews: z.array(ReviewSchema),
}).strict()
export type ReviewsSectionBlockData = z.infer<typeof ReviewsSectionBlockDataSchema>

export const ReviewsSectionBlockSchema = z.object({
  type: z.literal(REVIEWS_SECTION_BLOCK_TYPE),
  spaceAfter: z.string(),
  data: ReviewsSectionBlockDataSchema,
}).strict()
export type ReviewsSectionBlock = z.infer<typeof ReviewsSectionBlockSchema>
// Boolean guard (same API name)
export const isReviewsSectionBlock = (x: unknown): x is ReviewsSectionBlock =>
  ReviewsSectionBlockSchema.safeParse(x).success

// Optional: assertion with readable errors
export function assertReviewsSectionBlock(x: unknown): asserts x is ReviewsSectionBlock {
  const r = ReviewsSectionBlockSchema.safeParse(x)
  if (!r.success) {
    const details = r.error.issues
      .map(i => `• ${i.path.join('.') || '(root)'}: ${i.message}`)
      .join('\n')
    throw new Error(`ReviewsSectionBlock validation failed:\n${details}`)
  }
}
