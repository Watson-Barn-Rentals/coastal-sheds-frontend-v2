import { z } from 'zod'

export const TESTIMONIALS_SECTION_BLOCK_TYPE = 'testimonials-section' as const

// Single testimonial
export const TestimonialSchema = z.object({
  authorsName: z.string(),
  date: z.string().nullable().optional(),
  text: z.string(),
  source: z.string(),
  starRating: z.string(), // e.g., 0–5; add .min(0).max(5) if you want bounds
}).strict()
export type Testimonial = z.infer<typeof TestimonialSchema>

export const TestimonialsSectionBlockDataSchema = z.object({
  heading: z.string(),
  averageRating: z.string(),
  totalReviewsCount: z.string(),
  testimonials: z.array(TestimonialSchema),
}).strict()
export type TestimonialsSectionBlockData = z.infer<typeof TestimonialsSectionBlockDataSchema>

export const TestimonialsSectionBlockSchema = z.object({
  type: z.literal(TESTIMONIALS_SECTION_BLOCK_TYPE),
  spaceAfter: z.string(),
  data: TestimonialsSectionBlockDataSchema,
}).strict()
export type TestimonialsSectionBlock = z.infer<typeof TestimonialsSectionBlockSchema>

// Boolean guard (same API name)
export const isTestimonialsSectionBlock = (x: unknown): x is TestimonialsSectionBlock =>
  TestimonialsSectionBlockSchema.safeParse(x).success

// Optional: assertion with readable errors
export function assertTestimonialsSectionBlock(x: unknown): asserts x is TestimonialsSectionBlock {
  const r = TestimonialsSectionBlockSchema.safeParse(x)
  if (!r.success) {
    const details = r.error.issues
      .map(i => `• ${i.path.join('.') || '(root)'}: ${i.message}`)
      .join('\n')
    throw new Error(`TestimonialsSectionBlock validation failed:\n${details}`)
  }
}
