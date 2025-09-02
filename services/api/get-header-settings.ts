import { assertHeaderSettings, normalizeHeaderSettings, type HeaderSettings } from '~/types/header-settings'

export const getHeaderSettings = async (): Promise<HeaderSettings> => {
  const config = useRuntimeConfig()

  try {
    const { data } = await $fetch<{ data: unknown }>(
      `${config.public.apiRootUrl}/api/get-header-settings`
    )

    // Normalize first (coerces numbers, etc.), then assert with logging
    const normalized = normalizeHeaderSettings(data)

    try {
      assertHeaderSettings(normalized)
    } catch (e: any) {
      console.error('[getHeaderSettings] Validation failed:', e?.message ?? e, { normalized })
      throw e
    }

    return normalized as HeaderSettings
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
