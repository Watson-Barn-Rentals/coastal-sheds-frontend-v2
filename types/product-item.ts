// types/product-item.ts
import { z } from 'zod'
import { ImageMediaItemSchema, type ImageMediaItem } from './image-media-item'

export const ProductItemSchema = z.object({
  heroImage: ImageMediaItemSchema,
  additionalImages: z.array(ImageMediaItemSchema),
  slug: z.string(),
  title: z.string(),
  short_description: z.string(),
  long_description: z.string(),
  override_page_url: z.string().nullable(),
  designer_link: z.string().nullable(),
  starting_price: z.string().nullable(),
  product_line_slug: z.string(),
  product_line_title: z.string(),
  product_line_discontinued: z.boolean(),
  product_category_slug: z.string(),
  product_category_title: z.string(),
  product_category_discontinued: z.boolean(),
  discontinued: z.boolean(),
}).strict()

export type ProductItem = z.infer<typeof ProductItemSchema>

// Boolean guard (same API name)
export const isProductItem = (x: unknown): x is ProductItem =>
  ProductItemSchema.safeParse(x).success

// Optional: assertion with readable errors
export function assertProductItem(x: unknown): asserts x is ProductItem {
  const r = ProductItemSchema.safeParse(x)
  if (!r.success) {
    const details = r.error.issues
      .map(i => `• ${i.path.join('.') || '(root)'}: ${i.message}`)
      .join('\n')
    throw new Error(`ProductItem validation failed:\n${details}`)
  }
}
