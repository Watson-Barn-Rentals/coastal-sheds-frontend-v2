<script lang="ts" setup>
import { getInventoryItem } from "~/services/api/get-inventory-item";
import { formatPrice, formatRoundedPrice } from "~/services/format-price";
import { submitTrackingEvent } from "~/services/submit-tracking-event";
import type { ImageMediaItem } from "~/types/image-media-item";
import type { InventoryItem } from "~/types/inventory-item";

definePageMeta({ layout: "default", key: (r) => r.fullPath });

const config = useRuntimeConfig();
const route = useRoute();
const serialNumber = computed(() => route.params.serialNumber as string);

const { data, pending, error, refresh } = await useAsyncData<InventoryItem>(
  () => `inventory-item:${serialNumber.value}`,
  () => getInventoryItem(serialNumber.value),
  { watch: [serialNumber] }
);

const isTextInventoryItemSlideoverOpen = ref(false);

/* ---------- SEO helpers ---------- */
const canonicalUrl = computed(
  () =>
    `${config.public.siteRootUrl}/inventory/${encodeURIComponent(
      serialNumber.value
    )}`
);

function absolutize(url?: string) {
  if (!url) return undefined;
  return url.startsWith("http")
    ? url
    : new URL(url, config.public.siteRootUrl).toString();
}

const hero = computed(() => data.value?.heroImage ?? null);
const ogImageUrl = computed(() => absolutize(hero.value?.original_url));
const ogImageAlt = computed(
  () =>
    hero.value?.alt ||
    (data.value ? `${data.value.size} ${data.value.product.title}` : "")
);
const ogImageWidth = computed(() => hero.value?.width);
const ogImageHeight = computed(() => hero.value?.height);

const finalPrice = computed(() => {
  if (!data.value) return 0;
  return Math.max(0, data.value.cashPrice - (data.value.discountAmount ?? 0));
});

/** SEO description (~160 chars, keyword-rich) */
const seoDescription = computed(() => {
  const item = data.value;
  if (!item) return "";

  const { size, product, usedBuilding, cashPrice, discountAmount, location } =
    item;

  const price = Math.max(0, cashPrice - (discountAmount ?? 0));
  const priceText = formatPrice(price);
  const savingsText = discountAmount
    ? ` (was ${formatPrice(cashPrice)}, save ${formatPrice(discountAmount)})`
    : "";
  const conditionText = usedBuilding ? "Used" : "New";
  const title = product?.title || "storage shed";
  const city = location?.city || "";
  const state = location?.state || "";
  const locText = city && state ? `${city}, ${state}` : city || state;

  let text =
    `${conditionText} ${size} ${title} shed for ${priceText}${savingsText}. ` +
    (locText ? `View in ${locText}. ` : "") +
    `Delivery & financing available.`;

  text = text.replace(/\s+/g, " ").trim();
  const MAX = 160;
  return text.length <= MAX
    ? text
    : text.slice(0, MAX - 1).replace(/\s+\S*$/, "") + "…";
});

/* ---------- Head/meta ---------- */
useHead(() => {
  // Preconnect/dns-prefetch to the image CDN/origin + Preload LCP image
  const links: any[] = [{ rel: "canonical", href: canonicalUrl.value }];

  const origin = (() => {
    try {
      return hero.value?.original_url
        ? new URL(hero.value.original_url).origin
        : null;
    } catch {
      return null;
    }
  })();

  if (origin) {
    links.push({ rel: "preconnect", href: origin, crossorigin: "" });
    links.push({ rel: "dns-prefetch", href: origin });
  }

  if (hero.value?.original_url) {
    links.push({
      rel: "preload",
      as: "image",
      href: hero.value.original_url,
      imagesrcset: hero.value.srcset,
      imagesizes: "100vw",
      fetchpriority: "high",
    });
  }

  return { link: links };
});

useSeoMeta({
  title: () =>
    data.value
      ? `${data.value.usedBuilding ? "Used" : "New"} ${data.value.size} ${
          data.value.product.title
        } Shed - ${config.public.pageTitleSiteName}`
      : `Inventory Item Details - ${config.public.pageTitleSiteName}`,
  description: () => seoDescription.value,

  // Open Graph
  ogType: "website",
  ogTitle: () =>
    data.value
      ? `${data.value.usedBuilding ? "Used" : "New"} ${data.value.size} ${
          data.value.product.title
        } Shed - ${config.public.pageTitleSiteName}`
      : `Inventory Item Details - ${config.public.pageTitleSiteName}`,
  ogDescription: () => seoDescription.value,
  ogUrl: () => canonicalUrl.value,
  ogImage: () => ogImageUrl.value,
  ogImageAlt: () => ogImageAlt.value as any,
  ogImageWidth: () => ogImageWidth.value as any,
  ogImageHeight: () => ogImageHeight.value as any,

  // Twitter
  twitterCard: () => (ogImageUrl.value ? "summary_large_image" : "summary"),
  twitterTitle: () =>
    data.value
      ? `${data.value.usedBuilding ? "Used" : "New"} ${data.value.size} ${
          data.value.product.title
        } Shed`
      : "Inventory Item Details",
  twitterDescription: () => seoDescription.value,
  twitterImage: () => ogImageUrl.value,
});

/* ---------- Schema.org ---------- */
useSchemaOrg(() => {
  if (!data.value) return [];

  const images: string[] = [];
  if (data.value.heroImage?.original_url)
    images.push(absolutize(data.value.heroImage.original_url)!);
  if (Array.isArray(data.value.additionalImages)) {
    for (const img of data.value.additionalImages) {
      if (img?.original_url) images.push(absolutize(img.original_url)!);
    }
  }

  const availability = "https://schema.org/InStock";
  const condition = data.value.usedBuilding
    ? "https://schema.org/UsedCondition"
    : "https://schema.org/NewCondition";

  return [
    defineWebPage({
      "@type": "WebPage",
      name: `${data.value.usedBuilding ? "Used" : "New"} ${data.value.size} ${
        data.value.product.title
      } Shed`,
      description: seoDescription.value,
      url: canonicalUrl.value,
    }),
    defineBreadcrumb({
      itemListElement: [
        { name: "Home", item: config.public.siteRootUrl },
        { name: "Inventory", item: `${config.public.siteRootUrl}/inventory` },
        {
          name: `${data.value.size} ${data.value.product.title}`,
          item: canonicalUrl.value,
        },
      ],
    }),
    defineProduct({
      name: `${data.value.usedBuilding ? "Used" : "New"} ${data.value.size} ${
        data.value.product.title
      } Shed`,
      sku: data.value.serialNumber,
      description: seoDescription.value,
      image: images.length ? images : undefined,
      brand: {
        "@type": "Organization",
        name: config.public.pageTitleSiteName ?? "Brand",
        url: config.public.siteRootUrl,
        logo: config.public.siteLogoUrl
          ? { "@type": "ImageObject", url: config.public.siteLogoUrl }
          : undefined,
      },
      // Model/category breadcrumbs (optional)
      category: data.value.product.product_category_title,
      // Condition
      itemCondition: condition,
      // Offers
      offers: {
        "@type": "Offer",
        url: canonicalUrl.value,
        priceCurrency: "USD",
        price: Number(finalPrice.value || 0),
        availability,
      },
    }),
  ];
});

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

const ribbonText = computed<string | null>(() => {
  if (!data.value) return null;

  if (data.value.highlightedLabel) return data.value.highlightedLabel;

  if (data.value.discountAmount) {
    return `${formatRoundedPrice(data.value.discountAmount)} Off!`;
  }

  return null;
});

const ribbonColor = computed<string | null>(() => {
  if (!data.value) return null;

  if (data.value.highlightedLabel) return "var(--color-yellow-500)";

  if (data.value.discountAmount) {
    return "var(--color-red-600)";
  }

  return null;
});

const ribbonTextColor = computed<string | null>(() => {
  if (!data.value) return null;

  if (data.value.highlightedLabel) return "black";

  if (data.value.discountAmount) {
    return "white";
  }

  return null;
});
</script>
<template>
  <PageDataGate :sources="[{ data, pending, error, refresh }]">
    <div v-if="data">
      <Heading
        class="mt-12 md:mt-24"
        :text="`${data.usedBuilding ? 'Used' : 'New'} ${data.size} ${
          data.product.title
        }`"
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
            :ribbon-text="ribbonText"
            :ribbon-color="ribbonColor"
            :ribbon-text-color="ribbonTextColor"
          />
          <div class="w-full md:w-1/2 flex flex-col">
            <div class="flex flex-wrap gap-8 justify-center mb-8">
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
              <NuxtLink
                v-if="data.designerLink"
                :to="data.designerLink"
                target="_blank"
              >
                <button
                  :class="'flex gap-2 p-3 rounded-lg shadow-lg hover:-translate-y-1 hover:shadow-xl transition-all duration-300 ease-in-out group cursor-pointer bg-accent'"
                  @click="submitTrackingEvent('click-3d-design-button-on-inventory-page')"
                >
                  <UIcon
                    name="tdesign:map-3d"
                    class="h-6 w-6 my-auto sm:h-8 sm:w-8"
                  />
                  <p
                    class="font-title select-none font-semibold text-sm sm:text-base my-auto shrink-0"
                  >
                    Customize in 3D
                  </p>
                </button>
              </NuxtLink>
            </div>
            <h3 class="font-bold font-title text-lg mb-2">Building Details</h3>
            <div class="flex flex-col gap-1 ml-4">
              <div class="flex gap-2">
                <span>Price:</span>
                <span
                  class="font-bold"
                  :class="{ 'line-through': data.discountAmount }"
                  >{{ formatPrice(data.cashPrice) }}</span
                >
                <span
                  v-if="data.discountAmount"
                  class="text-red-500 font-bold"
                  >{{ formatPrice(data.cashPrice - data.discountAmount) }}</span
                >
              </div>
              <div class="flex gap-2">
                <span>Status:</span>
                <span class="font-bold">{{
                  data.usedBuilding ? "Used" : "New"
                }}</span>
                <span v-if="data.usedBuilding" class="italic"
                  >**Used Buildings are sold in AS IS condition</span
                >
              </div>
              <div class="flex gap-2">
                <span>Size:</span>
                <span class="font-bold">{{ data.size }}</span>
              </div>
              <div class="flex gap-2">
                <span>Product:</span>
                <NuxtLink
                  v-if="!data.product.discontinued"
                  :to="`/products/${data.product.slug}`"
                  class="text-hovered-link hover:underline font-bold"
                  >{{ data.product.title }}</NuxtLink
                >
                <span v-else class="font-bold">{{ data.product.title }} (Discontinued)</span>
              </div>
              <div class="flex gap-2">
                <span>Product Line:</span>
                <NuxtLink
                  v-if="!data.product.product_line_discontinued"
                  :to="`/product-lines/${data.product.product_line_slug}`"
                  class="text-hovered-link hover:underline font-bold"
                  >{{ data.product.product_line_title }}
                  {{ data.product.product_category_title }}</NuxtLink
                >
                <span v-else class="font-bold">{{ data.product.product_line_title }} (Discontinued)</span>
              </div>
              <div class="flex gap-2">
                <span>Location:</span>
                <NuxtLink
                  :to="`/locations/${data.location.slug}`"
                  class="text-hovered-link hover:underline font-bold"
                  >{{ data.location.title }} ({{ data.location.city }},
                  {{ data.location.state }})</NuxtLink
                >
              </div>
              <div class="flex gap-2">
                <span>Serial Number:</span>
                <span class="font-bold">{{ data.serialNumber }}</span>
              </div>
              <div v-if="data.lotNumber" class="flex gap-2">
                <span>Lot Number:</span>
                <span class="font-bold">{{ data.lotNumber ?? "N/A" }}</span>
              </div>
            </div>
            <div>
              <h3 class="font-bold font-title text-lg mt-4 mb-2">
                Building Description
              </h3>
              <p
                v-if="data.highlightedDescription"
                class="ml-4 p-2 my-2 bg-yellow-500"
              >
                {{ data.highlightedDescription }}
              </p>
              <WysiwygRenderer :content="data.description" class="ml-4" />
            </div>
          </div>
        </div>
        <div v-if="data.similarItems">
          <Heading
            class="mt-12 md:mt-24"
            text="Similar Inventory Items"
            heading-level="h2"
            text-alignment="center"
          />
          <CardGallery class="my-8">
            <InventoryCard
              v-for="inventoryItem in data.similarItems"
              :key="inventoryItem.serialNumber"
              :hero-image="inventoryItem.heroImage"
              :serial-number="inventoryItem.serialNumber"
              :size="inventoryItem.size"
              :product-line-title="inventoryItem.product?.product_line_title"
              :product-line-discontinued="inventoryItem.product.product_line_discontinued"
              :product-title="inventoryItem.product?.title"
              :product-discontinued="inventoryItem.product.discontinued"
              :cash-price="inventoryItem.cashPrice"
              :discount-amount="inventoryItem.discountAmount"
              :location-name="inventoryItem.location?.title"
              :lot-number="inventoryItem.lotNumber"
              :highlighted-label="inventoryItem.highlightedLabel"
              :used-building="inventoryItem.usedBuilding"
              :location-address="inventoryItem.location.address"
              :location-city="inventoryItem.location.city"
              :location-state="inventoryItem.location.state"
              :location-zip="inventoryItem.location.zip"
            />

            <NoItemsCard
              v-if="data.similarItems.length === 0"
              message="No Similar Inventory Items Found"
            />
          </CardGallery>
        </div>
      </MaxWidthContentWrapper>
      <TextInventoryItemSlideover
        v-model:isMenuOpen="isTextInventoryItemSlideoverOpen"
        :serial-number="data.serialNumber"
      />
    </div>
  </PageDataGate>
</template>
