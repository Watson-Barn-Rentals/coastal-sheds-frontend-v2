import { defineEventHandler, getCookie } from 'h3'

export default defineEventHandler((event) => {
  const token = getCookie(event, 'previewToken')
  if (token) {
    // Nitro will *not* serve prerendered HTML
    event.node.res.setHeader('x-nitro-prerender', 'false')
  }
})
