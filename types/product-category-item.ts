// types/product-category-item.ts
import { z } from 'zod'
import { ImageMediaItemSchema, type ImageMediaItem } from './image-media-item'
import { ProductLineItemSchema, type ProductLineItem } from './product-line-item'

export const ProductCategoryItemSchema = z.object({
  heroImage: ImageMediaItemSchema,
  additionalImages: z.array(ImageMediaItemSchema),
  slug: z.string(),
  title: z.string(),
  short_description: z.string(),
  long_description: z.string(),
  override_page_url: z.string().nullable(),
  product_lines: z.array(ProductLineItemSchema),
  discontinued: z.boolean(),
}).strict()

export type ProductCategoryItem = z.infer<typeof ProductCategoryItemSchema>

// Boolean guard (same API name)
export const isProductCategoryItem = (x: unknown): x is ProductCategoryItem =>
  ProductCategoryItemSchema.safeParse(x).success

// Optional: assertion with readable errors
export function assertProductCategoryItem(x: unknown): asserts x is ProductCategoryItem {
  const r = ProductCategoryItemSchema.safeParse(x)
  if (!r.success) {
    const details = r.error.issues
      .map(i => `• ${i.path.join('.') || '(root)'}: ${i.message}`)
      .join('\n')
    throw new Error(`ProductCategoryItem validation failed:\n${details}`)
  }
}
