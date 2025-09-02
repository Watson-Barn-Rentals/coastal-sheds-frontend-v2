import { assertProductItem, type ProductItem } from '~/types/product-item'

export const getProductsList = async (productLineSlug: string): Promise<ProductItem[]> => {
  const config = useRuntimeConfig()

  try {
    const { data } = await $fetch<{ data: unknown }>(
      `${config.public.apiRootUrl}/api/list-products/${encodeURIComponent(productLineSlug)}`
    )

    if (!Array.isArray(data)) {
      console.error('[getProductsList] Expected array, received:', typeof data, { data })
      throw new Error('Invalid response from API: data is not an array')
    }

    // Validate each product with assertions + logging
    for (let i = 0; i < data.length; i++) {
      try {
        assertProductItem(data[i])
      } catch (e: any) {
        const slug = (data[i] as any)?.slug ?? 'unknown'
        console.error(
          `[getProductsList] Validation failed for item at index ${i} (slug: ${slug}) in product line "${productLineSlug}":`,
          e?.message ?? e,
          { item: data[i] }
        )
        throw e
      }
    }

    return data as ProductItem[]
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
      `An error occurred while fetching product items for product line: ${productLineSlug}`

    throw createError({ statusCode, statusMessage })
  }
}
