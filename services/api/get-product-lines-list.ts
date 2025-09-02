import { assertProductLineItem, type ProductLineItem } from '~/types/product-line-item'

export const getProductLinesList = async (productCategorySlug: string): Promise<ProductLineItem[]> => {
  const config = useRuntimeConfig()

  try {
    const { data } = await $fetch<{ data: unknown }>(
      `${config.public.apiRootUrl}/api/list-product-lines/${encodeURIComponent(productCategorySlug)}`
    )

    if (!Array.isArray(data)) {
      console.error('[getProductLinesList] Expected array, received:', typeof data, { data })
      throw new Error('Invalid response from API: data is not an array')
    }

    for (let i = 0; i < data.length; i++) {
      try {
        assertProductLineItem(data[i])
      } catch (e: any) {
        const slug = (data[i] as any)?.slug ?? 'unknown'
        console.error(
          `[getProductLinesList] Validation failed for item at index ${i} (slug: ${slug}) in category "${productCategorySlug}":`,
          e?.message ?? e,
          { item: data[i] }
        )
        throw e
      }
    }

    return data as ProductLineItem[]
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
      `An error occurred while fetching product lines for product category: ${productCategorySlug}`

    throw createError({ statusCode, statusMessage })
  }
}
