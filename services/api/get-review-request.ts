// ~/services/api/get-review-request.ts
import { assertReviewRequestItem, type ReviewRequestItem } from '~/types/review-request-item'

export const getReviewRequest = async (slug: string): Promise<ReviewRequestItem> => {
  const config = useRuntimeConfig()

  try {
    const { data } = await $fetch<{ data: unknown }>(
      `${config.public.apiRootUrl}/api/review-requests/${encodeURIComponent(slug)}`,
      { retry: 0 }
    )

    try {
      assertReviewRequestItem(data)
    } catch (e: any) {
      // Log once, then rethrow as a Nuxt error for consistent handling
      console.error(`[getReviewRequest] Validation failed for slug "${slug}":`, e?.message ?? e, { data })
      throw createError({
        statusCode: 500,
        statusMessage: `Invalid response for review request "${slug}"`,
      })
    }

    return data as ReviewRequestItem
  } catch (err: any) {
    // Wrap in a Nuxt error so middleware / page can treat uniformly
    throw createError({
      statusCode: err?.statusCode ?? 500,
      statusMessage: `[getReviewRequest] Fetch failed for slug "${slug}": ${err?.message ?? err}`,
    })
  }
}
