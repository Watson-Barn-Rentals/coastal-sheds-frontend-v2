import { isInventoryItem, type InventoryItem } from "~/types/inventory-item"

export const getInventoryList = async (): Promise<InventoryItem[]> => {
	const config = useRuntimeConfig()

	try {
		let { data } = await $fetch<{ data: unknown }>(`${config.public.apiRootUrl}/api/list-inventory`)

		if (!Array.isArray(data) || !data.every(isInventoryItem)) {
			throw new Error('Invalid inventory items data')
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
		  'An error occurred while fetching inventory items list'

		throw createError({ statusCode, statusMessage })
	}
}
