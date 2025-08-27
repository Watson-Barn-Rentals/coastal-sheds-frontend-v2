import { isInventoryItem, type InventoryItem } from "~/types/inventory-item"

export const getInventoryItem = async (serialNumber: string): Promise<InventoryItem> => {
	const config = useRuntimeConfig()

	try {
		let { data } = await $fetch<{ data: unknown }>(`${config.public.apiRootUrl}/api/inventory/${serialNumber}`)

		if (!isInventoryItem(data)) {
			throw new Error('Invalid inventory item data')
		}

		return data
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
		  (statusCode === 404 ? 'Inventory item not found' : 'An error occurred while fetching inventory item with serial number: ' + serialNumber)

		throw createError({ statusCode, statusMessage })
	}
}
