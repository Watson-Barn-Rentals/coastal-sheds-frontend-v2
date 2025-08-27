<script lang="ts" setup>
import MaxWidthContentWrapper from '~/components/max-width-content-wrapper.vue'
import { getProductItem } from '~/services/api/get-product-item'
import type { ImageMediaItem } from '~/types/image-media-item'
import type { ProductItem } from '~/types/product-item'

definePageMeta({
  key: route => route.fullPath, // remount on path change
  layout: 'default',
})

const route = useRoute()
const slug = computed(() => route.params.slug as string)

const { data, pending, error } = await useAsyncData<ProductItem>(
  () => `product-category-${slug.value}`,     // key depends on slug
  () => getProductItem(slug.value),   // fetch depends on slug
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
      class="mt-12 md:mt-24" 
      :text="`${data?.product_line_title ?? ''} ${data?.title ?? ''}`" 
      heading-level="h1"
      text-alignment="center"
    />
    <MaxWidthContentWrapper>
      <div class="flex flex-col md:flex-row gap-10 my-8">
        <ImageCarousel 
          :images="images" 
          class="w-full md:w-1/2"
          :show-thumbnails="true" 
          :loop="true"
          image-classes="rounded-2xl overflow-hidden"
        />
        <div class="w-full md:w-1/2 flex flex-col">
          <WysiwygRenderer v-if="data" :content="data.long_description" />
  
          <div v-if="data?.designer_link" class="flex justify-center mt-10">
            <NuxtLink :to="data?.designer_link" class="shrink-0">
              <button
                class="flex gap-2 p-3 rounded-lg text-white bg-brand shadow-lg hover:-translate-y-1 hover:shadow-xl transition-all duration-300 ease-in-out group cursor-pointer"
              >
                <UIcon
                  name="tdesign:map-3d"
                  dynamic
                  class="h-6 w-6 my-auto sm:h-8 sm:w-8 text-white"
                />
                <p
                  class="font-title select-none text-white font-semibold text-sm sm:text-base my-auto shrink-0"
                >
                  Design this Product in 3D
                </p>
              </button>
            </NuxtLink>
          </div>
          <div class="flex justify-center mt-10">
            <NuxtLink :to="`/inventory?product=${data?.slug}`" class="shrink-0">
              <button
                class="flex gap-2 p-3 rounded-lg text-white bg-brand shadow-lg hover:-translate-y-1 hover:shadow-xl transition-all duration-300 ease-in-out group cursor-pointer"
              >
                <UIcon
                  name="material-symbols:event-list-rounded"
                  dynamic
                  class="h-6 w-6 my-auto sm:h-8 sm:w-8 text-white"
                />
                <p
                  class="font-title select-none text-white font-semibold text-sm sm:text-base my-auto shrink-0"
                >
                  View In Stock Items
                </p>
              </button>
            </NuxtLink>
          </div>
        </div>
      </div>
    </MaxWidthContentWrapper>
</template>
