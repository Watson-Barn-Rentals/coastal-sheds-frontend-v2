import {
	assertInventoryItem,
	assertPlaceholderInventoryItem,
	type InventoryItem,
	type PlaceholderInventoryItem,
} from '~/types/inventory-item'

type InventoryLiteListApiResponse = {
	full_items: { data: unknown[] }
	placeholders: { data: unknown[] }
}

export const getInventoryLiteList = async (): Promise<
	(PlaceholderInventoryItem | InventoryItem)[]
> => {
	const config = useRuntimeConfig()

	try {
		const response = await $fetch<InventoryLiteListApiResponse>(
			`${config.public.apiRootUrl}/api/list-inventory-lite`
		)

		const fullItemsUnknown = response?.full_items
		const placeholdersUnknown = response?.placeholders

		if (!Array.isArray(fullItemsUnknown) || !Array.isArray(placeholdersUnknown)) {
			console.error(
				'[getInventoryLiteList] Expected arrays at full_items.data and placeholders.data, received:',
				{
					full_items: response?.full_items,
					placeholders: response?.placeholders,
					raw: response,
				}
			)
			throw new Error('Invalid response from API: full_items.data/placeholders.data not arrays')
		}

		const fullItems: InventoryItem[] = []
		for (let i = 0; i < fullItemsUnknown.length; i++) {
			try {
				assertInventoryItem(fullItemsUnknown[i])
				fullItems.push(fullItemsUnknown[i] as InventoryItem)
			} catch (e: any) {
				const id = (fullItemsUnknown[i] as any)?.id ?? 'unknown'
				console.error(
					`[getInventoryLiteList] Validation failed for full_items at index ${i} (id: ${id}):`,
					e?.message ?? e,
					{ item: fullItemsUnknown[i] }
				)
				throw e
			}
		}

		const placeholders: PlaceholderInventoryItem[] = []
		for (let i = 0; i < placeholdersUnknown.length; i++) {
			try {
				assertPlaceholderInventoryItem(placeholdersUnknown[i])
				placeholders.push(placeholdersUnknown[i] as PlaceholderInventoryItem)
			} catch (e: any) {
				const serial = (placeholdersUnknown[i] as any)?.serialNumber ?? 'unknown'
				console.error(
					`[getInventoryLiteList] Validation failed for placeholders at index ${i} (serial: ${serial}):`,
					e?.message ?? e,
					{ item: placeholdersUnknown[i] }
				)
				throw e
			}
		}

		return [...fullItems, ...placeholders]
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
