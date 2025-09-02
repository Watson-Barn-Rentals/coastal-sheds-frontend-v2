<script lang="ts" setup>
import CardGallery from "~/components/card-gallery.vue";
import MaxWidthContentWrapper from "~/components/max-width-content-wrapper.vue";
import { getProductLineItem } from "~/services/api/get-product-line-item";
import type { ImageMediaItem } from "~/types/image-media-item";
import type { ProductLineItem } from "~/types/product-line-item";

definePageMeta({
  key: (route) => route.fullPath, // remount on path change
  layout: "default",
});

const config = useRuntimeConfig()
const route = useRoute();
const slug = computed(() => route.params.slug as string);

const { data, pending, error, refresh } = await useAsyncData<ProductLineItem>(
  () => `product-category-${slug.value}`, // key depends on slug
  () => getProductLineItem(slug.value), // fetch depends on slug
  { watch: [slug] } // re-fetch when slug changes
);

const canonicalUrl = computed(
  () => `${config.public.siteRootUrl}/product-lines/${slug.value}`
);

// Hero helpers
const hero = computed(() => data.value?.heroImage ?? null)
const heroAbsUrl = computed(() => {
  const u = hero.value?.original_url
  if (!u) return undefined
  return u.startsWith('http') ? u : new URL(u, config.public.siteRootUrl).toString()
})

// Link hints + canonical + explicit OG type
useHead(() => {
  const links: any[] = [{ rel: 'canonical', href: canonicalUrl.value }]

  if (hero.value?.original_url) {
    try {
      const origin = new URL(hero.value.original_url).origin
      links.push({ rel: 'preconnect', href: origin, crossorigin: '' })
      links.push({ rel: 'dns-prefetch', href: origin })
      links.push({
        rel: 'preload',
        as: 'image',
        href: hero.value.original_url,
        imagesrcset: hero.value.srcset,
        imagesizes: '100vw',
        fetchpriority: 'high',
      })
    } catch {}
  }

  // Keep OG type safe for unhead typings
  const meta = [{ property: 'og:type', content: 'website' }]

  return { link: links, meta }
})

// Meta tags
useSeoMeta({
  title: () => {
    const name = data.value?.title ?? 'Product Line'
    const cat  = data.value?.product_category_title
    const brand = config.public.pageTitleSiteName || ''
    const base = cat ? `${name} ${cat}` : name
    return brand ? `${base} | ${brand}` : base
  },
  description: () => {
    if (!data.value) return ''
    const base = (data.value.short_description || '').trim()
    const extra = 'Explore models, sizes, and pricing.'
    return [base, extra].filter(Boolean).join(' ').slice(0, 158)
  },

  // OG
  ogTitle: () => data.value?.title ?? 'Product Line',
  ogDescription: () => data.value?.short_description ?? '',
  ogUrl: () => canonicalUrl.value,
  ogImage: () => heroAbsUrl.value,
  ogImageAlt: () =>
    (hero.value?.alt || `${data.value?.title ?? 'Product Line'} image`) as any,

  // Twitter
  twitterCard: () => (heroAbsUrl.value ? 'summary_large_image' : 'summary'),
  twitterTitle: () => data.value?.title ?? 'Product Line',
  twitterDescription: () => data.value?.short_description ?? '',
  twitterImage: () => heroAbsUrl.value,

  // If this line is empty (no products), avoid indexing
  robots: () =>
    data.value && data.value.products?.length ? 'index, follow' : 'noindex, follow',
})

// JSON-LD
useSchemaOrg(() => {
  if (!data.value) return []

  // Build ItemList of products on the line
  const items = (data.value.products || []).map((p, i) => {
    const url = p.override_page_url || new URL(`/products/${p.slug}`, config.public.siteRootUrl).toString()
    return {
      '@type': 'ListItem',
      position: i + 1,
      item: {
        '@type': 'Product',
        name: p.title,
        description: p.short_description,
        url,
        image: p.heroImage?.original_url,
      },
    }
  })

  const categoryUrl = new URL(
    `/product-categories/${data.value.product_category_slug}`,
    config.public.siteRootUrl
  ).toString()

  return [
    // Page
    defineWebPage({
      '@type': 'CollectionPage',
      name: data.value.title,
      description: data.value.short_description,
      url: canonicalUrl.value,
      inLanguage: 'en-US',
    }),
    // Breadcrumbs
    defineBreadcrumb({
      itemListElement: [
        { name: 'Home', item: config.public.siteRootUrl },
        { name: 'Products', item: new URL('/products', config.public.siteRootUrl).toString() },
        { name: data.value.product_category_title, item: categoryUrl },
        { name: data.value.title, item: canonicalUrl.value },
      ],
    }),
    // List of products within the line
    {
      '@type': 'ItemList',
      name: `${data.value.title} – Products`,
      itemListOrder: 'https://schema.org/ItemListOrderAscending',
      numberOfItems: items.length,
      itemListElement: items,
    },
  ]
})


const images = computed<ImageMediaItem[]>(() => {
  const imageArray = [];
  if (data.value) {
    if (data.value.heroImage) {
      imageArray.push(data.value.heroImage);
    }
    if (data.value.additionalImages) {
      imageArray.push(...data.value.additionalImages);
    }
  }
  return imageArray;
});
</script>

<template>
  <PageDataGate :sources="[{ data, pending, error, refresh }]">
    <div v-if="data">
      <Heading
        :text="`${data.title} ${data.product_category_title}`"
        heading-level="h1"
        text-alignment="center"
        class="mt-12 md:mt-24"
      />
      <p class="text-center italic">Scroll down to view individual products</p>
      <MaxWidthContentWrapper>
        <div class="flex flex-col md:flex-row gap-10 my-8">
          <ImageCarousel
            :images="images"
            class="w-full md:w-1/2"
            :show-thumbnails="true"
            :loop="true"
            image-classes="rounded-2xl overflow-hidden"
          />
          <WysiwygRenderer
            :content="data.long_description"
            class="w-full md:w-1/2"
          />
        </div>
      </MaxWidthContentWrapper>

      <Heading
        text="Products"
        heading-level="h2"
        text-alignment="center"
        class="mt-12"
      />
      <MaxWidthContentWrapper>
        <CardGallery class="my-8">
          <ProductCard
            v-for="product in data.products"
            :key="product.slug"
            class="h-full"
            :heroImage="product.heroImage"
            :title="product.title"
            :description="product.short_description"
            :link="
              product.override_page_url
                ? product.override_page_url
                : `/products/${product.slug}`
            "
          />
        </CardGallery>
      </MaxWidthContentWrapper>
    </div>
  </PageDataGate>
</template>
