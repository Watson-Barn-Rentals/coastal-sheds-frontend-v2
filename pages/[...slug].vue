<script setup lang="ts">
import { getPageData } from '~/services/api/get-page-data'

// Keep your meta
definePageMeta({ layout: 'default', key: r => r.fullPath })

const config = useRuntimeConfig()
const route = useRoute()

const normalizePath = (input?: string | null): string => {
  let p = (input || "/").split("?")[0]?.split("#")[0] ?? "/"
  if (!p.startsWith("/")) p = `/${p}`
  p = p.replace(/\/+/g, "/")
  if (p !== "/" && !p.endsWith("/")) p += "/"
  return p
}

const normalizedPath = normalizePath(route.path)
const pageKey = `page:${normalizedPath}`

const { data, pending, error, refresh } = await useAsyncData(
  pageKey,
  () => getPageData(normalizedPath)
)


/** Prefer the CMS path (avoids duplicate URLs if someone hits /about?ref=…) */
const canonicalUrl = computed(() => {
	const siteRoot = config.public.siteRootUrl
	const rawPath = (data.value?.url || route.path) || '/'

	// Normalize internal path and ensure trailing slash
	const toTrailing = (url?: string | null): string => {
		if (!url) return '/'
		if (/^(https?:|mailto:|tel:|#)/i.test(url)) return url

		let base = url.startsWith('/') ? url : `/${url}`

		// Separate query/hash for preservation
		const qIndex = base.indexOf('?')
		const hIndex = base.indexOf('#')
		const cut = [qIndex, hIndex].filter(i => i !== -1).sort((a, b) => a - b)[0] ?? base.length

		const path = base.slice(0, cut).replace(/\/+/g, '/')
		const tail = base.slice(cut)

		const withSlash = path !== '/' && !path.endsWith('/') ? `${path}/` : path
		return withSlash + tail
	}

	const normalizedPath = toTrailing(rawPath)

	try {
		return new URL(normalizedPath, siteRoot).toString()
	} catch {
		// fallback to root if siteRoot is malformed
		return `${siteRoot.replace(/\/+$/, '')}/`
	}
})


/** Sitewide fallback OG image */
const fallbackOgImage = computed(
  () => (config.public.siteOgImageUrl || config.public.siteLogoUrl) as string | undefined
)

/** Auto noindex 404s; otherwise index */
const robots = computed(() => {
  const sc =
    (error.value as any)?.response?.status ??
    (error.value as any)?.statusCode ??
    (error.value as any)?.status
  return sc === 404 ? 'noindex, nofollow' : 'index, follow, max-image-preview:large'
})

/** Canonical (no composables in this factory—only captured refs) */
useHead(() => ({
  link: [{ rel: 'canonical', href: canonicalUrl.value }],
}))

/** Core meta */
useSeoMeta({
  title: () => {
    const t = data.value?.title || ''
    return t ? `${t} - ${config.public.pageTitleSiteName}` : config.public.pageTitleSiteName
  },
  description: () => data.value?.short_description || '',

  robots: () => robots.value,

  // Open Graph
  ogType: 'website',
  ogTitle: () => data.value?.title || config.public.pageTitleSiteName,
  ogDescription: () => data.value?.short_description || '',
  ogUrl: () => canonicalUrl.value,
  ogImage: () => fallbackOgImage.value,
  ogImageAlt: () => (data.value?.title ? `${data.value.title} image` : config.public.pageTitleSiteName) as any,

  // Twitter
  twitterCard: () => (fallbackOgImage.value ? 'summary_large_image' : 'summary'),
  twitterTitle: () => data.value?.title || config.public.pageTitleSiteName,
  twitterDescription: () => data.value?.short_description || '',
  twitterImage: () => fallbackOgImage.value,
})

/** Schema.org */
const humanize = (s: string) =>
  decodeURIComponent(s).replace(/[-_]+/g, ' ').replace(/\b\w/g, c => c.toUpperCase())

useSchemaOrg(() => {
  const parts = route.path.split('/').filter(Boolean)
  // Build crumb trail from path segments; last is the canonical entity
  const crumbs = [
    { name: 'Home', item: config.public.siteRootUrl },
    ...parts.map((seg, i) => ({
      name: humanize(seg),
      item: new URL('/' + parts.slice(0, i + 1).join('/'), config.public.siteRootUrl).toString(),
    })),
  ]

  // Replace last crumb name with CMS title if available
  if (data.value?.title && crumbs.length > 1) {
    crumbs[crumbs.length - 1] = { name: data.value.title, item: canonicalUrl.value }
  }

  return [
    defineWebPage({
      name: data.value?.title || config.public.pageTitleSiteName,
      description: data.value?.short_description || '',
      url: canonicalUrl.value,
    }),
    defineBreadcrumb({ itemListElement: crumbs }),
  ]
})
</script>


<template>
  <PageDataGate :sources="[{ data, pending, error, refresh }]">
    <PageBlockRenderer v-if="data" :page-blocks="data.blocks" />
  </PageDataGate>
</template>
