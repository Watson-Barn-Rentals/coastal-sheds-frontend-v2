import { assertLocationsMapSettings, normalizeLocationsMapSettings, type LocationsMapSettings } from '~/types/locations-map-settings'

export const getLocationsMapSettings = async (): Promise<LocationsMapSettings> => {
  const config = useRuntimeConfig()

  try {
    const { data } = await $fetch<{ data: unknown }>(
      `${config.public.apiRootUrl}/api/get-locations-map-settings`
    )

    const normalized = normalizeLocationsMapSettings(data)

    // Assert with error logging
    try {
      assertLocationsMapSettings(normalized)
    } catch (e: any) {
      console.error('[getLocationsMapSettings] Validation failed:', e?.message ?? e, {
        normalized,
      })
      throw e
    }

    return normalized as LocationsMapSettings
  } catch (err: any) {
    const statusCode =
      err?.response?.status ??
      err?.statusCode ??
      err?.status ??
      err?.data?.statusCode ??
      500

    const statusMessage =
      err?.data?.message ??
      err?.message ??
      'An error occurred while fetching locations map settings'

    throw createError({ statusCode, statusMessage })
  }
}
