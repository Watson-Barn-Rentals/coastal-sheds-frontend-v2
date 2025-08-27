// ~/composables/useBlogPostSchema.ts
import { computed, unref, type Ref, type ComputedRef } from 'vue'
import { useHead, useRuntimeConfig } from '#imports'
// @nuxtjs/schema-org provides these auto-imports:
/// <reference types="@nuxtjs/schema-org/runtime" />

type MaybeRef<T> = T | Ref<T> | ComputedRef<T>

export function useBlogPostSchema(opts: {
  /** Post title (H1) */
  title: MaybeRef<string>
  /** Meta description / short summary */
  description: MaybeRef<string>
  /** Post slug without leading /blog/ (e.g. "how-to-choose-a-shed") */
  slug: MaybeRef<string>
  /** ISO-8601 string or Date string for original publish date */
  publishedAt: MaybeRef<string>
}) {
  const {
    public: { siteRootUrl, siteName, siteLogoUrl },
  } = useRuntimeConfig()

  const normalizeSlug = (s: string) => s.replace(/^\/+|\/+$/g, '')

  /** Canonical URL: https://example.com/blog/<slug> */
  const canonical = computed(() =>
    new URL(`/blog/${normalizeSlug(unref(opts.slug))}`, siteRootUrl).toString()
  )

  // Canonical link
  useHead({
    link: computed(() => [{ rel: 'canonical', href: canonical.value }]),
  })

  // Reactive fields
  const headline = computed(() => unref(opts.title))
  const description = computed(() => unref(opts.description))
  const datePublished = computed(() => unref(opts.publishedAt))

  // Minimal, clean graph for a blog post page
  useSchemaOrg([
    defineWebSite({ name: siteName }),
    defineWebPage({
      '@type': 'WebPage',
      name: headline,
      description,
    }),
    defineBreadcrumb({
      itemListElement: computed(() => [
        { name: 'Home', item: siteRootUrl },
        { name: 'Blog', item: `${siteRootUrl}/blog` },
        { name: headline.value || 'Post', item: canonical.value },
      ]),
    }),
    defineArticle({
      '@type': 'BlogPosting',
      headline,
      description,
      datePublished,
      inLanguage: 'en-US',
      mainEntityOfPage: canonical,
      // No author, keywords, or dateModified (per request)
      publisher: {
        '@type': 'Organization',
        name: siteName,
        ...(siteLogoUrl
          ? { logo: { '@type': 'ImageObject', url: siteLogoUrl } }
          : {}),
      },
    }),
  ])

  return { canonical }
}
