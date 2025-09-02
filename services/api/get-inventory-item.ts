import { assertInventoryItem, type InventoryItem } from '~/types/inventory-item'

export const getInventoryItem = async (serialNumber: string): Promise<InventoryItem> => {
  const config = useRuntimeConfig()

  try {
    const { data } = await $fetch<{ data: unknown }>(
      `${config.public.apiRootUrl}/api/inventory/${encodeURIComponent(serialNumber)}`
    )

    // Assert with error logging
    try {
      assertInventoryItem(data)
    } catch (e: any) {
      console.error(`[getInventoryItem] Validation failed for serial "${serialNumber}":`, e?.message ?? e, {
        data,
      })
      throw e
    }

    return data as InventoryItem
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
        ? 'Inventory item not found'
        : `An error occurred while fetching inventory item with serial number: ${serialNumber}`)

    throw createError({ statusCode, statusMessage })
  }
}
