import { isProductLineItem, type ProductLineItem } from "~/types/product-line-item"

export const getProductLinesList = async (productCategorySlug: string): Promise<ProductLineItem[]> => {
	const config = useRuntimeConfig()

	try {
		let { data } = await $fetch<{ data: unknown }>(`${config.public.apiRootUrl}/api/list-product-lines/${productCategorySlug}`)
		
		
		if (!Array.isArray(data) || !data.every(isProductLineItem)) {
			throw new Error('Invalid product lines data')
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
		  'An error occurred while fetching product lines for product category: ' + productCategorySlug

		throw createError({ statusCode, statusMessage })
	}
}
