import { isBlogPostData, type BlogPostData } from "~/types/blog-post-data"

export const getBlogPost = async (slug: string): Promise<BlogPostData> => {
	const config = useRuntimeConfig()

	const queries = new URLSearchParams()
	if (config.public.previewMode) {
		queries.append('preview', 'true')
	}

	try {
		const { data } = await $fetch<{ data: unknown }>(`${config.public.apiRootUrl}/api/blog-posts/${slug}${queries.toString() ? '?' + queries.toString() : ''}`)

		if (!isBlogPostData(data)) {
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
		  (statusCode === 404 ? 'Blog post not found' : 'An error occurred while fetching blog post with slug: ' + slug)

		throw createError({ statusCode, statusMessage })
	}
}
