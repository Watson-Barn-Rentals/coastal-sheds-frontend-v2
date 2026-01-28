// types/location-item.ts
import { z } from 'zod'
import { ImageMediaItemSchema } from './image-media-item'
import { IdeasGalleryTagSchema } from './ideas-gallery-tag'

export const IdeasGalleryEntrySchema = z.object({
  image: ImageMediaItemSchema,
  title: z.string(),
  tags: z.array(IdeasGalleryTagSchema),
  description: z.string().nullable(),
  designer_link: z.string().nullable(),
}).strict()

export type IdeasGalleryEntry = z.infer<typeof IdeasGalleryEntrySchema>

// Boolean guard (keeps the same API name)
export const isIdeasGalleryEntry = (x: unknown): x is IdeasGalleryEntry =>
  IdeasGalleryEntrySchema.safeParse(x).success
// Optional: assertion with readable errors
export function assertIdeasGalleryEntry(x: unknown): asserts x is IdeasGalleryEntry {
  const r = IdeasGalleryEntrySchema.safeParse(x)
  if (!r.success) {
    const details = r.error.issues
      .map(i => `• ${i.path.join('.') || '(root)'}: ${i.message}`)
      .join('\n')
    throw new Error(`IdeasGalleryEntry validation failed:\n${details}`)
  }
}
