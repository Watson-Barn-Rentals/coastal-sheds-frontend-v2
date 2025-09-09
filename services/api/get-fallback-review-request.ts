import { assertReviewRequestTemplateItem, type ReviewRequestTemplateItem } from '~/types/review-request-template-item'

export const getFallbackReviewRequest = async (): Promise<ReviewRequestTemplateItem> => {
  const config = useRuntimeConfig()

  try {
    const { data } = await $fetch<{ data: unknown }>(
      `${config.public.apiRootUrl}/api/fallback-review-request`
    )

    // Assert with error logging
    try {
      assertReviewRequestTemplateItem(data)
    } catch (e: any) {
      console.error(`[getFallbackReviewRequest] Validation failed for fallback request:`, e?.message ?? e, {
        data,
      })
      throw e
    }

    return data as ReviewRequestTemplateItem
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
        : `An error occurred while fetching fallback review request`)

    throw createError({ statusCode, statusMessage })
  }
}
