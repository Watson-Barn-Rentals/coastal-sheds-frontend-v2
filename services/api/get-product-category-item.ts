import { assertProductCategoryItem, type ProductCategoryItem } from '~/types/product-category-item'

export const getProductCategoryItem = async (slug: string): Promise<ProductCategoryItem> => {
  const config = useRuntimeConfig()

  try {
    const { data } = await $fetch<{ data: unknown }>(
      `${config.public.apiRootUrl}/api/product-categories/${encodeURIComponent(slug)}`
    )

    // Assert with error logging
    try {
      assertProductCategoryItem(data)
    } catch (e: any) {
      console.error(`[getProductCategoryItem] Validation failed for slug "${slug}":`, e?.message ?? e, {
        data,
      })
      throw e
    }

    return data as ProductCategoryItem
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
      (err?.statusCode === 404
        ? 'Product category not found'
        : `An error occurred while fetching product category with slug: ${slug}`)

    throw createError({ statusCode, statusMessage })
  }
}
