import { isBlogPostData, type BlogPostData } from "~/types/blog-post-data"

export const getAllBlogPosts = async (): Promise<BlogPostData[]> => {
	const config = useRuntimeConfig()

	const queries = new URLSearchParams()
	if (config.public.previewMode) {
		queries.append('preview', 'true')
	}

	try {
		const { data } = await $fetch<{ data: unknown }>(`${config.public.apiRootUrl}/api/blog-posts${queries.toString() ? '?' + queries.toString() : ''}`)

		if (!Array.isArray(data) || !data.every(isBlogPostData)) {
			throw new Error('Invalid response from API')
		}

		return data
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
