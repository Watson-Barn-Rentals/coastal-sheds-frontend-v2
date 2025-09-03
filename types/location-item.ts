// types/location-item.ts
import { z } from 'zod'
import { ImageMediaItemSchema, type ImageMediaItem } from './image-media-item'
import { RegionItemSchema, type RegionItem } from './region-item'
import { EmployeeItemSchema, type EmployeeItem } from './employee-item'

export const LocationItemSchema = z.object({
  heroImage: ImageMediaItemSchema,
  slug: z.string(),
  title: z.string(),
  shortDescription: z.string(),
  longDescription: z.string(),
  address: z.string(),
  city: z.string(),
  state: z.string(),
  zip: z.string(),
  latitude: z.string(),
  longitude: z.string(),
  phone: z.string().nullable(),
  email: z.string().nullable(),
  regions: z.array(RegionItemSchema),
  salesReps: z.array(EmployeeItemSchema),
  googleMapsEmbedUrl: z.string(),
  facebookPageUrl: z.string().nullable(),
  hours: z.record(z.string()), // adjust to z.record(z.unknown()) if values aren't always strings
}).strict()

export type LocationItem = z.infer<typeof LocationItemSchema>

// Boolean guard (keeps the same API name)
export const isLocationItem = (x: unknown): x is LocationItem =>
  LocationItemSchema.safeParse(x).success

// Optional: assertion with readable errors
export function assertLocationItem(x: unknown): asserts x is LocationItem {
  const r = LocationItemSchema.safeParse(x)
  if (!r.success) {
    const details = r.error.issues
      .map(i => `• ${i.path.join('.') || '(root)'}: ${i.message}`)
      .join('\n')
    throw new Error(`LocationItem validation failed:\n${details}`)
  }
}
