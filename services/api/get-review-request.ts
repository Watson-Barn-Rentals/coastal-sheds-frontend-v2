import { assertReviewRequestItem, type ReviewRequestItem } from '~/types/review-request-item'

export const getReviewRequest = async (slug: string): Promise<ReviewRequestItem> => {
  const config = useRuntimeConfig()

  try {
    const { data } = await $fetch<{ data: unknown }>(
      `${config.public.apiRootUrl}/api/review-requests/${encodeURIComponent(slug)}`
    )

    // Assert with error logging
    try {
      assertReviewRequestItem(data)
    } catch (e: any) {
      console.error(`[getReviewRequest] Validation failed for slug "${slug}":`, e?.message ?? e, {
        data,
      })
      throw e
    }

    return data as ReviewRequestItem
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
        ? 'Review request not found'
        : `An error occurred while fetching review request with slug: ${slug}`)

    throw createError({ statusCode, statusMessage })
  }
}
