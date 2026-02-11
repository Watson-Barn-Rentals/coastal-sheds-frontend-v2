import { assertInventoryItem, type InventoryItem } from '~/types/inventory-item'

export const getFullInventoryList = async (): Promise<InventoryItem[]> => {
  const config = useRuntimeConfig()

  const res = await $fetch(`${config.public.apiRootUrl}/api/list-inventory`)
  const data = (res as any).data

  if (!Array.isArray(data)) {
    console.error('[getFullInventoryList] Expected array, received:', typeof data, res)
    throw new Error('Invalid response from API: data is not an array')
  }

  for (let i = 0; i < data.length; i++) {
    try {
      assertInventoryItem(data[i])
    } catch (e: any) {
      const serial = (data[i] as any)?.serialNumber ?? 'unknown'
      console.error(
        `[getFullInventoryList] Validation failed for item at index ${i} (serial: ${serial}):`,
        e?.message ?? e,
        { item: data[i] }
      )
      throw e
    }
  }

  return data
}
