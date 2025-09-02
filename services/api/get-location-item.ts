import { assertLocationItem, type LocationItem } from '~/types/location-item'

export const getLocationItem = async (slug: string): Promise<LocationItem> => {
  const config = useRuntimeConfig()

  try {
    const { data } = await $fetch<{ data: unknown }>(
      `${config.public.apiRootUrl}/api/locations/${encodeURIComponent(slug)}`
    )

    // Assert with error logging
    try {
      assertLocationItem(data)
    } catch (e: any) {
      console.error(`[getLocationItem] Validation failed for slug "${slug}":`, e?.message ?? e, {
        data,
      })
      throw e
    }

    return data as LocationItem
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
      (statusCode === 404
        ? 'Location not found'
        : `An error occurred while fetching location with slug: ${slug}`)

    throw createError({ statusCode, statusMessage })
  }
}
