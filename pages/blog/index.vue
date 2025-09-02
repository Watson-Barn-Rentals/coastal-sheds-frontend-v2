<script lang="ts" setup>
import { getAllBlogPosts } from "~/services/api/get-all-blog-posts";
import type { BlogPostData } from "~/types/blog-post-data";

const config = useRuntimeConfig();

definePageMeta({ layout: "default", key: "blog-posts" });

const canonicalUrl = computed(() => `${config.public.siteRootUrl}/blog`);

useHead({
  link: [{ rel: "canonical", href: canonicalUrl.value }],
});

/** Fetch */
const { data, pending, error, refresh } = await useAsyncData<BlogPostData[]>(
  "all-blog-posts",
  getAllBlogPosts
);

/** Helpers */
function absolutize(url?: string) {
  if (!url) return undefined;
  return url.startsWith("http")
    ? url
    : new URL(url, config.public.siteRootUrl).toString();
}

// Use the first post’s image as OG preview (optional)
const firstImage = computed(() => data.value?.[0]?.heroImage ?? null);
const ogImageUrl = computed(() => absolutize(firstImage.value?.original_url)); // ← adjust if key differs
const ogImageAlt = computed(
  () => firstImage.value?.alt || data.value?.[0]?.title || "Blog cover"
); // ← adjust if key differs

useSeoMeta({
  title: () => "Browse Blog Posts - " + config.public.pageTitleSiteName,
  description: () =>
    "Browse all of our blog posts — practical guides, showcased products, and more.",

  // Open Graph
  ogType: "website", // blog index is a collection page
  ogTitle: () => "Browse Blog Posts",
  ogDescription: () =>
    "Browse all of our blog posts — practical guides, showcased products, and more.",
  ogUrl: () => canonicalUrl.value,
  ogImage: () => ogImageUrl.value,
  ogImageAlt: () => ogImageAlt.value as any,

  // Twitter
  twitterCard: () => (ogImageUrl.value ? "summary_large_image" : "summary"),
  twitterTitle: () => "Browse Blog Posts",
  twitterDescription: () =>
    "Browse all of our blog posts — practical guides, showcased products, and more.",
  twitterImage: () => ogImageUrl.value,
});

/** JSON-LD / Schema.org (nuxt-schema-org) */
useSchemaOrg([
  defineWebSite({
    name: config.public.pageTitleSiteName,
    url: config.public.siteRootUrl,
  }),
  defineWebPage({
    "@type": "CollectionPage",
    name: "Blog",
    description:
      "Browse all of our blog posts — practical guides, showcased products, and more.",
    url: canonicalUrl,
  }),
  defineBreadcrumb({
    itemListElement: [
      { name: "Home", item: config.public.siteRootUrl },
      { name: "Blog", item: canonicalUrl },
    ],
  }),
  // Represent the listing with ItemList (limit to e.g. 12 to keep JSON-LD small)
  defineItemList({
    itemListElement: computed(() =>
      (data.value ?? []).slice(0, 12).map((p, i) => ({
        "@type": "ListItem",
        position: i + 1,
        url: `${config.public.siteRootUrl}/blog/${p.slug}`,
        name: p.title,
        image: absolutize(p.heroImage?.original_url), // ← adjust if key differs
      }))
    ),
  }),
]);
</script>

<template>
  <PageDataGate :sources="[{ data, pending, error, refresh }]">
    <div v-if="data">
      <Heading
        text="Browse All Blog Posts"
        heading-level="h1"
        text-alignment="center"
        class="mt-12 md:mt-24"
      />
  
      <MaxWidthContentWrapper>
        <CardGallery class="my-8">
          <BlogPostCard
            v-for="blogPost in data || []"
            :key="blogPost.slug"
            :hero-image="blogPost.heroImage"
            :slug="blogPost.slug"
            :title="blogPost.title"
            :description="blogPost.short_description"
            :date-published="new Date(blogPost.published_at)"
            loading="lazy"
          />
          <NoItemsCard
            v-if="data.length === 0"
            message="No Blog Posts to Display"
          />
        </CardGallery>
      </MaxWidthContentWrapper>
    </div>
  </PageDataGate>
</template>
