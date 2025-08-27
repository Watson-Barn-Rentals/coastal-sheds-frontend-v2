import { isLocationsMapSettings, normalizeLocationsMapSettings, type LocationsMapSettings } from "~/types/locations-map-settings"

export const getLocationsMapSettings = async (): Promise<LocationsMapSettings> => {
	const config = useRuntimeConfig()

	try {
		let { data } = await $fetch<{ data: unknown }>(`${config.public.apiRootUrl}/api/get-locations-map-settings`)

		data = normalizeLocationsMapSettings(data) 

		if (!isLocationsMapSettings(data)) {
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
		  'An error occurred while fetching locations map settings'

		throw createError({ statusCode, statusMessage })
	}
}
