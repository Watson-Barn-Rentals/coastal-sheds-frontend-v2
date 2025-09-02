<script lang="ts" setup>
import { getProductCategoriesList } from "~/services/api/get-product-categories-list";
import { type ProductCategoryItem } from "~/types/product-category-item";

const config = useRuntimeConfig();

const { data, pending, error, refresh } = await useAsyncData<
  ProductCategoryItem[]
>("product-categories-list", getProductCategoriesList);

const pageTitle = "Browse Products & Services"
const pageDescription = "Explore our available products and services to find the perfect fit for your needs."

// Helper to absolutize URLs when an asset path is relative
const absolutize = (u?: string) => (u && !u.startsWith("http"))
  ? new URL(u, config.public.siteRootUrl).toString()
  : u

// Representative OG image (use the first category hero as a fallback)
const representative = computed(() => data.value?.[0] ?? null)
const ogImageUrl = computed(() => absolutize(representative.value?.heroImage?.original_url))
const ogImageAlt = computed(() => representative.value?.title || "Products")

// Canonical
const canonicalUrl = computed(() => `${config.public.siteRootUrl}/products`)

// Preconnect/dns-prefetch to the image origins of the first few cards
const imageOrigins = computed(() => {
  const origins = new Set<string>()
  ;(data.value ?? []).slice(0, 4).forEach((pc) => {
    const u = pc?.heroImage?.original_url
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
  if (representative.value?.heroImage?.original_url) {
    links.push({
      rel: "preload",
      as: "image",
      href: absolutize(representative.value.heroImage.original_url),
      imagesrcset: representative.value.heroImage.srcset,
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

// 🧱 Schema.org
useSchemaOrg(() => {
  const list = (data.value ?? []).map((pc, i) => ({
    "@type": "ListItem",
    position: i + 1,
    url: new URL(
      pc.override_page_url ?? `/product-categories/${pc.slug}`,
      config.public.siteRootUrl
    ).toString(),
    name: pc.title,
    image: absolutize(pc.heroImage?.original_url),
  }))

  return [
    defineWebPage({
      "@type": "CollectionPage",
      name: pageTitle,
      description: pageDescription,
      url: canonicalUrl.value,
    }),
    defineBreadcrumb({
      itemListElement: [
        { name: "Home", item: config.public.siteRootUrl },
        { name: "Products & Services", item: canonicalUrl.value },
      ],
    }),
    {
      "@type": "ItemList",
      itemListElement: list,
    },
  ]
})
</script>

<template>
  <PageDataGate :sources="[{ data, pending, error, refresh }]">
    <div v-if="data">
      <Heading
        text="Browse Products & Services"
        heading-level="h1"
        text-alignment="center"
        class="mt-12 md:mt-24"
      />
      <p class="text-center text-lg md:text-xl mb-8 mt-4">
        Explore our wide range of products to find the perfect fit for your
        needs.
      </p>
      <MaxWidthContentWrapper>
        <CardGallery class="my-8">
          <ProductCard
            v-for="productCategory in data"
            :key="productCategory.slug"
            class="h-full"
            :heroImage="productCategory.heroImage"
            :title="productCategory.title"
            :description="productCategory.short_description"
            :link="
              productCategory.override_page_url
                ? productCategory.override_page_url
                : `/product-categories/${productCategory.slug}`
            "
          />
          <NoItemsCard
            v-if="data!.length === 0"
            message="No Products to Display"
          />
        </CardGallery>
      </MaxWidthContentWrapper>
    </div>
  </PageDataGate>
</template>
