// types/region-item.ts
import { z } from 'zod'

export const RegionItemSchema = z.object({
  slug: z.string(),
  title: z.string(),
  zipCodes: z.array(z.string()),
}).strict()

export type RegionItem = z.infer<typeof RegionItemSchema>

// Boolean guard (same API name)
export const isRegionItem = (x: unknown): x is RegionItem =>
  RegionItemSchema.safeParse(x).success

// Optional: assertion with readable errors
export function assertRegionItem(x: unknown): asserts x is RegionItem {
  const r = RegionItemSchema.safeParse(x)
  if (!r.success) {
    const details = r.error.issues
      .map(i => `• ${i.path.join('.') || '(root)'}: ${i.message}`)
      .join('\n')
    throw new Error(`RegionItem validation failed:\n${details}`)
  }
}
