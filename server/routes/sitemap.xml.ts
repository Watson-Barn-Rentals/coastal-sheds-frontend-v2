import { setHeader, defineEventHandler } from "h3"

const escapeXml = (value: string): string =>
  value
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&apos;')

const ensureTrailingSlash = (pathname: string): string => {
  if (!pathname) return '/'
  let p = pathname.startsWith('/') ? pathname : `/${pathname}`
  p = p.replace(/\/+/g, '/')
  if (p !== '/' && !p.endsWith('/')) p += '/'
  return p
}

export default defineEventHandler(async (event) => {
  const config = useRuntimeConfig()
  const apiRoot = config.public.apiRootUrl
  const siteRoot = config.public.siteRootUrl

  if (!apiRoot || !siteRoot) {
    setHeader(event, 'Content-Type', 'application/xml; charset=utf-8')
    return `<?xml version="1.0" encoding="UTF-8"?><urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"></urlset>`
  }

  const siteRootUrl = new URL(siteRoot)
  const rootOrigin = siteRootUrl.origin

  const urls = new Set<string>()
  const addPath = (input?: string) => {
    if (!input) return
    try {
      let url: URL
      if (/^https?:\/\//i.test(input)) {
        url = new URL(input)
        if (url.origin !== rootOrigin) return
      } else {
        url = new URL(input.startsWith('/') ? input : `/${input}`, siteRootUrl)
      }
      url.hash = ''
      url.search = ''
      url.pathname = ensureTrailingSlash(url.pathname)
      urls.add(url.toString())
    } catch {}
  } 

  try {
    const res = await fetch(`${apiRoot}/api/get-sitemap-page-list`, {
      headers: { Accept: 'application/json' },
    })
    if (res.ok) {
      const { data } = (await res.json()) as { data?: string[] }
      for (const r of data ?? []) addPath(r)
    }
  } catch {}

  const sorted = Array.from(urls).sort((a, b) => a.localeCompare(b))

  // Cache at edge (optional but recommended)
  setHeader(event, 'Content-Type', 'application/xml; charset=utf-8')
  setHeader(event, 'Cache-Control', 'public, max-age=0, must-revalidate')
  setHeader(event, 'Netlify-CDN-Cache-Control', 'public, s-maxage=21600, stale-while-revalidate=86400') // 6h edge
  setHeader(event, 'Cache-Tag', 'sitemap') // so you can purge it

  const chunks: string[] = []
  chunks.push('<?xml version="1.0" encoding="UTF-8"?>')
  chunks.push('<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">')
  for (const loc of sorted) {
    chunks.push('  <url>')
    chunks.push(`    <loc>${escapeXml(loc)}</loc>`)
    chunks.push('  </url>')
  }
  chunks.push('</urlset>')

  return chunks.join('\n')
})
