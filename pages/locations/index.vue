<script lang="ts" setup>
import { nextTick } from 'vue'
import { getLocationsList } from '~/services/api/get-locations-list'
import { getLocationsMapSettings } from '~/services/api/get-locations-map-settings'
import { createMap, addMarkers, getDrivingDistances, getUserPosition, type MapMarkerInput } from '~/services/google-maps'
import type { LocationItem } from '~/types/location-item'
import type { LocationsMapSettings } from '~/types/locations-map-settings'

definePageMeta({ layout: 'default', key: r => r.fullPath })
useSeoMeta({ title: 'Browse Locations', description: 'Browse our locations' })

const { data } = await useAsyncData<LocationItem[]>('locations-list', getLocationsList)
const { data: mapSettings } = await useAsyncData<LocationsMapSettings>('locations-map-settings', getLocationsMapSettings)

const mapEl = ref<HTMLElement | null>(null)
const map = ref<google.maps.Map | null>(null)
const initialized = ref(false)

// 👇 real DOM anchor to scroll to (for cards only)
const cardsSection = ref<HTMLDivElement | null>(null)

/** distance + duration per slug */
const travel = ref<Record<string, {
  distanceMeters: number
  distanceText: string
  durationSeconds: number
  durationText: string
}>>({})

const isLocating = ref(false)
const locateError = ref<string | null>(null)

// 👇 NEW: map loading indicator
const isMapLoading = ref(true)

// Has at least one ETA computed?
const hasETAs = computed(() =>
  Object.values(travel.value).some(v => Number.isFinite(v?.durationSeconds))
)

// Sort locations by ETA (missing ETAs go last)
const sortedLocations = computed<LocationItem[]>(() => {
  const list = [...(data.value ?? [])]
  return list.sort((a, b) => {
    const aT = travel.value[a.slug]?.durationSeconds ?? Number.POSITIVE_INFINITY
    const bT = travel.value[b.slug]?.durationSeconds ?? Number.POSITIVE_INFINITY
    if (aT === bT) return a.title.localeCompare(b.title)
    return aT - bT
  })
})

const initMap = async () => {
  if (!mapEl.value || !mapSettings.value || initialized.value) return
  initialized.value = true
  isMapLoading.value = true

  try {
    map.value = await createMap({
      element: mapEl.value,
      apiKey: mapSettings.value.api_key,
      center: { lat: Number(mapSettings.value.center_latitude), lng: Number(mapSettings.value.center_longitude) },
      zoom: Number(mapSettings.value.zoom_level),
      markersInteractOnly: true,
    })

    const markers: MapMarkerInput[] = (data.value ?? [])
      .filter(l => Number.isFinite(Number((l as any).latitude)) && Number.isFinite(Number((l as any).longitude)))
      .map(l => ({
        position: { lat: Number((l as any).latitude), lng: Number((l as any).longitude) },
        url: `/locations/${l.slug}`,
        label: l.title,
      }))

    addMarkers(map.value, markers)

    // Hide loader on first idle (tiles rendered)
    if (window.google?.maps?.event && map.value) {
      google.maps.event.addListenerOnce(map.value, 'idle', () => {
        isMapLoading.value = false
      })
      // Fallback in case 'idle' doesn't fire quickly
      setTimeout(() => { isMapLoading.value = false }, 2500)
    } else {
      isMapLoading.value = false
    }
  } catch (e) {
    // If anything fails, remove loader and optionally show an error state
    isMapLoading.value = false
    console.error('Map init failed:', e)
  }
}

onMounted(() => {
  initMap()
  watch(mapEl, initMap)
  watch(mapSettings, initMap)
})

function secondsToHuman(seconds: number): string {
  const mins = Math.round(seconds / 60)
  const h = Math.floor(mins / 60)
  const m = mins % 60
  return h ? `${h} hr ${m} min` : `${m} min`
}

function scrollToCards() {
  const el = cardsSection.value
  if (!el) return
  const y = el.getBoundingClientRect().top + window.scrollY - 80 // adjust for sticky header
  window.scrollTo({ top: y, behavior: 'smooth' })
}

const handleFindNearestClick = async () => {
  if (isLocating.value || !mapSettings.value) return
  isLocating.value = true
  locateError.value = null
  try {
    const pos = await getUserPosition()
    const origin = { lat: pos.coords.latitude, lng: pos.coords.longitude }

    const dests = (data.value ?? [])
      .filter(l => Number.isFinite(Number((l as any).latitude)) && Number.isFinite(Number((l as any).longitude)))
      .map(l => ({ slug: l.slug, lat: Number((l as any).latitude), lng: Number((l as any).longitude) }))

    const results = await getDrivingDistances(
      mapSettings.value.api_key,
      origin,
      dests.map(d => ({ lat: d.lat, lng: d.lng })),
      'imperial',
    )

    const out: typeof travel.value = {}
    results.forEach((res, i) => {
      const slug = dests[i].slug
      if (res) {
        out[slug] = {
          distanceMeters: res.meters,
          distanceText: res.text,
          durationSeconds: res.seconds,
          durationText: secondsToHuman(res.seconds),
        }
      }
    })
    travel.value = out

    // After ETAs populate and sort updates, scroll to the cards (NOT the map)
    await nextTick()
    requestAnimationFrame(scrollToCards)
  } catch (e: any) {
    locateError.value = e?.message ?? 'Unable to get your location.'
  } finally {
    isLocating.value = false
  }
}
</script>

<template>
  <Heading text="Browse Locations" heading-level="h1" text-alignment="center" class="mt-12 md:mt-24" />
  <p class="text-center text-lg md:text-xl mb-8 mt-4">Click on one of the mapped locations or scroll down to see the full list of locations.</p>
  <MaxWidthContentWrapper v-if="data && mapSettings" class="my-8">
    <!-- Relative wrapper to hold map + overlay without affecting layout or scrolling -->
    <div class="relative w-full aspect-[1/1] sm:aspect-[2/1] lg:aspect-[3/1] min-h-[320px]">
      <!-- The map itself (absolute to avoid layout shifts) -->
      <div ref="mapEl" class="absolute inset-0" tabindex="-1" aria-label="Locations map"></div>

      <!-- Loading overlay -->
      <div
        v-show="isMapLoading"
        class="absolute inset-0 flex items-center justify-center bg-neutral-100/70 dark:bg-neutral-900/50"
      >
        <div class="flex items-center gap-3">
          <span class="inline-block h-5 w-5 animate-spin rounded-full border-2 border-current border-t-transparent"></span>
          <span class="text-sm font-medium">Loading map…</span>
        </div>
      </div>
    </div>
  </MaxWidthContentWrapper>

  <div class="flex flex-col md:flex-row justify-center gap-10 mx-10 my-20">
    <button
      type="button"
      @click="handleFindNearestClick"
      :disabled="isLocating"
      class="mx-auto md:mx-0 flex gap-2 p-3 rounded-lg text-white bg-brand shadow-lg hover:-translate-y-1 hover:shadow-xl transition-all duration-300 ease-in-out group cursor-pointer disabled:opacity-60 disabled:cursor-not-allowed"
    >
      <UIcon name="grommet-icons:map" dynamic class="h-6 w-6 my-auto sm:h-8 sm:w-8 text-white" />
      <p class="font-title select-none text-white font-semibold text-sm sm:text-base my-auto shrink-0">
        {{ isLocating ? 'Locating…' : 'Find The Closest Location' }}
      </p>
    </button>

    <div class="flex flex-col max-w-[46ch]">
      <p class="font-semibold text-center">Find the location closest to you</p>
      <p class="text-sm text-center">You will need to allow the site to access your location to find the nearest locations.</p>
      <p v-if="locateError" class="text-sm text-red-600 mt-2 text-center">{{ locateError }}</p>
    </div>
  </div>

  <!-- Cards (we only scroll to here after locating/ETAs computed) -->
  <MaxWidthContentWrapper>
    <div ref="cardsSection">
      <CardGallery class="my-8">
        <LocationCard
          v-for="(location, locationIndex) in sortedLocations"
          :key="location.slug"
          class="h-full"
          :heroImage="location.heroImage"
          :slug="location.slug"
          :title="location.title"
          :address="location.address"
          :city="location.city"
          :state="location.state"
          :zip="location.zip"
          :shortDescription="location.shortDescription"
          :distanceText="travel[location.slug]?.distanceText || ''"
          :estimated-driving-time="travel[location.slug]?.durationText || ''"
          :closest-location="hasETAs && locationIndex === 0"
        />
        <NoItemsCard v-if="sortedLocations.length === 0" message="No Locations to Display" />
      </CardGallery>
    </div>
  </MaxWidthContentWrapper>
</template>
