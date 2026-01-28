// types/location-item.ts
import { z } from 'zod'

export const IdeasGalleryTagSchema = z.object({
  slug: z.string(),
  title: z.string(),
}).strict()

export type IdeasGalleryTag = z.infer<typeof IdeasGalleryTagSchema>

// Boolean guard (keeps the same API name)
export const isIdeasGalleryTag = (x: unknown): x is IdeasGalleryTag =>
  IdeasGalleryTagSchema.safeParse(x).success

// Optional: assertion with readable errors
export function assertIdeasGalleryTag(x: unknown): asserts x is IdeasGalleryTag {
  const r = IdeasGalleryTagSchema.safeParse(x)
  if (!r.success) {
    const details = r.error.issues
      .map(i => `• ${i.path.join('.') || '(root)'}: ${i.message}`)
      .join('\n')
    throw new Error(`IdeasGalleryTag validation failed:\n${details}`)
  }
}
