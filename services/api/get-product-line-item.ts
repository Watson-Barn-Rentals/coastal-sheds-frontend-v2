import { assertProductLineItem, type ProductLineItem } from '~/types/product-line-item'

export const getProductLineItem = async (slug: string): Promise<ProductLineItem> => {
  const config = useRuntimeConfig()

  try {
    const { data } = await $fetch<{ data: unknown }>(
      `${config.public.apiRootUrl}/api/product-lines/${encodeURIComponent(slug)}`
    )

    // Assert with error logging
    try {
      assertProductLineItem(data)
    } catch (e: any) {
      console.error(`[getProductLineItem] Validation failed for slug "${slug}":`, e?.message ?? e, {
        data,
      })
      throw e
    }

    return data as ProductLineItem
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
        ? 'Product line not found'
        : `An error occurred while fetching product line with slug: ${slug}`)

    throw createError({ statusCode, statusMessage })
  }
}
