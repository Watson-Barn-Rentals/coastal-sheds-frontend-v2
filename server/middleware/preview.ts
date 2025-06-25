// server/middleware/preview-check.ts
import { defineEventHandler, getCookie, sendRedirect } from 'h3'

export default defineEventHandler(async (event) => {
  // only on preview deployment
  if (process.env.PREVIEW_MODE === 'true') {
    return
  }

  const { req } = event.node
  const token = getCookie(event, 'previewToken')

  // 1) whitelist the “start preview” page so you can land there without a token
  const url = req.url || '/'
  if (url === '/start-preview-session') {
    return
  }

  // 2) everyone else without a token must go back to the main site
  if (!token) {
    sendRedirect(event, `${process.env.PRODUCTION_SITE_URL}${url}`, 302)
    return
  }

  // otherwise, let the SSR handler proceed as normal
})
