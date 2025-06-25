// server/middleware/preview-check.ts
import { defineEventHandler, getCookie, sendRedirect } from 'h3'

export default defineEventHandler(async (event) => {
  const { req } = event.node
  const token = getCookie(event, 'previewToken')

  if (process.env.PREVIEW_MODE !== 'true') {
    return
  }

  if (req.url === '/start-preview-session') {
    return
  }

  if (!token) {
    sendRedirect(event, `${process.env.PRODUCTION_SITE_URL}${req.url ?? '/'}`, 302)
    return
  }

  // otherwise, let the SSR handler proceed as normal
})
