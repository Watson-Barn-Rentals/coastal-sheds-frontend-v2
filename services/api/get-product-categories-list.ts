import { assertProductCategoryItem, type ProductCategoryItem } from '~/types/product-category-item'

export const getProductCategoriesList = async (): Promise<ProductCategoryItem[]> => {
  const config = useRuntimeConfig()

  try {
    const { data } = await $fetch<{ data: unknown }>(
      `${config.public.apiRootUrl}/api/list-product-categories`
    )

    if (!Array.isArray(data)) {
      console.error('[getProductCategoriesList] Expected array, received:', typeof data, { data })
      throw new Error('Invalid response from API: data is not an array')
    }

    // Validate each category with assertions + logging
    for (let i = 0; i < data.length; i++) {
      try {
        assertProductCategoryItem(data[i])
      } catch (e: any) {
        const slug = (data[i] as any)?.slug ?? 'unknown'
        console.error(
          `[getProductCategoriesList] Validation failed for item at index ${i} (slug: ${slug}):`,
          e?.message ?? e,
          { item: data[i] }
        )
        throw e
      }
    }

    return data as ProductCategoryItem[]
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
