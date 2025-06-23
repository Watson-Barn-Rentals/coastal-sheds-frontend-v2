import { isPageData, type PageData } from "~/types/page-data"

export const getPageData = async (pageUrl: string, previewToken: string | null): Promise<PageData> => {
	const config = useRuntimeConfig()

	const queries = new URLSearchParams()
	if (previewToken) {
		queries.append('previewToken', previewToken)
	}

	try {
		const { data } = await $fetch<{ data: unknown }>(
			`${config.public.apiRootUrl}/api/get-page`,
			{
				query: queries,
				method: 'POST',
				body: { url: pageUrl },
			}
		)

		if (!isPageData(data)) {
			throw new Error('Invalid response from API')
		}

		return data
	} catch (err: any) {
		const statusCode = err?.response?.status || err?.statusCode || 500

		if (statusCode === 404) {
			await navigateTo('/404') // Client redirect
			throw new Error('Page not found')
		} else {
			await navigateTo('/error')
			throw new Error('An error occurred while fetching page data')
		}
	}
}
