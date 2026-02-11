export default async (request: Request, context: any) => {
  const url = new URL(request.url)

  // Only normalize the inventory list page (not detail pages)
  // Adjust if you serve `/inventory/` with trailing slash.
  const isInventoryList =
    url.pathname === "/inventory" || url.pathname === "/inventory/"

  if (!isInventoryList) {
    return context.next()
  }

  // IMPORTANT: strip query BEFORE hitting Nuxt render
  // (browser keeps query; only origin-render sees queryless)
  url.search = ""

  // Optionally normalize trailing slash for consistent HTML/payload
  if (url.pathname === "/inventory") url.pathname = "/inventory/"

  const normalized = new Request(url.toString(), request)
  return context.next(normalized)
}
