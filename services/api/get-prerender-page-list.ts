export const getPrerenderPageList = async (): Promise<string[]> => {
	const config = useRuntimeConfig()

	try {
		const { data } = await $fetch<{ data: unknown }>(`${config.public.apiRootUrl}/api/get-prerender-page-list`)

		if (!Array.isArray(data) || !data.every(item => typeof item === 'string')) {
			throw new Error('Invalid response from API')
		}

		return data
	} catch (err: any) {
		await navigateTo('/error')
		throw new Error('An error occurred while fetching prerender page list')
	}
}
