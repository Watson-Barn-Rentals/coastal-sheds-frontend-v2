// server/middleware/preview-check.ts
import { defineEventHandler, getCookie, sendRedirect } from 'h3'
import { useCookie } from 'nuxt/app'

export default defineEventHandler(async (event) => {
  const { req } = event.node
  const previewCookie = useCookie('previewToken', { path: '/' })
  const config = useRuntimeConfig()

  if (process.env.PREVIEW_MODE !== 'true') {
    return
  }

  if (req.url === '/start-preview-session') {
    return
  }

  if (!previewCookie && !process.dev) {
    sendRedirect(event, `${config.public.mainSiteUrl}${req.url ?? '/'}`, 302)
    return
  }

  // otherwise, let the SSR handler proceed as normal
})
