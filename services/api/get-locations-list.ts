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
    console.error('[getLocationsList] Request failed:', err?.message ?? err)
    await navigateTo('/error')
    throw new Error('An error occurred while fetching location items')
  }
}
