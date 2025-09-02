import { assertProductItem, type ProductItem } from '~/types/product-item'

export const getProductItem = async (slug: string): Promise<ProductItem> => {
  const config = useRuntimeConfig()

  try {
    const { data } = await $fetch<{ data: unknown }>(
      `${config.public.apiRootUrl}/api/products/${encodeURIComponent(slug)}`
    )

    // Assert with error logging
    try {
      assertProductItem(data)
    } catch (e: any) {
      console.error(`[getProductItem] Validation failed for slug "${slug}":`, e?.message ?? e, {
        data,
      })
      throw e
    }

    return data as ProductItem
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
      (statusCode === 404
        ? 'Product not found'
        : `An error occurred while fetching product with slug: ${slug}`)

    throw createError({ statusCode, statusMessage })
  }
}
