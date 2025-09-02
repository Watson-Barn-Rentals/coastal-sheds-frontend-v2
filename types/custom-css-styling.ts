import { z } from 'zod'

export const CustomCssStylingSchema = z.object({
  classNames: z.array(z.string()),
  css: z.string(),
}).strict() // switch to .passthrough() if you want to allow extra keys

export type CustomCssStyling = z.infer<typeof CustomCssStylingSchema>

// Boolean type guard (same name as before)
export const isCustomCssStyling = (x: unknown): x is CustomCssStyling =>
  CustomCssStylingSchema.safeParse(x).success

// (Optional) assert-style helper with detailed errors
export function assertCustomCssStyling(x: unknown): asserts x is CustomCssStyling {
  const r = CustomCssStylingSchema.safeParse(x)
  if (!r.success) {
    const details = r.error.issues
      .map(i => `• ${i.path.join('.') || '(root)'}: ${i.message}`)
      .join('\n')
    throw new Error(`CustomCssStyling validation failed:\n${details}`)
  }
}
