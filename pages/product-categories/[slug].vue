<script lang="ts" setup>
import CardGallery from "~/components/card-gallery.vue";
import { getProductCategoryItem } from "~/services/api/get-product-category-item";
import type { ImageMediaItem } from "~/types/image-media-item";
import type { ProductCategoryItem } from "~/types/product-category-item";

definePageMeta({
  key: (route) => route.fullPath, // remount on path change
  layout: "default",
});

const config = useRuntimeConfig()
const route = useRoute();
const slug = computed(() => route.params.slug as string);

const { data, pending, error, refresh } =
  await useAsyncData<ProductCategoryItem>(
    () => `product-category-${slug.value}`, // key depends on slug
    () => getProductCategoryItem(slug.value), // fetch depends on slug
    { watch: [slug] } // re-fetch when slug changes
  );

const canonicalUrl = computed(
  () => `${config.public.siteRootUrl}/product-categories/${slug.value}/`
);

// Convenient hero getters
const hero = computed(() => data.value?.heroImage ?? null)
const heroAbsUrl = computed(() => {
  const u = hero.value?.original_url
  if (!u) return undefined
  return u.startsWith('http') ? u : new URL(u, config.public.siteRootUrl).toString()
})

// Preconnect / preload & canonical
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

  // Useful OG explicit type (avoid TS union issues): use "website" for category landing pages
  const meta = [{ property: 'og:type', content: 'website' }]

  return { link: links, meta }
})

// Meta tags
useSeoMeta({
  title: () => {
    const name = data.value?.title ?? 'Product Category'
    const brand = config.public.pageTitleSiteName || ''
    return brand ? `${name} | ${brand}` : name
  },
  // Keep ~150–160 chars; include short description and a soft CTA
  description: () => {
    if (!data.value) return ''
    const base = data.value.short_description?.trim() || ''
    const extra = 'Explore models, sizes, and options.'
    const full = [base, extra].filter(Boolean).join(' ')
    return full.slice(0, 158)
  },

  // Open Graph
  ogTitle: () => data.value?.title ?? 'Product Category',
  ogDescription: () => data.value?.short_description ?? '',
  ogUrl: () => canonicalUrl.value,
  ogImage: () => heroAbsUrl.value,
  ogImageAlt: () =>
    (hero.value?.alt || `${data.value?.title ?? 'Category'} image`) as any,

  // Twitter
  twitterCard: () => (heroAbsUrl.value ? 'summary_large_image' : 'summary'),
  twitterTitle: () => data.value?.title ?? 'Product Category',
  twitterDescription: () => data.value?.short_description ?? '',
  twitterImage: () => heroAbsUrl.value,

  // Noindex guard when there’s nothing to show
  robots: () => (data.value && data.value.product_lines?.length ? 'index, follow' : 'noindex, follow'),
})

// Schema.org
useSchemaOrg(() => {
  if (!data.value) return []

  const list = (data.value.product_lines || []).map((pl, idx) => {
    const url = pl.override_page_url || new URL(`/product-lines/${pl.slug}`, config.public.siteRootUrl).toString()
    return {
      '@type': 'ListItem',
      position: idx + 1,
      item: {
        '@type': 'Thing',
        name: pl.title,
        description: pl.short_description,
        url,
        image: pl.heroImage?.original_url,
      },
    }
  })

  return [
    defineWebPage({
      '@type': 'CollectionPage',
      name: data.value.title,
      description: data.value.short_description,
      url: canonicalUrl.value,
      inLanguage: 'en-US',
    }),
    defineBreadcrumb({
      itemListElement: [
        { name: 'Home', item: config.public.siteRootUrl },
        { name: 'Products', item: new URL('/products', config.public.siteRootUrl).toString() },
        { name: data.value.title, item: canonicalUrl.value },
      ],
    }),
    {
      '@type': 'ItemList',
      name: `${data.value.title} – Product Lines`,
      itemListOrder: 'https://schema.org/ItemListOrderAscending',
      numberOfItems: list.length,
      itemListElement: list,
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
        :text="data.title"
        heading-level="h1"
        text-alignment="center"
        class="mt-12 md:mt-24"
      />
      <p class="text-center italic">Scroll down to view product lines</p>
      <MaxWidthContentWrapper>
        <div class="flex flex-col md:flex-row gap-8 my-8">
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
        text="Product Lines"
        heading-level="h2"
        text-alignment="center"
        class="mt-10 mb-6"
      />
      <MaxWidthContentWrapper>
        <CardGallery class="my-8">
          <ProductCard
            v-for="productLine in data.product_lines"
            :key="productLine.slug"
            class="h-full"
            :heroImage="productLine.heroImage"
            :title="productLine.title"
            :description="productLine.short_description"
            :link="
              productLine.override_page_url
                ? productLine.override_page_url
                : `/product-lines/${productLine.slug}`
            "
          />
        </CardGallery>
      </MaxWidthContentWrapper>
      <div class="flex justify-center flex-col sm:flex-row gap-10 mx-10 my-20">
        <div class="flex justify-center">
          <AppLink to="/products" class="shrink-0">
            <button
              class="flex gap-2 p-3 rounded-lg text-white bg-brand shadow-lg hover:-translate-y-1 hover:shadow-xl transition-all duration-300 ease-in-out group cursor-pointer"
            >
              <UIcon
                name="icon-park-outline:back"
                dynamic
                class="h-6 w-6 my-auto sm:h-8 sm:w-8 text-white"
              />
              <p
                class="font-title select-none text-white font-semibold text-sm sm:text-base my-auto shrink-0"
              >
                Back to All Products
              </p>
            </button>
          </AppLink>
        </div>
        <div class="flex flex-col">
          <p class="font-semibold text-center">
            Didn't find what you are looking for?
          </p>
          <p class="text-sm text-center">
            Explore our other products and services, or give us a call and speak
            to our customer support team!
          </p>
        </div>
      </div>
    </div>
  </PageDataGate>
</template>
