<script lang="ts" setup>
import { NuxtLink } from '#components'
import { getFallbackReviewRequest } from '~/services/api/get-fallback-review-request'
import type { ReviewRequestTemplateItem } from '~/types/review-request-template-item'

const route = useRoute()

definePageMeta({
  key: (route) => route.fullPath, // remount on path change
  layout: 'leave-a-review-layout',
})

const { data, pending, error } = await useAsyncData<ReviewRequestTemplateItem>(
  () => 'fallback-review-request',
  () => getFallbackReviewRequest(),
)

// ---- SEO: don't index, but share well on social ----
const runtimeConfig = useRuntimeConfig()
const siteUrl = (runtimeConfig.public?.siteUrl as string) || '' // e.g. https://coastalsheds.com
const pageUrl = computed(() => (siteUrl ? siteUrl.replace(/\/+$/, '') + route.fullPath : route.fullPath))

const shareTitle = computed(() => 'Leave Us a Review')
const shareDescription = computed(
  () => data.value?.requestMessage ?? 'We value your feedback—pick your favorite platform to leave a review.'
)
// Optional: put a real OG image here if you have one
const shareImage = computed(() => (runtimeConfig.public?.ogImage as string) || '')

useHead({
  title: shareTitle.value,
  meta: [
    // ✅ Prevent indexing
    { name: 'robots', content: 'noindex, nofollow' },

    // Open Graph
    { property: 'og:type', content: 'website' },
    { property: 'og:title', content: shareTitle.value },
    { property: 'og:description', content: shareDescription.value },
    { property: 'og:url', content: pageUrl.value },
    ...(shareImage.value ? [{ property: 'og:image', content: shareImage.value }] : []),

    // Twitter
    { name: 'twitter:card', content: 'summary_large_image' },
    { name: 'twitter:title', content: shareTitle.value },
    { name: 'twitter:description', content: shareDescription.value },
    ...(shareImage.value ? [{ name: 'twitter:image', content: shareImage.value }] : []),
  ],
})
</script>

<template>
  <div class="min-h-screen w-full flex items-center justify-center p-4 md:p-6">
    <div
      class="w-full max-w-3xl rounded-2xl border bg-white/80 shadow-sm ring-1 ring-black/5 backdrop-blur-md
             dark:bg-neutral-900/70 dark:ring-white/10"
    >
      <!-- Body -->
      <div class="px-5 py-6 md:px-8 md:py-10">
        <!-- Heading / message -->
        <div class="text-center space-y-3 md:space-y-4">
          <h1 class="text-2xl md:text-3xl font-semibold tracking-tight">
            Leave Us a Review
          </h1>

          <p v-if="data" class="text-base md:text-lg text-neutral-700 dark:text-neutral-300">
            {{ data.requestMessage }}
          </p>
          <p v-else-if="pending" class="text-base md:text-lg text-neutral-700 dark:text-neutral-300">
            We value your feedback—loading your options…
          </p>
        </div>

        <!-- Channels -->
        <div v-if="data" class="mt-8 md:mt-10">
          <p class="text-center text-sm md:text-base text-neutral-600 dark:text-neutral-400 mb-4 md:mb-6">
            Please click a platform below to leave your review:
          </p>

          <div
            class="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 gap-4 md:gap-6 place-items-center"
          >
            <a
              v-for="(channel, index) in data.channels"
              :key="index"
              :href="channel.reviewUrl"
              rel="nofollow noopener"
              class="group w-20 h-20 md:w-24 md:h-24 rounded-xl border bg-white shadow-sm ring-1 ring-black/5
                     flex items-center justify-center transition hover:-translate-y-0.5 hover:shadow-md
                     dark:bg-neutral-900 dark:border-neutral-800 dark:ring-white/10"
            >
              <img
                :src="channel.logoUrl"
                alt="Review platform logo"
                class="max-w-[60%] max-h-[60%] object-contain transition group-hover:scale-[1.05]"
                loading="lazy"
                decoding="async"
              />
            </a>
          </div>
        </div>

        <!-- Loader -->
        <div v-else-if="pending" class="mt-10">
          <div class="h-48 flex flex-col items-center justify-center gap-3">
            <p class="text-lg md:text-xl font-medium text-neutral-800 dark:text-neutral-200" aria-live="polite">
              Loading
              <span class="inline-flex ml-1 align-middle" aria-hidden="true">
                <span class="loading-dot w-3 h-3 rounded-full bg-current mx-0.5"></span>
                <span class="loading-dot w-3 h-3 rounded-full bg-current mx-0.5"></span>
                <span class="loading-dot w-3 h-3 rounded-full bg-current mx-0.5"></span>
              </span>
            </p>
            <p class="text-sm text-neutral-500 dark:text-neutral-400">Fetching your review options…</p>
          </div>
        </div>

        <!-- Error -->
        <div v-else class="mt-10">
          <div class="text-center py-12">
            <p class="text-lg font-medium text-red-600 dark:text-red-400">
              Error loading review request.
            </p>
            <p class="text-sm text-neutral-600 dark:text-neutral-400">
              Please try again in a moment.
            </p>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
@keyframes dotPulse {
  0%, 80%, 100% { transform: scale(0); opacity: .25; }
  40% { transform: scale(1); opacity: 1; }
}
.loading-dot {
  animation: dotPulse 1.4s infinite ease-in-out both;
}
.loading-dot:nth-child(2) { animation-delay: .2s; }
.loading-dot:nth-child(3) { animation-delay: .4s; }
</style>
