import { isProductCategoryItem, type ProductCategoryItem } from "~/types/product-category-item"

export const getProductCategoriesList = async (): Promise<ProductCategoryItem[]> => {
	const config = useRuntimeConfig()

	try {
		let { data } = await $fetch<{ data: unknown }>(`${config.public.apiRootUrl}/api/list-product-categories`)
		
		
		if (!Array.isArray(data) || !data.every(isProductCategoryItem)) {
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
		  'An error occurred while fetching product categories list'

		throw createError({ statusCode, statusMessage })
	}
}
