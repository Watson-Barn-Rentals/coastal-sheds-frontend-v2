import { isLocationItem, type LocationItem } from "~/types/location-item"

export const getLocationsList = async (): Promise<LocationItem[]> => {
	const config = useRuntimeConfig()

	try {
		let { data } = await $fetch<{ data: unknown }>(`${config.public.apiRootUrl}/api/list-locations`)

		
		if (!Array.isArray(data) || !data.every(isLocationItem)) {
			throw new Error('Invalid location items data')
		}

		return data
	} catch (err: any) {
		await navigateTo('/error')
		throw new Error(`An error occurred while fetching location items`)
	}
}
