import { z } from 'zod'

export const LocationsMapSettingsSchema = z.object({
  api_key: z.string(),
  center_latitude: z.coerce.number().finite(),
  center_longitude: z.coerce.number().finite(),
  zoom_level: z.coerce.number().int(), // add .min(1).max(22) if you want bounds
}).strict()

export type LocationsMapSettings = z.infer<typeof LocationsMapSettingsSchema>

export function normalizeLocationsMapSettings(data: unknown): unknown {
  // Coerces strings -> numbers; returns original data on failure (matches your old behavior)
  const r = LocationsMapSettingsSchema.safeParse(data)
  return r.success ? r.data : data
}

export function isLocationsMapSettings(data: unknown): data is LocationsMapSettings {
  return LocationsMapSettingsSchema.safeParse(data).success
}

// Optional: assertion with readable error details
export function assertLocationsMapSettings(data: unknown): asserts data is LocationsMapSettings {
  const r = LocationsMapSettingsSchema.safeParse(data)
  if (!r.success) {
    const details = r.error.issues
      .map(i => `• ${i.path.join('.') || '(root)'}: ${i.message}`)
      .join('\n')
    throw new Error(`LocationsMapSettings validation failed:\n${details}`)
  }
}
