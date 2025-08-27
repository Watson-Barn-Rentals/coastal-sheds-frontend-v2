import { isProductLineItem, type ProductLineItem } from "~/types/product-line-item"

export const getProductLineItem = async (slug: string): Promise<ProductLineItem> => {
	const config = useRuntimeConfig()

	try {
		let { data } = await $fetch<{ data: unknown }>(`${config.public.apiRootUrl}/api/product-lines/${slug}`)

		if (!isProductLineItem(data)) {
			throw new Error('Invalid product line data')
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
		  (statusCode === 404 ? 'Product line not found' : 'An error occurred while fetching product line with slug: ' + slug)

		throw createError({ statusCode, statusMessage })
	}
}
