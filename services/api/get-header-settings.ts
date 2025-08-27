import { isHeaderSettings, normalizeHeaderSettings, type HeaderSettings } from "~/types/header-settings"

export const getHeaderSettings = async (): Promise<HeaderSettings> => {
	const config = useRuntimeConfig()

	try {
		let { data } = await $fetch<{ data: unknown }>(`${config.public.apiRootUrl}/api/get-header-settings`)

		data = normalizeHeaderSettings(data)
		
		if (!isHeaderSettings(data)) {
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
		  'An error occurred while fetching header settings'

		throw createError({ statusCode, statusMessage })
	}
}
