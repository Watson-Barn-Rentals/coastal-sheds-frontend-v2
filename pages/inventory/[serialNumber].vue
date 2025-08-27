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
      <Heading 
          class="mt-12 md:mt-24" 
          :text="`${data!.usedBuilding ? 'Used' : 'New'} ${data!.size} ${data!.product.title} Shed`" 
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
          <h3 class="font-bold font-title text-lg">Building Details</h3>
          <div class="flex gap-2">
              <span class="font-bold">Size:</span>
              <span>{{ data!.size }}</span>
          </div>
            <WysiwygRenderer :content="data!.description" class="mt-4" />
          </div>
        </div>
      </MaxWidthContentWrapper>
    </PageDataGate>
</template>