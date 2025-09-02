import { assertBlogPostData, type BlogPostData } from '~/types/blog-post-data'

export const getAllBlogPosts = async (): Promise<BlogPostData[]> => {
  const config = useRuntimeConfig()

  const queries = new URLSearchParams()
  if (config.public.previewMode) {
    queries.append('preview', 'true')
  }

  try {
    const { data } = await $fetch<{ data: unknown }>(
      `${config.public.apiRootUrl}/api/blog-posts${queries.toString() ? `?${queries.toString()}` : ''}`
    )

    if (!Array.isArray(data)) {
      console.error('[getAllBlogPosts] Expected array, received:', typeof data)
      throw new Error('Invalid response from API: data is not an array')
    }

    // Use assert with logging per item
    for (let i = 0; i < data.length; i++) {
      try {
        assertBlogPostData(data[i])
      } catch (e: any) {
        console.error(`[getAllBlogPosts] Validation failed for item at index ${i}:`, e?.message ?? e)
        throw e // rethrow to be caught by outer catch and converted to createError
      }
    }

    return data as BlogPostData[]
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
      'An error occurred while fetching blog posts list'

    throw createError({ statusCode, statusMessage })
  }
}
