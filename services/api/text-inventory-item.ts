import { createError, useRuntimeConfig } from 'nuxt/app'

export const textInventoryItem = async (serialNumber: string, phoneNumber: string): Promise<void> => {
  const config = useRuntimeConfig()

  // basic client-side format check to fail fast
  const phoneRegex = /^\d{10}$/
  if (!phoneRegex.test(phoneNumber)) {
    throw createError({ statusCode: 400, statusMessage: 'Invalid phone number format' })
  }

  // get the device fingerprint (required by backend)
  const { $fingerprint } = useNuxtApp()
  let visitorId: string | null = null
  try {
    const agent = await $fingerprint()
    const result = await agent.get()
    visitorId = result.visitorId
  } catch (e) {
    // If you want this to be truly required, bubble a clear error.
    // (If you prefer “best-effort”, you could send a placeholder and let the server reject.)
    throw createError({ statusCode: 503, statusMessage: 'Unable to compute device fingerprint. Please try again.' })
  }

  try {
    await $fetch(
      `${config.public.apiRootUrl}/api/text-inventory-item`,
      {
        method: 'POST',
        body: {
          serial_number: serialNumber,
          phone_number: phoneNumber,
          fingerprint_id: visitorId,
        },
      }
    )
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
