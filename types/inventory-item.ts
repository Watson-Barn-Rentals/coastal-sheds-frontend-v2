// types/inventory-item.ts
import { z } from 'zod'
import { ImageMediaItemSchema, type ImageMediaItem } from './image-media-item'
import { LocationItemSchema, type LocationItem } from './location-item'
import { ProductItemSchema, type ProductItem } from './product-item'

export interface PlaceholderInventoryItem {
  serialNumber: string
  size: string | null
  title: string
  heroBase64svg: string | null
}

export interface InventoryColorEntry {
  colorType: string
  colorName: string
}

// Use an interface to allow self-reference in the type.
export interface InventoryItem {
  heroImage: ImageMediaItem
  additionalImages: ImageMediaItem[]
  serialNumber: string
  lotNumber: string | null
  location: LocationItem
  product: ProductItem
  size: string | null
  usedBuilding: boolean
  cashPrice: number
  discountAmount: number | null
  colors: InventoryColorEntry[]
  description: string
  highlightedLabel: string | null
  highlightedDescription: string | null
  designerLink: string | null
  similarItems?: InventoryItem[]
}

export const PlaceholderInventoryItemSchema: z.ZodType<PlaceholderInventoryItem> = z.object({
  serialNumber: z.string(),
  size: z.string().nullable(),
  title: z.string(),
  heroBase64svg: z.string().nullable(),
})

export const InventoryItemSchema: z.ZodType<InventoryItem> = z.lazy(() =>
  z
    .object({
      heroImage: ImageMediaItemSchema,
      additionalImages: z.array(ImageMediaItemSchema),
      serialNumber: z.string(),
      lotNumber: z.string().nullable(),
      location: LocationItemSchema,
      product: ProductItemSchema,
      size: z.string().nullable(),
      usedBuilding: z.boolean(),
      cashPrice: z.number().finite(),
      discountAmount: z.number().finite().nullable(),
      colors: z.array(
        z.object({
          colorType: z.string(),
          colorName: z.string(),
        })
      ),
      description: z.string(),
      highlightedLabel: z.string().nullable(),
      highlightedDescription: z.string().nullable(),
      designerLink: z.string().nullable(),
      similarItems: z.array(InventoryItemSchema).optional(), // recursive
    })
    .strict()
)

export const isPlaceholderInventoryItem = (x: unknown): x is PlaceholderInventoryItem =>
  PlaceholderInventoryItemSchema.safeParse(x).success

// Boolean guard (same API name)
export const isInventoryItem = (x: unknown): x is InventoryItem =>
  InventoryItemSchema.safeParse(x).success

export function assertPlaceholderInventoryItem(x: unknown): asserts x is PlaceholderInventoryItem {
  const r = PlaceholderInventoryItemSchema.safeParse(x)
  if (!r.success) {
    const details = r.error.issues
      .map(i => `• ${i.path.join('.') || '(root)'}: ${i.message}`)
      .join('\n')
    throw new Error(`PlaceholderInventoryItem validation failed:\n${details}`)
  }
}

// Optional: assertion with readable errors
export function assertInventoryItem(x: unknown): asserts x is InventoryItem {
  const r = InventoryItemSchema.safeParse(x)
  if (!r.success) {
    const details = r.error.issues
      .map(i => `• ${i.path.join('.') || '(root)'}: ${i.message}`)
      .join('\n')
    throw new Error(`InventoryItem validation failed:\n${details}`)
  }
}
