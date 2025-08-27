import { isLocationItem, type LocationItem } from "~/types/location-item"

export const getLocationItem = async (slug: string): Promise<LocationItem> => {
	const config = useRuntimeConfig()

	try {
		let { data } = await $fetch<{ data: unknown }>(`${config.public.apiRootUrl}/api/locations/${slug}`)

		if (!isLocationItem(data)) {
			throw new Error('Invalid location data')
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
		  (statusCode === 404 ? 'Location not found' : 'An error occurred while fetching location with slug: ' + slug)

		throw createError({ statusCode, statusMessage })
	}
}
