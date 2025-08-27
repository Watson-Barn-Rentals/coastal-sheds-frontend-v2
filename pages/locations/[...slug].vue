<script lang="ts" setup>
import { getLocationItem } from '~/services/api/get-location-item'
import { getFormattedPhoneNumber } from '~/services/get-formatted-phone-number'
import { getGoogleMapsLinkForAddress } from '~/services/get-google-maps-link-for-address'
import type { LocationItem } from '~/types/location-item'


definePageMeta({
  key: route => route.fullPath, // remount on path change
  layout: 'default',
})

const route = useRoute()
const slug = computed(() => route.params.slug as string)

const { data, pending, error } = await useAsyncData<LocationItem>(
  () => `location-${slug.value}`,     // key depends on slug
  () => getLocationItem(slug.value),   // fetch depends on slug
  { watch: [slug] }                           // re-fetch when slug changes
)

// Set SEO reactively based on fetched data
useSeoMeta({
  title: () =>
    data.value?.title
      ? `${data.value.title} Location Details`
      : 'Location Details',
  description: () => data.value?.shortDescription ?? '',
})

</script>

<template>
    <Heading 
      class="mt-12 md:mt-24" 
      :text="`${data?.title ?? ''} Location`" 
      heading-level="h1"
      text-alignment="center"
    />
    <MaxWidthContentWrapper 
      v-if="data"
    >
      <div class="flex flex-col gap-8 my-8">
        <iframe
          :src="data.googleMapsEmbedUrl"
          class="w-full aspect-[1/1] sm:aspect-[2/1] lg:aspect-[3/1]"
        />
        <div class="flex flex-col md:flex-row gap-8">
          <ResponsiveImage
            :image-media-item="data.heroImage"
            class="w-full md:w-1/2"
          />
          <div class="w-full md:w-1/2 flex flex-col">
            <WysiwygRenderer v-if="data" :content="data.longDescription" />
          </div>
        </div>
        <div class="flex flex-col md:flex-row gap-8">          
          <div class="w-full md:w-1/2 flex flex-col gap-4 text-lg">
            <div class="flex gap-2">
              <span class="font-bold">Address:</span>
              <NuxtLink 
                target="_blank"
                :to="getGoogleMapsLinkForAddress(data.address, data.city, data.state, data.zip)"
                class="text-hovered-link underline"
              >{{ data.address }}, {{ data.city }}, {{ data.state }}, {{ data.zip }}</NuxtLink>
            </div>
            <div class="flex gap-2">
              <span class="font-bold">Phone Number:</span>
              <NuxtLink 
                :to="`tel:${data.phone}`"
                class="text-hovered-link underline"
              >{{ getFormattedPhoneNumber(data.phone) }}</NuxtLink>
            </div>
            <div class="flex gap-2">
              <span class="font-bold">Email:</span>
              <NuxtLink 
                :to="`mailto:${data.email}`"
                class="text-hovered-link underline"
              >{{ data.email }}</NuxtLink>
            </div>
            <span class="font-bold text-center underline">Hours</span>
            <div class="flex flex-col gap-2">
              <div
                v-for="(hrs, day, i) in data.hours"
                :key="day"
                class="flex"
              >
                <span class="w-1/2 text-right shrink-0 italic">{{ day }}:</span>
                <span class="shrink-0 pl-2">{{ hrs }}</span>
              </div>
            </div>
            <NuxtLink to="/inventory" class="shrink-0 m">
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
                  View Inventory at this Location
                </p>
              </button>
            </NuxtLink>
          </div>
          <div class="w-full md:w-1/2 flex flex-col gap-4">
            <p class="text-2xl text-center">Sales Reps</p>
            <div class="flex flex-wrap gap-8 justify-center">
              <div
                v-for="(salesRep, salesRepIndex) in data.salesReps"
                :key="salesRepIndex"
                class="w-48"
              >
                <div class="aspect-square">
                  <ResponsiveImage
                    :image-media-item="salesRep.profilePicture"
                    class="rounded-full"
                  />
                </div>
                <p class="text-center text-lg font-bold">{{ salesRep.name }}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </MaxWidthContentWrapper>
</template>
