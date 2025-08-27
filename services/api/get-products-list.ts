import { isProductItem, type ProductItem } from "~/types/product-item"

export const getProductsList = async (productLineSlug: string): Promise<ProductItem[]> => {
	const config = useRuntimeConfig()

	try {
		let { data } = await $fetch<{ data: unknown }>(`${config.public.apiRootUrl}/api/list-products/${productLineSlug}`)


		if (!Array.isArray(data) || !data.every(isProductItem)) {
			throw new Error('Invalid product items data')
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
		  'An error occurred while fetching product items for product line: ' + productLineSlug

		throw createError({ statusCode, statusMessage })
	}
}
