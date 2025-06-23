import { defineEventHandler, getCookie } from 'h3'

export default defineEventHandler(async (event) => {
  const token = getCookie(event, 'previewToken')
  if (!token) {
    // No preview token → let Nitro serve the pre-rendered static HTML
    return
  }


  // Mark this request as a preview
  event.context.previewToken = token
})
