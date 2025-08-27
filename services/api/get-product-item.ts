import { isProductItem, type ProductItem } from "~/types/product-item"

export const getProductItem = async (slug: string): Promise<ProductItem> => {
	const config = useRuntimeConfig()

	try {
		let { data } = await $fetch<{ data: unknown }>(`${config.public.apiRootUrl}/api/products/${slug}`)

		if (!isProductItem(data)) {
			throw new Error('Invalid product item data')
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
		  (statusCode === 404 ? 'Product not found' : 'An error occurred while fetching product with slug: ' + slug)

		throw createError({ statusCode, statusMessage })
	}
}
