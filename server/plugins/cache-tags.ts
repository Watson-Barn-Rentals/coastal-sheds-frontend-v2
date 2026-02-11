export default defineNitroPlugin((nitroApp) => {
  nitroApp.hooks.hook('render:response', (response, { event }) => {
    const pathname = (event.path || '').split('?')[0] || '/'

    // Only tag inventory detail pages
    if (!pathname.startsWith('/inventory/')) return

    // Extract serial from /inventory/{serial}
    const serial = pathname.slice('/inventory/'.length).split('/')[0]
    if (!serial) return

    response.headers = response.headers || {}

    response.headers['Cache-Tag'] = `inventory inventory-item inventory-item:${serial}`
  })
})
