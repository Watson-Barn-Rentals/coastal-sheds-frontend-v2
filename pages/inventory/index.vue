<script lang="ts" setup>
import type { Ref } from "vue";
import { getInventoryList } from "~/services/api/get-inventory-list";
import type { InventoryItem } from "~/types/inventory-item";
import {
  getDrivingDistances,
  getUserPosition,
  type DistanceResult,
} from "~/services/google-maps";
import type { LocationsMapSettings } from "~/types/locations-map-settings";
import { getLocationsMapSettings } from "~/services/api/get-locations-map-settings";

definePageMeta({ layout: "default", key: "inventory-page" });

const config = useRuntimeConfig();
const route = useRoute();

const { data, pending, error, refresh } = await useAsyncData<InventoryItem[]>(
  "inventory-list",
  getInventoryList
);
const {
  data: mapSettings,
  pending: mapPending,
  error: mapError,
  refresh: mapRefresh,
} = await useAsyncData<LocationsMapSettings>(
  "locations-map-settings",
  getLocationsMapSettings
);

/* ---------------- SEO: canonical, description, OG/Twitter ---------------- */

const canonicalUrl = computed(
  () => `${config.public.siteRootUrl}/inventory`
);

// Short, keyword-rich description for a listing page
const pageDescription = computed(() => {
  return `Browse in-stock sheds by size, model, price, and location. Real-time availability, delivery options, and financing.`;
});

// First hero image to improve LCP/link unfurls
const firstItem = computed(() => (data.value?.length ? data.value[0] : null));
const firstHero = computed(() => firstItem.value?.heroImage ?? null);
const ogImageUrl = computed(() => {
  const u = firstHero.value?.original_url;
  if (!u) return undefined;
  return u.startsWith("http")
    ? u
    : new URL(u, config.public.siteRootUrl).toString();
});
const ogImageAlt = computed(() =>
  firstItem.value
    ? `${firstItem.value.size} ${firstItem.value.product.title}`
    : "Inventory"
);
const ogImageWidth = computed(() => firstHero.value?.width);
const ogImageHeight = computed(() => firstHero.value?.height);

useHead(() => {
  const links: any[] = [{ rel: "canonical", href: canonicalUrl.value }];

  // Preconnect/dns-prefetch to the first image origin (reduce handshake time)
  if (firstHero.value?.original_url) {
    try {
      const origin = new URL(firstHero.value.original_url).origin;
      links.push({ rel: "preconnect", href: origin, crossorigin: "" });
      links.push({ rel: "dns-prefetch", href: origin });
      // Preload LCP candidate
      links.push({
        rel: "preload",
        as: "image",
        href: firstHero.value.original_url,
        imagesrcset: firstHero.value.srcset,
        imagesizes: "100vw",
        fetchpriority: "high",
      });
    } catch {}
  }

  // If you want to force og:type=website explicitly (avoid TS union complaints)
  const meta: any[] = [{ property: "og:type", content: "website" }];

  return { link: links, meta };
});

useSeoMeta({
  title: `Browse In-Stock Inventory - ${config.public.pageTitleSiteName}`,
  description: () => pageDescription.value,
  ogTitle: `Browse In-Stock Inventory - ${config.public.pageTitleSiteName}`,
  ogDescription: () => pageDescription.value,
  ogUrl: () => canonicalUrl.value,
  ogImage: () => ogImageUrl.value,
  ogImageAlt: () => ogImageAlt.value as any,
  ogImageWidth: () => ogImageWidth.value as any,
  ogImageHeight: () => ogImageHeight.value as any,
  twitterCard: () => (ogImageUrl.value ? "summary_large_image" : "summary"),
  twitterTitle: "Browse Inventory",
  twitterDescription: () => pageDescription.value,
  twitterImage: () => ogImageUrl.value,
});

/* ---------------- Schema.org ---------------- */

useSchemaOrg(() => {
  const items = (data.value ?? []).slice(0, 24); // cap to avoid huge JSON-LD
  return [
    defineWebPage({
      "@type": "CollectionPage",
      name: "Browse Inventory",
      description: pageDescription.value,
      url: canonicalUrl.value,
    }),
    defineBreadcrumb({
      itemListElement: [
        { name: "Home", item: config.public.siteRootUrl },
        { name: "Inventory", item: canonicalUrl.value },
      ],
    }),
    defineItemList({
      name: "Inventory List",
      numberOfItems: items.length,
      itemListElement: items.map((it, idx) => ({
        "@type": "ListItem",
        position: idx + 1,
        url: new URL(
          `/inventory/${encodeURIComponent(it.serialNumber)}`,
          config.public.siteRootUrl
        ).toString(),
        name: `${it.usedBuilding ? "Used" : "New"} ${it.size} ${
          it.product.title
        }`,
      })),
    }),
  ];
});

/** Distance cache */
const locationDistanceBySlug = ref<Record<string, DistanceResult | null>>({});
const distanceError = ref<string | null>(null);
const computingDistances = ref(false);

function formatDriveTime(seconds: number): string {
  const mins = Math.round(seconds / 60);
  if (mins < 60) return `${mins} min`;
  const h = Math.floor(mins / 60);
  const m = mins % 60;
  return m ? `${h} hr ${m} min` : `${h} hr`;
}

const driveTimeTextBySlug = computed<Record<string, string>>(() => {
  const out: Record<string, string> = {};
  for (const [slug, res] of Object.entries(locationDistanceBySlug.value)) {
    if (res && typeof res.seconds === "number")
      out[slug] = formatDriveTime(res.seconds);
  }
  return out;
});

/** Meters map for distance sort */
const distanceMetersByLocationSlug = computed<Record<string, number | null>>(
  () =>
    Object.fromEntries(
      Object.entries(locationDistanceBySlug.value).map(([slug, res]) => [
        slug,
        res?.meters ?? null,
      ])
    )
);

const {
  state: filters,
  filtered,
  sorted,
  sortMode,
  productCategoryOptions,
  productLineOptions,
  productOptions,
  sizeOptions,
  locationOptions,
  regionOptions,
  chips,
  clearChip,
  reset,
} = useInventoryFilters(data as Ref<InventoryItem[] | null>, {
  distanceMetersByLocationSlug,
});

/** Mobile filters toggle */
const filtersOpen = ref(false);

/** Helpers for distances */
function collectUniqueDestinations(items: InventoryItem[]) {
  const map = new Map<string, { lat: number; lng: number }>();
  for (const item of items) {
    const slug = item?.location?.slug;
    const lat = Number(
      (item as any)?.location?.latitude ?? (item as any)?.location?.lat
    );
    const lng = Number(
      (item as any)?.location?.longitude ?? (item as any)?.location?.lng
    );
    if (
      slug &&
      Number.isFinite(lat) &&
      Number.isFinite(lng) &&
      !map.has(slug)
    ) {
      map.set(slug, { lat, lng });
    }
  }
  return map;
}

async function ensureDistances() {
  if (import.meta.server) return;
  try {
    computingDistances.value = true;
    distanceError.value = null;

    const items = filtered.value;
    if (!items.length) return;

    const unique = collectUniqueDestinations(items);
    if (!unique.size) return;

    const missing = [...unique.keys()].filter(
      (slug) => !(slug in locationDistanceBySlug.value)
    );
    if (!missing.length) return;

    if (!mapSettings.value?.api_key) {
      distanceError.value = "Missing Google Routes API key.";
      return;
    }

    const position = await getUserPosition();
    const origin = {
      lat: position.coords.latitude,
      lng: position.coords.longitude,
    };
    const destinations = [...unique.values()];
    const results = await getDrivingDistances(
      mapSettings.value.api_key,
      origin,
      destinations,
      "imperial"
    );

    const next: Record<string, DistanceResult | null> = {
      ...locationDistanceBySlug.value,
    };
    let i = 0;
    for (const slug of unique.keys()) next[slug] = results[i++] ?? null;
    locationDistanceBySlug.value = next;
  } catch (err: any) {
    distanceError.value = err?.message || "Failed to compute distances.";
  } finally {
    computingDistances.value = false;
  }
}

/** Kick off distance calc only when needed */
watch(sortMode, async (m) => {
  if (m === "distance-from-user") await ensureDistances();
});
watch(filtered, async () => {
  if (sortMode.value === "distance-from-user") await ensureDistances();
});

/** Smooth scroll to filters */
const scrollToFilters = () => {
  const el = document.getElementById("filters-section");
  if (!el) return;
  filtersOpen.value = true;
  const targetY = Math.max(
    0,
    el.getBoundingClientRect().top + window.pageYOffset - 84
  );
  window.scrollTo({ top: targetY, behavior: "smooth" });
};

/** Null-safe counts for the template (no Volar complaints) */
const totalCount = computed(() => data.value?.length ?? 0);
const hiddenByFilters = computed(() =>
  Math.max(0, totalCount.value - filtered.value.length)
);
</script>

<template>
  <PageDataGate
    :sources="[
      { data, pending, error, refresh },
      {
        data: mapSettings,
        pending: mapPending,
        error: mapError,
        refresh: mapRefresh,
      },
    ]"
  >
    <div v-if="data && mapSettings">
      <Heading
        text="Browse In-Stock Inventory"
        heading-level="h1"
        text-alignment="center"
        class="mt-12 md:mt-24 mb-8"
      />

      <MaxWidthContentWrapper>
        <div id="filters-section" class="mb-8">
          <button
            type="button"
            class="w-full rounded-xl border px-3 py-2 bg-background-accent dark:bg-background-accent-dark cursor-pointer"
            @click="filtersOpen = !filtersOpen"
          >
            <span class="font-semibold"
              >{{ filtersOpen ? "Hide" : "Show" }} Filters</span
            >
            <span v-if="chips.length > 0" class="font-semibold pl-1">
              ({{ chips.length }}
              {{ chips.length === 1 ? "Filter" : "Filters" }} Applied)
            </span>
          </button>

          <transition name="fade">
            <div v-show="filtersOpen" class="mt-3">
              <InventoryFilters
                v-model:filters="filters"
                :product-category-options="productCategoryOptions"
                :product-line-options="productLineOptions"
                :product-options="productOptions"
                :size-options="sizeOptions"
                :location-options="locationOptions"
                :region-options="regionOptions"
                :chips="chips"
                @clear-chip="clearChip"
                @reset="reset"
              />
            </div>
          </transition>
        </div>

        <!-- Sort bar (below filters) -->
        <div
          class="mt-4 flex flex-col gap-2 md:flex-row md:items-center md:justify-between"
        >
          <div class="flex items-center gap-2">
            <UiSelect
              v-model="sortMode"
              :options="[
                { value: 'price-ascending', label: 'Price (low → high)' },
                { value: 'price-descending', label: 'Price (high → low)' },
                { value: 'product-name', label: 'Product (A → Z)' },
                { value: 'size-ascending', label: 'Size (small → large)' },
                { value: 'size-descending', label: 'Size (large → small)' },
                { value: 'distance-from-user', label: 'Distance from you' },
              ]"
              label="Sort by"
              :showBlank="false"
            />
          </div>

          <p
            v-if="sortMode === 'distance-from-user' && distanceError"
            class="text-sm text-red-600"
          >
            {{ distanceError }}
          </p>
          <p
            v-else-if="sortMode === 'distance-from-user' && computingDistances"
            class="text-sm opacity-70"
          >
            Calculating driving times…
          </p>
        </div>

        <CardGallery class="my-8">
          <InventoryCard
            v-for="inventoryItem in sorted"
            :key="inventoryItem.serialNumber"
            :hero-image="inventoryItem.heroImage"
            :serial-number="inventoryItem.serialNumber"
            :size="inventoryItem.size"
            :product-line-title="inventoryItem.product?.product_line_title"
            :product-title="inventoryItem.product?.title"
            :cash-price="inventoryItem.cashPrice"
            :discount-amount="inventoryItem.discountAmount"
            :location-name="inventoryItem.location?.title"
            :lot-number="inventoryItem.lotNumber"
            :highlighted-label="inventoryItem.highlightedLabel"
            :used-building="inventoryItem.usedBuilding"
            :approx-drive-time-text="
              driveTimeTextBySlug[inventoryItem.location?.slug ?? ''] ?? null
            "
            :location-address="inventoryItem.location.address"
            :location-city="inventoryItem.location.city"
            :location-state="inventoryItem.location.state"
            :location-zip="inventoryItem.location.zip"
          />

          <!-- Empty state -->
          <NoItemsCard
            v-if="filtered.length === 0"
            message="No Inventory to Display"
          />

          <!-- Hidden-by-filters notice (no direct `data` access needed) -->
          <div
            v-if="hiddenByFilters > 0"
            class="group flex h-full flex-col gap-8 overflow-hidden rounded-2xl bg-background-accent shadow-lg transition-all duration-200 hover:scale-105 hover:shadow-xl dark:bg-background-accent-dark p-8 justify-center"
          >
            <p class="text-center text-xl">
              {{ hiddenByFilters }}
              {{ hiddenByFilters === 1 ? "Item" : "Items" }} Hidden by Filters
            </p>
            <button
              class="bg-brand text-white p-2 mx-auto rounded-lg flex gap-1 cursor-pointer transition-all duration-150 hover:scale-105"
              @click="scrollToFilters"
            >
              <UIcon name="solar:arrow-up-broken" class="w-6 h-6 my-auto" />
              <span class="my-auto">Jump to Filters</span>
            </button>
          </div>
        </CardGallery>
      </MaxWidthContentWrapper>
    </div>
  </PageDataGate>
</template>

<style scoped>
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.15s ease;
}
.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
</style>
