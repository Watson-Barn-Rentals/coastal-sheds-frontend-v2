import { isProductCategoryItem, type ProductCategoryItem } from "~/types/product-category-item"

export const getProductCategoryItem = async (slug: string): Promise<ProductCategoryItem> => {
	const config = useRuntimeConfig()

	try {
		let { data } = await $fetch<{ data: unknown }>(`${config.public.apiRootUrl}/api/product-categories/${slug}`)
		
		
		if (!isProductCategoryItem(data)) {
			throw new Error('Invalid product categories data')
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
		  (err?.statusCode === 404 ? 'Product category not found' : 'An error occurred while fetching product category with slug: ' + slug)

		throw createError({ statusCode, statusMessage })
	}
}
