<script lang="ts" setup>
import { getInventoryItem } from '~/services/api/get-inventory-item';
import { formatPrice } from '~/services/format-price';
import type { ImageMediaItem } from '~/types/image-media-item';
import type { InventoryItem } from '~/types/inventory-item';

definePageMeta({ layout: 'default', key: r => r.fullPath })

const route = useRoute();
const serialNumber = computed(() => route.params.serialNumber as string)

const { data, pending, error, refresh } = await useAsyncData<InventoryItem>(
  () => `inventory-item:${serialNumber.value}`,
  () => getInventoryItem(serialNumber.value),
  { watch: [serialNumber] }
)

const isTextInventoryItemSlideoverOpen = ref(false)

const seoDescription = computed(() => {
  const item = data.value
  if (!item) return ''

  const {
    size,
    product,
    usedBuilding,
    cashPrice,
    discountAmount,
    location,
  } = item

  const price = Math.max(0, cashPrice - (discountAmount ?? 0))
  const priceText = formatPrice(price)
  const savingsText = discountAmount ? ` (was ${formatPrice(cashPrice)}, save ${formatPrice(discountAmount)})` : ''
  const conditionText = usedBuilding ? 'Used' : 'New'
  const title = product?.title || 'storage shed'
  const city = location?.city || ''
  const state = location?.state || ''
  const locText = city && state ? `${city}, ${state}` : city || state

  // Primary line (concise, keyworded, no newlines)
  let text =
    `${conditionText} ${size} ${title} shed for ${priceText}${savingsText}. ` +
    (locText ? `View in ${locText}. ` : '') +
    `Delivery & financing available.`

  // Normalize spaces
  text = text.replace(/\s+/g, ' ').trim()

  // Keep to ~160 chars, cut at word boundary
  const MAX = 160
  if (text.length <= MAX) return text
  return text.slice(0, MAX - 1).replace(/\s+\S*$/, '') + '…'
})


// Set SEO reactively based on fetched data
useSeoMeta({
  title: () =>
    data.value
      ? `${data.value.usedBuilding ? 'Used' : 'New'} ${data.value.size} ${data.value.product.title} Shed`
      : 'Inventory Item Details',
  description: () => seoDescription.value,
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
    <PageDataGate :sources="[{ data, pending, error, refresh }]">
      <div v-if=data>
        <Heading 
            class="mt-12 md:mt-24" 
            :text="`${data.usedBuilding ? 'Used' : 'New'} ${data.size} ${data.product.title}`" 
            heading-level="h1"
            text-alignment="center"
        />
        <MaxWidthContentWrapper>
          <div class="flex flex-col md:flex-row gap-8 my-8">
            <ImageCarousel 
              :images="images" 
              class="w-full md:w-1/2"
              :show-thumbnails="true" 
              :loop="true"
              image-classes="rounded-2xl overflow-hidden"
            />
            <div class="w-full md:w-1/2 flex flex-col">
              <div class="flex justify-center mb-4">
                  <button
                    class="flex gap-2 p-3 rounded-lg text-white bg-brand shadow-lg hover:-translate-y-1 hover:shadow-xl transition-all duration-300 ease-in-out group cursor-pointer"
                    @click="isTextInventoryItemSlideoverOpen = true"
                  >
                    <UIcon
                      name="eva:message-square-outline"
                      dynamic
                      class="h-6 w-6 my-auto sm:h-8 sm:w-8 text-white"
                    />
                    <p
                      class="font-title select-none text-white font-semibold text-sm sm:text-base my-auto shrink-0"
                    >
                      Send to my phone
                    </p>
                  </button>
              </div>
              <h3 class="font-bold font-title text-lg mb-2">Building Details</h3>
              <div class="flex flex-col gap-1 ml-4">
                <div class="flex gap-2">
                    <span class="font-bold">Price:</span>
                    <span :class="{ 'line-through': data.discountAmount }">{{ formatPrice(data.cashPrice) }}</span>
                    <span v-if="data.discountAmount" class="text-red-500">{{ formatPrice(data.cashPrice - data.discountAmount) }}</span>
                </div>
                <div class="flex gap-2">
                    <span class="font-bold">Status:</span>
                    <span>{{ data.usedBuilding ? 'Used' : 'New' }}</span>
                    <span v-if="data.usedBuilding" class="italic">**Used Buildings are sold in AS IS condition</span>
                </div>
                <div class="flex gap-2">
                    <span class="font-bold">Size:</span>
                    <span>{{ data.size }}</span>
                </div>
                <div class="flex gap-2">
                    <span class="font-bold">Product:</span>
                    <NuxtLink :to="`/products/${data.product.slug}`" class="text-hovered-link hover:underline">{{ data.product.title }}</NuxtLink>
                </div>
                <div class="flex gap-2">
                    <span class="font-bold">Product Line:</span>
                    <NuxtLink :to="`/product-lines/${data.product.product_line_slug}`" class="text-hovered-link hover:underline">{{ data.product.product_line_title }} {{ data.product.product_category_title }}</NuxtLink>
                </div>
                <div class="flex gap-2">
                    <span class="font-bold">Location:</span>
                    <NuxtLink :to="`/locations/${data.location.slug}`" class="text-hovered-link hover:underline">{{ data.location.title }} ({{ data.location.city }}, {{ data.location.state }})</NuxtLink>
                </div>
                <div class="flex gap-2">
                    <span class="font-bold">Serial Number:</span>
                    <span>{{ data.serialNumber }}</span>
                </div>
                <div class="flex gap-2">
                    <span class="font-bold">Lot Number:</span>
                    <span>{{ data.lotNumber ?? 'N/A' }}</span>
                </div>
              </div>
              <div>
                <h3 class="font-bold font-title text-lg mt-4 mb-2">Building Description</h3>
                <WysiwygRenderer :content="data.description" class="ml-4" />
              </div>
            </div>
          </div>
        </MaxWidthContentWrapper>
        <TextInventoryItemSlideover
          v-model:isMenuOpen="isTextInventoryItemSlideoverOpen"
          :serial-number="data.serialNumber"
        />
      </div>
    </PageDataGate>
</template>