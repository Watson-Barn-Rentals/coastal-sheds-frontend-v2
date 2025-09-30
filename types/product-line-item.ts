// types/product-line-item.ts
import { z } from 'zod'
import { ImageMediaItemSchema, type ImageMediaItem } from './image-media-item'
import { ProductItemSchema, type ProductItem } from './product-item'

export const ProductLineItemSchema = z.object({
  heroImage: ImageMediaItemSchema,
  additionalImages: z.array(ImageMediaItemSchema),
  slug: z.string(),
  title: z.string(),
  short_description: z.string(),
  long_description: z.string(),
  override_page_url: z.string().nullable(),
  products: z.array(ProductItemSchema),
  product_category_slug: z.string(),
  product_category_title: z.string(),
  product_category_discontinued: z.boolean(),
  discontinued: z.boolean(),
}).strict()

export type ProductLineItem = z.infer<typeof ProductLineItemSchema>

// Boolean guard (same API name)
export const isProductLineItem = (x: unknown): x is ProductLineItem =>
  ProductLineItemSchema.safeParse(x).success

// Optional: assertion with readable errors
export function assertProductLineItem(x: unknown): asserts x is ProductLineItem {
  const r = ProductLineItemSchema.safeParse(x)
  if (!r.success) {
    const details = r.error.issues
      .map(i => `• ${i.path.join('.') || '(root)'}: ${i.message}`)
      .join('\n')
    throw new Error(`ProductLineItem validation failed:\n${details}`)
  }
}
