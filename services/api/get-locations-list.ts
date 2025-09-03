import { assertLocationItem, type LocationItem } from '~/types/location-item'

export const getLocationsList = async (): Promise<LocationItem[]> => {
  const config = useRuntimeConfig()

  try {
    const { data } = await $fetch<{ data: unknown }>(
      `${config.public.apiRootUrl}/api/list-locations`
    )

    if (!Array.isArray(data)) {
      console.error('[getLocationsList] Expected array, received:', typeof data, { data })
      throw new Error('Invalid response from API: data is not an array')
    }

    // Validate each location with assert + logging
    for (let i = 0; i < data.length; i++) {
      try {
        assertLocationItem(data[i])
      } catch (e: any) {
        const slug = (data[i] as any)?.slug ?? 'unknown'
        console.error(
          `[getLocationsList] Validation failed for item at index ${i} (slug: ${slug}):`,
          e?.message ?? e,
          { item: data[i] }
        )
        throw e
      }
    }

    return data as LocationItem[]
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
      `An error occurred while fetching location list`

    throw createError({ statusCode, statusMessage })
  }
}
