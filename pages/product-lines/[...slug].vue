<script lang="ts" setup>
import CardGallery from '~/components/card-gallery.vue'
import MaxWidthContentWrapper from '~/components/max-width-content-wrapper.vue'
import { getProductLineItem } from '~/services/api/get-product-line-item'
import type { ImageMediaItem } from '~/types/image-media-item'
import type { ProductLineItem } from '~/types/product-line-item'

definePageMeta({
  key: route => route.fullPath, // remount on path change
  layout: 'default',
})

const route = useRoute()
const slug = computed(() => route.params.slug as string)

const { data, pending, error } = await useAsyncData<ProductLineItem>(
  () => `product-category-${slug.value}`,     // key depends on slug
  () => getProductLineItem(slug.value),   // fetch depends on slug
  { watch: [slug] }                           // re-fetch when slug changes
)

// Set SEO reactively based on fetched data
useSeoMeta({
  title: () =>
    data.value?.title
      ? `${data.value.title} Product Line Details`
      : 'Product Line Details',
  description: () => data.value?.short_description ?? '',
})

const images = computed<ImageMediaItem[]>(() => {
  const imageArray = []
  if (data.value) {
    if (data.value.heroImage) {
      imageArray.push(data.value.heroImage)
    }
    if (data.value.additionalImages) {
      imageArray.push(...data.value.additionalImages)
    }
  }
  return imageArray
})

</script>

<template>
    <Heading 
      :text="`${data?.title ?? ''} ${data?.product_category_title}`" 
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
        <WysiwygRenderer v-if="data" :content="data.long_description" class="w-full md:w-1/2 " />
      </div>
    </MaxWidthContentWrapper>

    <Heading 
      text="Products" 
      heading-level="h2"
      text-alignment="center"
      class="mt-12"
    />
    <MaxWidthContentWrapper v-if="data">
      <CardGallery class="my-8">
        <ProductCard
          v-for="product in data.products"
          :key="product.slug"
          class="h-full"
          :heroImage="product.heroImage"
          :title="product.title"
          :description="product.short_description"
          :link="product.override_page_url ? product.override_page_url : `/products/${product.slug}`"
        />
      </CardGallery>
    </MaxWidthContentWrapper>
</template>
