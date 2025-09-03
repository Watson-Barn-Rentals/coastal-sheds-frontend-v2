<script lang="ts" setup>
import { getAllFaqs } from '~/services/api/get-all-faqs'
import type { FaqItem } from '~/types/faq-data'

// Runtime + page meta
const config = useRuntimeConfig()
definePageMeta({ layout: 'default', key: 'faqs' })

// Canonical
const canonicalUrl = computed(() => `${config.public.siteRootUrl}/faqs`)

// Fetch FAQs (SSR)
const { data, pending, error, refresh } = await useAsyncData<FaqItem[]>(
  'all-faqs',
  getAllFaqs
)

// ---- SEO meta ----
const siteName = computed(() => config.public.pageTitleSiteName || '')
const title = computed(() =>
  siteName.value ? `Frequently Asked Questions | ${siteName.value}` : 'Frequently Asked Questions'
)

// Small helper to craft a human description from the first few questions (fallback if no data yet)
const description = computed(() => {
  const items = data.value ?? []
  const topQs = items.slice(0, 3).map(q => q.question).filter(Boolean)
  if (topQs.length) {
    return `Answers to common questions: ${topQs.join(', ')}.`
  }
  return 'Find answers to the most common questions about our products and services.'
})

useHead({
  link: [{ rel: 'canonical', href: canonicalUrl.value }],
})

useSeoMeta({
  title: () => title.value,
  description: () => description.value,
  robots: 'index, follow',
  // Open Graph
  ogTitle: () => title.value,
  ogDescription: () => description.value,
  ogType: 'website',
  ogUrl: () => canonicalUrl.value,
  ogSiteName: () => (siteName.value || undefined),
  // Twitter
  twitterCard: 'summary_large_image',
  twitterTitle: () => title.value,
  twitterDescription: () => description.value,
})

// ---- Schema.org (WebPage + Breadcrumb) ----
// Keep FAQPage JSON-LD inside <FaqAccordion> to avoid duplicates.

useSchemaOrg([
  defineWebPage({
    name: title.value,
    description: description.value,
    url: canonicalUrl.value,
  }),
  defineBreadcrumb({
    itemListElement: [
      { name: siteName.value || 'Home', item: config.public.siteRootUrl || '/' },
      { name: 'FAQs', item: canonicalUrl.value },
    ],
  }),
])
</script>

<template>
  <PageDataGate :sources="[{ data, pending, error, refresh }]">
    <div v-if="data">
      <Heading
        text="All Frequently Asked Questions"
        heading-level="h1"
        text-alignment="center"
        class="mt-12 md:mt-24"
      />

      <MaxWidthContentWrapper>
        <!-- FaqAccordion already emits FAQPage JSON-LD; good for rich results -->
        <FaqAccordion :data="data" class="my-8" />
      </MaxWidthContentWrapper>
    </div>
  </PageDataGate>
</template>
