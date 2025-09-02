// types/image-media-item.ts
import { z } from 'zod'

export const ImageMediaItemSchema = z.object({
  original_url: z.string(), // use .url() if you want strict URL validation
  srcset: z.string(),
  placeholder: z.string(),
  width: z.number().int().positive(),
  height: z.number().int().positive(),
  alt: z.string(),
}).strict()

export type ImageMediaItem = z.infer<typeof ImageMediaItemSchema>

// Boolean guard (keeps the same API name)
export const isImageMediaItem = (x: unknown): x is ImageMediaItem =>
  ImageMediaItemSchema.safeParse(x).success

// Optional: assertion with readable error output
export function assertImageMediaItem(x: unknown): asserts x is ImageMediaItem {
  const r = ImageMediaItemSchema.safeParse(x)
  if (!r.success) {
    const details = r.error.issues
      .map(i => `• ${i.path.join('.') || '(root)'}: ${i.message}`)
      .join('\n')
    throw new Error(`ImageMediaItem validation failed:\n${details}`)
  }
}
