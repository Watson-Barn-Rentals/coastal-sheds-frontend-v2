import { z } from 'zod'
import { PageBlockSchema, type PageBlock } from './page-blocks'

export const PageDataSchema = z.object({
  url: z.string(),
  title: z.string(),
  short_description: z.string(),
  blocks: z.array(PageBlockSchema),
}).strict()

export type PageData = z.infer<typeof PageDataSchema>

// Boolean guard (same API name)
export function isPageData(obj: unknown): obj is PageData {
  return PageDataSchema.safeParse(obj).success
}

// Optional: assertion with readable errors
export function assertPageData(obj: unknown): asserts obj is PageData {
  const r = PageDataSchema.safeParse(obj)
  if (!r.success) {
    const details = r.error.issues
      .map(i => `• ${i.path.join('.') || '(root)'}: ${i.message}`)
      .join('\n')
    throw new Error(`PageData validation failed:\n${details}`)
  }
}
