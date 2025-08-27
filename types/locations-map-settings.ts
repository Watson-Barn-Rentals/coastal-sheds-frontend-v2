export type LocationsMapSettings = {
  api_key: string
  center_latitude: number
  center_longitude: number
  zoom_level: number
}

export function normalizeLocationsMapSettings(data: unknown): unknown {
  if (typeof data === 'object' && data !== null) {
    const d = data as Record<string, unknown>
    d.center_latitude = Number(d.center_latitude)
    d.center_longitude = Number(d.center_longitude)
    d.zoom_level = Number(d.zoom_level)
  }
  return data
}

export function isLocationsMapSettings(data: unknown): data is LocationsMapSettings {
  if (typeof data !== 'object' || data === null) {
    return false
  }
  const d = data as Record<string, unknown>

  if (typeof d.api_key !== 'string') return false
  if (typeof d.center_latitude !== 'number' || isNaN(d.center_latitude)) return false
  if (typeof d.center_longitude !== 'number' || isNaN(d.center_longitude)) return false
  if (typeof d.zoom_level !== 'number' || isNaN(d.zoom_level)) return false

  return true
}
