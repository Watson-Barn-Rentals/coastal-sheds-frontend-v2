import { z } from 'zod'
import { ProductItemSchema } from '../product-item'

export const HIGHLIGHTED_PRODUCTS_BLOCK_TYPE = 'highlighted-products' as const

export const HighlightedProductsDataSchema = z.object({
  products: z.array(z.lazy(() => ProductItemSchema)),
  clickableCards: z.boolean(),
  showStartingPrice: z.boolean(),
  show3dDesignLink: z.boolean(),
}).strict()
export type HighlightedProductsData = z.infer<typeof HighlightedProductsDataSchema>

export const HighlightedProductsBlockSchema = z.object({
  type: z.literal(HIGHLIGHTED_PRODUCTS_BLOCK_TYPE),
  spaceAfter: z.string(),
  data: HighlightedProductsDataSchema,
}).strict()
export type HighlightedProductsBlock = z.infer<typeof HighlightedProductsBlockSchema>

// Boolean guard
export const isHighlightedProductsBlock = (x: unknown): x is HighlightedProductsBlock =>
  HighlightedProductsBlockSchema.safeParse(x).success

// Assertion with readable errors
export function assertHighlightedProductsBlock(x: unknown): asserts x is HighlightedProductsBlock {
  const r = HighlightedProductsBlockSchema.safeParse(x)
  if (!r.success) {
    const msg = r.error.issues.map(i => `• ${i.path.join('.') || '(root)'}: ${i.message}`).join('\n')
    throw new Error(`HighlightedProductsBlock validation failed:\n${msg}`)
  }
}
