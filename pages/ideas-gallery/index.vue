<script lang="ts" setup>
import { getIdeasGalleryEntriesList } from '~/services/api/get-ideas-gallery-entries-list';
import type { IdeasGalleryEntry } from '~/types/ideas-gallery-entry';


const config = useRuntimeConfig();

const { data, pending, error, refresh } = await useAsyncData<
  IdeasGalleryEntry[]
>("ideas-gallery-entries-list", getIdeasGalleryEntriesList);

const {
  activeTagSlug,
  filteredIdeasGalleryEntries,
  tagFilterOptions,
  hiddenIdeasGalleryEntriesCount,
  setTagSlugFilter,
  removeFilters,
} = useIdeasGalleryFilters(data.value ?? []);

const scrollToFilters = () => {
  const el = document.getElementById("filters-section");
  if (!el) return;
  const targetY = Math.max(
    0,
    el.getBoundingClientRect().top + window.pageYOffset - 84
  );
  window.scrollTo({ top: targetY, behavior: "smooth" });
};

const pageTitle = "Browse Past Projects"
const pageDescription = "Explore some of our past projects for inspiration and ideas."

// Helper to absolutize URLs when an asset path is relative
const absolutize = (u?: string) => (u && !u.startsWith("http"))
  ? new URL(u, config.public.siteRootUrl).toString()
  : u

// Representative OG image (use the first category hero as a fallback)
const representative = computed(() => data.value?.[0] ?? null)
const ogImageUrl = computed(() => absolutize(representative.value?.image?.original_url))
const ogImageAlt = computed(() => representative.value?.title || "Products")

// Canonical
const canonicalUrl = computed(() => `${config.public.siteRootUrl}/ideas-gallery/`)

// Preconnect/dns-prefetch to the image origins of the first few cards
const imageOrigins = computed(() => {
  const origins = new Set<string>()
  ;(data.value ?? []).slice(0, 4).forEach((pc) => {
    const u = pc?.image?.original_url
    if (!u) return
    try {
      origins.add(new URL(u).origin)
    } catch {}
  })
  return [...origins]
})

// 🔗 Head links (canonical, preconnect, preload)
useHead(() => {
  const links: any[] = [{ rel: "canonical", href: canonicalUrl.value }]
  imageOrigins.value.forEach((o) => {
    links.push({ rel: "preconnect", href: o, crossorigin: "" })
    links.push({ rel: "dns-prefetch", href: o })
  })
  if (representative.value?.image?.original_url) {
    links.push({
      rel: "preload",
      as: "image",
      href: absolutize(representative.value.image.original_url),
      imagesrcset: representative.value.image.srcset,
      imagesizes: "100vw",
      fetchpriority: "high",
    })
  }
  return { link: links }
})

// 🧠 Meta tags (reactive getters)
useSeoMeta({
  title: () => `${pageTitle} - ${config.public.pageTitleSiteName}`,
  description: () => pageDescription,

  // Open Graph
  ogType: "website",
  ogTitle: () => pageTitle,
  ogDescription: () => pageDescription,
  ogUrl: () => canonicalUrl.value,
  ogImage: () => ogImageUrl.value,
  ogImageAlt: () => ogImageAlt.value as any,

  // Twitter
  twitterCard: () => (ogImageUrl.value ? "summary_large_image" : "summary"),
  twitterTitle: () => pageTitle,
  twitterDescription: () => pageDescription,
  twitterImage: () => ogImageUrl.value,

  // Helpful defaults
  robots: "index, follow, max-image-preview:large",
})
</script>

<template>
  <PageDataGate :sources="[{ data, pending, error, refresh }]">
    <div v-if="data">
      <Heading
        text="Browse Past Projects"
        heading-level="h1"
        text-alignment="center"
        class="mt-12 md:mt-24"
      />
      <p class="text-center text-lg md:text-xl mb-8 mt-4">
        Explore some of our past projects for inspiration and ideas.
      </p>
      <MaxWidthContentWrapper>
        <div id="filters-section" class="w-full flex flex-wrap gap-4 justify-center m-8">
          <IdeasGalleryTagFilter
            :is-active="activeTagSlug === null"
            title="Show All"
            @click="removeFilters()"
          />
          <IdeasGalleryTagFilter
            v-for="(tag, index) in tagFilterOptions"
            :key="`ideas-gallery-tag-filter-${index}`"
            :is-active="tag.isActive"
            :title="tag.title"
            @click="setTagSlugFilter(tag.slug)"
          />
        </div>
        <CardGallery class="my-8">
          <IdeasGalleryCard
            v-for="(ideasGalleryEntry, index) in filteredIdeasGalleryEntries"
            :key="`ideas-gallery-entry-${index}`"
            class="h-full"
            :image="ideasGalleryEntry.image"
            :title="ideasGalleryEntry.title"
            :description="ideasGalleryEntry.description"
            :designer_link="ideasGalleryEntry.designer_link"
          />
          <NoItemsCard
            v-if="data!.length === 0"
            message="No Entries to Display"
          />
          <div
            v-if="hiddenIdeasGalleryEntriesCount > 0"
            class="group flex h-full flex-col gap-8 overflow-hidden rounded-2xl bg-background-accent shadow-lg transition-all duration-200 hover:scale-105 hover:shadow-xl dark:bg-background-accent-dark p-8 justify-center"
          >
            <p class="text-center text-xl">
              {{ hiddenIdeasGalleryEntriesCount }} {{ hiddenIdeasGalleryEntriesCount === 1 ? "Item" : "Items" }} Hidden by Filters
            </p>
            <button
              class="bg-brand text-white p-2 mx-auto rounded-lg flex gap-1 cursor-pointer transition-all duration-150 hover:scale-105"
              @click="scrollToFilters"
            >
              <UIcon name="solar:arrow-up-broken" class="w-6 h-6 my-auto" />
              <span class="my-auto">Jump to Filters</span>
            </button>
          </div>
        </CardGallery>
      </MaxWidthContentWrapper>
    </div>
  </PageDataGate>
</template>
