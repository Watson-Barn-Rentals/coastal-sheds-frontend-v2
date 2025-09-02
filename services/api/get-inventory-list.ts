import { assertInventoryItem, type InventoryItem } from '~/types/inventory-item'

export const getInventoryList = async (): Promise<InventoryItem[]> => {
  const config = useRuntimeConfig()

  try {
    const { data } = await $fetch<{ data: unknown }>(
      `${config.public.apiRootUrl}/api/list-inventory`
    )

    if (!Array.isArray(data)) {
      console.error('[getInventoryList] Expected array, received:', typeof data, { data })
      throw new Error('Invalid response from API: data is not an array')
    }

    // Validate each item with assertions + logging
    for (let i = 0; i < data.length; i++) {
      try {
        assertInventoryItem(data[i])
      } catch (e: any) {
        const serial = (data[i] as any)?.serialNumber ?? 'unknown'
        console.error(
          `[getInventoryList] Validation failed for item at index ${i} (serial: ${serial}):`,
          e?.message ?? e,
          { item: data[i] }
        )
        throw e
      }
    }

    return data as InventoryItem[]
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
      'An error occurred while fetching inventory items list'

    throw createError({ statusCode, statusMessage })
  }
}
