import { assertIdeasGalleryEntry, type IdeasGalleryEntry } from '~/types/ideas-gallery-entry'

export const getIdeasGalleryEntriesList = async (): Promise<IdeasGalleryEntry[]> => {
  const config = useRuntimeConfig()

  try {
    const { data } = await $fetch<{ data: unknown }>(
      `${config.public.apiRootUrl}/api/list-ideas-gallery-entries`
    )

    if (!Array.isArray(data)) {
      console.error('[getIdeasGalleryEntriesList] Expected array, received:', typeof data, { data })
      throw new Error('Invalid response from API: data is not an array')
    }

    // Validate each category with assertions + logging
    for (let i = 0; i < data.length; i++) {
      try {
        assertIdeasGalleryEntry(data[i])
      } catch (e: any) {
        console.error(
          `[getIdeasGalleryEntriesList] Validation failed for item at index ${i}:`,
          e?.message ?? e,
          { item: data[i] }
        )
        throw e
      }
    }

    return data as IdeasGalleryEntry[]
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
      'An error occurred while fetching ideas gallery entries list'

    throw createError({ statusCode, statusMessage })
  }
}
