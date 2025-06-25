import { isHeaderSettings, type HeaderSettings } from "~/types/header-settings"

export const getHeaderSettings = async (): Promise<HeaderSettings> => {
	const config = useRuntimeConfig()

	try {
		const { data } = await $fetch<{ data: unknown }>(`${config.public.apiRootUrl}/api/get-header-settings`)

		
		if (!isHeaderSettings(data)) {
			throw new Error('Invalid response from API')
		}

		return data
	} catch (err: any) {
		await navigateTo('/error')
		throw new Error('An error occurred while fetching header settings')
	}
}
