import { createError, useRuntimeConfig } from 'nuxt/app'
import { isPageData, type PageData } from '~/types/page-data'

export const textInventoryItem = async (serialNumber: string, phoneNumber: string): Promise<void> => {
  const config = useRuntimeConfig()

  const phoneRegex = /^\d{10}$/

  if (!phoneRegex.test(phoneNumber)) {
    throw createError({
      statusCode: 400,
      statusMessage: 'Invalid phone number format',
    })
  }

  try {
    await $fetch(
      `${config.public.apiRootUrl}/api/get-page`,
      { method: 'POST', body: { serial_number: serialNumber, phone_number:phoneNumber } }
    )

    return
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
      'An error occurred while submitting the text inventory item request'

    throw createError({ statusCode, statusMessage })
  }
}
