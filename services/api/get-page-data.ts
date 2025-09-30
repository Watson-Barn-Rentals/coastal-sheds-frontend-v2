import { createError, useRuntimeConfig } from 'nuxt/app'
import { assertPageData, type PageData } from '~/types/page-data'

export const getPageData = async (pageUrl: string): Promise<PageData> => {
  const config = useRuntimeConfig()

  const queries = new URLSearchParams()
  if (config.public.previewMode) queries.append('preview', 'true')

  const strippedPageUrl = pageUrl
    .replace(/[?#].*$/, '')         // remove query params and hash
    .replace(/(.+?)\/+$/, '$1');    // remove trailing slashes unless it's just "/"

  try {
    const { data } = await $fetch<{ data: unknown }>(
      `${config.public.apiRootUrl}/api/get-page${queries.toString() ? `?${queries.toString()}` : ''}`,
      { method: 'POST', body: { url: strippedPageUrl } }
    )

    // Assert with error logging
    try {
      assertPageData(data)
    } catch (e: any) {
      console.error(`[getPageData] Validation failed for url "${pageUrl}":`, e?.message ?? e, { data })
      throw createError({ statusCode: 502, statusMessage: 'Invalid response from API' })
    }

    return data as PageData
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
      (statusCode === 404 ? 'Page not found' : 'An error occurred while fetching page data')

    throw createError({ statusCode, statusMessage })
  }
}
