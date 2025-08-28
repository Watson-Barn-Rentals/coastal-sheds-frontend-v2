<script lang="ts" setup>
import MaxWidthContentWrapper from "~/components/max-width-content-wrapper.vue";
import { getBlogPost } from "~/services/api/get-blog-post";
import type { BlogPostData } from "~/types/blog-post-data";

const config = useRuntimeConfig();
const route = useRoute();
const slug = computed(() => route.params.slug as string);

definePageMeta({ layout: "default", key: (r) => r.fullPath });

const canonicalUrl = computed(
  () => `${config.public.siteRootUrl}/blog/${slug.value}`
);
useHead({
  link: [{ rel: "canonical", href: canonicalUrl.value }],
});

/** Fetch + 404 handling */
const { data, pending, error, refresh } = await useAsyncData<BlogPostData | null>(
  () => `blog-post:${slug.value}`,
  async () => {
    try {
      const res = await getBlogPost(slug.value)
      if (import.meta.server) {
        console.log('[prerender:getBlogPost]', slug.value, '→',
          res ? 'OK' : 'EMPTY')
      }
      return res
    } catch (e: any) {
      if (import.meta.server) {
        console.log('[prerender:getBlogPost:ERROR]', slug.value, e?.response?.status, e?.message)
      }
      if (e?.response?.status === 404) return null
      throw e
    }
  },
  { watch: [slug] }
)


if (import.meta.server && !pending.value && !data.value) {
  throw createError({ statusCode: 404, statusMessage: "Blog post not found" });
}

/** Helpers */
function absolutize(url?: string) {
  if (!url) return undefined;
  return url.startsWith("http")
    ? url
    : new URL(url, config.public.siteRootUrl).toString();
}

const hero = computed(() => data.value?.heroImage ?? null);
const ogImageUrl = computed(() => absolutize(hero.value?.original_url));
const ogImageAlt = computed(() => hero.value?.alt || "Blog image");
const ogImageWidth = computed(() => hero.value?.width);
const ogImageHeight = computed(() => hero.value?.height);

const publishedISO = computed(() =>
  data.value?.published_at
    ? new Date(data.value.published_at).toISOString()
    : undefined
);

const updatedISO = computed(() =>
  data.value?.updated_at
    ? new Date(data.value.updated_at).toISOString()
    : undefined
);

const formattedDate = computed(() =>
  data.value?.published_at
    ? new Date(data.value.published_at).toLocaleDateString(undefined, {
        year: "numeric",
        month: "long",
        day: "numeric",
      })
    : ""
);

const isFuture = computed(() => {
  if (!data.value?.published_at) return false;
  const dt = new Date(data.value.published_at);
  return dt.getTime() > Date.now();
});

/** Meta tags */
useSeoMeta({
  title: () =>
    `${data.value?.title ?? ""}${
      data.value?.published_at
        ? ` (${new Date(data.value.published_at).toLocaleDateString(undefined, {
            year: "numeric",
            month: "short",
            day: "numeric",
          })})`
        : ""
    } - ${config.public.siteName}`,
  description: () => data.value?.short_description ?? "",

  // Robots: keep future-dated posts out of the index
  robots: () =>
    isFuture.value ? "noindex, nofollow, noarchive" : "index, follow",

  // Open Graph
  ogType: "article",
  ogTitle: () => data.value?.title ?? "",
  ogDescription: () => data.value?.short_description ?? "",
  ogUrl: () => canonicalUrl.value,
  ogImage: () => ogImageUrl.value,
  ogImageAlt: () => ogImageAlt.value as any,
  // Optional if you have them
  ogImageWidth: () => ogImageWidth.value as any,
  ogImageHeight: () => ogImageHeight.value as any,

  // Article
  articlePublishedTime: () => publishedISO.value,
  articleModifiedTime: () => updatedISO.value ?? publishedISO.value,

  // Twitter
  twitterCard: () => (ogImageUrl.value ? "summary_large_image" : "summary"),
  twitterTitle: () => data.value?.title ?? "",
  twitterDescription: () => data.value?.short_description ?? "",
  twitterImage: () => ogImageUrl.value,
});

/** JSON-LD / Schema.org (nuxt-schema-org) */
useSchemaOrg([
  defineWebSite({
    name: config.public.pageTitleSiteName,
    url: config.public.siteRootUrl,
  }),
  defineWebPage({
    "@type": "WebPage",
    name: computed(() => data.value?.title ?? ""),
    description: computed(() => data.value?.short_description ?? ""),
    url: canonicalUrl, // helps identify the canonical entity
  }),
  defineBreadcrumb({
    itemListElement: [
      { name: "Home", item: config.public.siteRootUrl },
      { name: "Blog", item: `${config.public.siteRootUrl}/blog` },
      { name: computed(() => data.value?.title ?? "Post"), item: canonicalUrl },
    ],
  }),
  defineArticle({
    "@type": "BlogPosting",
    headline: computed(() => data.value?.title ?? ""),
    description: computed(() => data.value?.short_description ?? ""),
    datePublished: publishedISO,
    dateModified: updatedISO ?? publishedISO,
    inLanguage: "en-US",
    mainEntityOfPage: canonicalUrl,
    image: computed(() =>
      ogImageUrl.value
        ? {
            "@type": "ImageObject",
            url: ogImageUrl.value,
            width: ogImageWidth.value,
            height: ogImageHeight.value,
            caption: ogImageAlt.value,
          }
        : undefined
    ),
    // Author/Publisher: keep as Organization (brand) since you don't have per-author.
    author: {
      "@type": "Organization",
      name: config.public.pageTitleSiteName ?? "",
      image: { "@type": "ImageObject", url: config.public.siteLogoUrl },
      url: config.public.siteRootUrl,
    },
    publisher: {
      "@type": "Organization",
      name: config.public.pageTitleSiteName ?? "",
      logo: { "@type": "ImageObject", url: config.public.siteLogoUrl },
    },
  }),
]);
</script>

<template>
  <PageDataGate :sources="[{ data, pending, error, refresh }]">
    <!-- Only render if data exists -->
    <div v-if="data">
      <!-- Hero (overlay anchored to the hero itself) -->
      <div
        v-if="data.heroImage"
        class="relative overflow-hidden [aspect-ratio:2/1] sm:[aspect-ratio:3/1] md:[aspect-ratio:4/1]"
      >
        <ResponsiveImage
          :image-media-item="data.heroImage"
          :alt="data.heroImage?.alt || data.title"
          class="absolute inset-0 size-full object-cover fade-bottom-mask"
          fetchpriority="high"
        />

        <div
          class="absolute inset-0 flex flex-col justify-center items-center mt-[86px]"
        >
          <Heading
            class="w-full"
            :text="data.title"
            heading-level="h1"
            text-alignment="center"
            :class="{ 'medium-black-glow text-white': data.heroImage }"
          />
          <p
            v-if="data.published_at"
            class="font-title text-center mt-4"
            :class="{ 'medium-black-glow text-white': data.heroImage }"
          >
            Published {{ formattedDate }}
          </p>
        </div>
      </div>

      <!-- Fallback title/date when no hero -->
      <div v-else class="mt-8 text-center">
        <Heading
          :text="data.title"
          heading-level="h1"
          text-alignment="center"
        />
        <p v-if="data.published_at" class="font-title mt-2">
          Published {{ formattedDate }}
        </p>
      </div>

      <MaxWidthContentWrapper>
        <PageBlockRenderer class="mt-8" :page-blocks="data.blocks" />

        <div v-if="data.relatedBlogPosts?.length">
          <Heading
            class="w-full"
            text="Explore Related Blog Posts"
            heading-level="h2"
            text-alignment="center"
          />
          <CardGallery class="my-8">
            <BlogPostCard
              v-for="blogPost in data.relatedBlogPosts"
              :key="blogPost.slug"
              :hero-image="blogPost.heroImage"
              :slug="blogPost.slug"
              :title="blogPost.title"
              :description="blogPost.short_description"
              :date-published="new Date(blogPost.published_at)"
              loading="lazy"
            />
          </CardGallery>
        </div>
      </MaxWidthContentWrapper>
    </div>
  </PageDataGate>
</template>

<style scoped>
.medium-black-glow {
  filter: drop-shadow(0 0 4px black) drop-shadow(0 0 8px black);
}

.fade-bottom-mask {
  mask-image: linear-gradient(
    to bottom,
    rgba(0, 0, 0, 1) 50%,
    rgba(0, 0, 0, 0) 100%
  );
  -webkit-mask-image: linear-gradient(
    to bottom,
    rgba(0, 0, 0, 1) 50%,
    rgba(0, 0, 0, 0) 100%
  );
}
</style>
