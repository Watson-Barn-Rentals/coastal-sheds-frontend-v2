<script lang="ts" setup>
import { getLocationItem } from "~/services/api/get-location-item";
import { getFormattedPhoneNumber } from "~/services/get-formatted-phone-number";
import { getGoogleMapsLinkForAddress } from "~/services/get-google-maps-link-for-address";
import type { LocationItem } from "~/types/location-item";

definePageMeta({
  key: (route) => route.fullPath, // remount on path change
  layout: "default",
});

const config = useRuntimeConfig();
const route = useRoute();
const slug = computed(() => route.params.slug as string);

const { data, pending, error, refresh } = await useAsyncData<LocationItem>(
  () => `location-${slug.value}`, // key depends on slug
  () => getLocationItem(slug.value), // fetch depends on slug
  { watch: [slug] } // re-fetch when slug changes
);

const canonicalUrl = computed(
  () => `${config.public.siteRootUrl}/locations/${slug.value}/`
);
const hero = computed(() => data.value?.heroImage ?? null);

useHead(() => {
  const links: any[] = [{ rel: "canonical", href: canonicalUrl.value }];

  if (hero.value?.original_url) {
    try {
      const origin = new URL(hero.value.original_url).origin;
      links.push({ rel: "preconnect", href: origin, crossorigin: "" });
      links.push({ rel: "dns-prefetch", href: origin });
      links.push({
        rel: "preload",
        as: "image",
        href: hero.value.original_url,
        imagesrcset: hero.value.srcset,
        imagesizes: "100vw",
        fetchpriority: "high",
      });
    } catch {}
  }

  // Tell OG explicitly (avoid TS union issues—see next section)
  const meta: any[] = [{ property: "og:type", content: "place" }];

  // Optional: surface geo to OG
  const lat = Number((data.value as any)?.latitude);
  const lng = Number((data.value as any)?.longitude);
  if (Number.isFinite(lat) && Number.isFinite(lng)) {
    meta.push({ property: "place:location:latitude", content: String(lat) });
    meta.push({ property: "place:location:longitude", content: String(lng) });
  }

  return { link: links, meta };
});

useSeoMeta({
  title: () => {
    const t = data.value?.title ?? "Location";
    const city = data.value?.city;
    const state = data.value?.state;
    return city && state ? `${t} – ${city}, ${state}` : `${t} Location`;
  },
  description: () => {
    if (!data.value) return "";
    const parts = [
      data.value.shortDescription || "",
      [data.value.address, data.value.city, data.value.state, data.value.zip]
        .filter(Boolean)
        .join(", "),
      data.value.phone
        ? `Call ${getFormattedPhoneNumber(data.value.phone)}`
        : "",
    ].filter(Boolean);
    // keep under ~160 chars
    return parts.join(" · ").slice(0, 158);
  },

  // Open Graph (image from hero if available)
  ogTitle: () => data.value?.title ?? "Location",
  ogDescription: () => data.value?.shortDescription ?? "",
  ogUrl: () => canonicalUrl.value,
  ogImage: () => {
    const u = hero.value?.original_url;
    return u
      ? u.startsWith("http")
        ? u
        : new URL(u, config.public.siteRootUrl).toString()
      : undefined;
  },
  ogImageAlt: () =>
    (hero.value?.alt || `${data.value?.title ?? "Location"} image`) as any,
  ogImageWidth: () => hero.value?.width as any,
  ogImageHeight: () => hero.value?.height as any,

  // Twitter
  twitterCard: () =>
    hero.value?.original_url ? "summary_large_image" : "summary",
  twitterTitle: () => data.value?.title ?? "Location",
  twitterDescription: () => data.value?.shortDescription ?? "",
  twitterImage: () => hero.value?.original_url,
});

useSchemaOrg(() => {
  if (!data.value) return [];

  const lat = Number((data.value as any).latitude);
  const lng = Number((data.value as any).longitude);
  const hasGeo = Number.isFinite(lat) && Number.isFinite(lng);

  // Try to convert hours object { Monday: '9am-5pm', ... } into OpeningHoursSpecification.
  const hours: any[] = [];
  if (data.value.hours && typeof data.value.hours === "object") {
    const dayMap: Record<string, string> = {
      monday: "Monday",
      tuesday: "Tuesday",
      wednesday: "Wednesday",
      thursday: "Thursday",
      friday: "Friday",
      saturday: "Saturday",
      sunday: "Sunday",
    };
    for (const [rawDay, str] of Object.entries(data.value.hours)) {
      const dayName = dayMap[String(rawDay).toLowerCase()];
      if (!dayName || typeof str !== "string") continue;
      // very light parse: "9:00 AM - 5:30 PM" | "Closed"
      if (/closed/i.test(str)) {
        hours.push({
          "@type": "OpeningHoursSpecification",
          dayOfWeek: dayName,
          opens: "00:00",
          closes: "00:00",
        });
      } else {
        const m = str.match(
          /(\d{1,2}(:\d{2})?\s*[ap]m)\s*-\s*(\d{1,2}(:\d{2})?\s*[ap]m)/i
        );
        if (m) {
          const to24 = (s: string) => {
            const [_, hms] = s.match(/(\d{1,2})(?::(\d{2}))?\s*([ap]m)/i) || [];
            if (!_) return "09:00";
            let h = parseInt(RegExp.$1, 10);
            const m = RegExp.$2 ? parseInt(RegExp.$2, 10) : 0;
            const ampm = RegExp.$3.toLowerCase();
            if (ampm === "pm" && h !== 12) h += 12;
            if (ampm === "am" && h === 12) h = 0;
            return `${String(h).padStart(2, "0")}:${String(m).padStart(
              2,
              "0"
            )}`;
          };
          hours.push({
            "@type": "OpeningHoursSpecification",
            dayOfWeek: dayName,
            opens: to24(m[1]),
            closes: to24(m[3]),
          });
        }
      }
    }
  }

  return [
    defineWebPage({
      name: data.value.title,
      description: data.value.shortDescription,
      url: canonicalUrl.value,
    }),
    defineBreadcrumb({
      itemListElement: [
        { name: "Home", item: config.public.siteRootUrl },
        {
          name: "Locations",
          item: new URL("/locations", config.public.siteRootUrl).toString(),
        },
        { name: data.value.title, item: canonicalUrl.value },
      ],
    }),
    {
      // LocalBusiness payload (inline without factory to keep it portable)
      "@type": "LocalBusiness",
      "@id": canonicalUrl.value + "#local-business",
      name: data.value.title,
      description: data.value.shortDescription,
      url: canonicalUrl.value,
      image: hero.value?.original_url,
      telephone: data.value.phone,
      email: data.value.email,
      sameAs: data.value.facebookPageUrl
        ? [data.value.facebookPageUrl]
        : undefined,
      address: {
        "@type": "PostalAddress",
        streetAddress: data.value.address,
        addressLocality: data.value.city,
        addressRegion: data.value.state,
        postalCode: data.value.zip,
        addressCountry: "US",
      },
      geo: hasGeo
        ? { "@type": "GeoCoordinates", latitude: lat, longitude: lng }
        : undefined,
      openingHoursSpecification: hours.length ? hours : undefined,
    },
  ];
});
</script>

<template>
  <PageDataGate :sources="[{ data, pending, error, refresh }]">
    <div v-if="data">
      <Heading
        class="mt-12 md:mt-24"
        :text="`${data.title} Location`"
        heading-level="h1"
        text-alignment="center"
      />
      <MaxWidthContentWrapper>
        <div class="flex flex-col gap-8 my-8">
          <iframe
            :src="data.googleMapsEmbedUrl"
            class="w-full aspect-[1/1] sm:aspect-[2/1] lg:aspect-[3/1]"
          />
          <div class="">
            <ResponsiveImage
              :image-media-item="data.heroImage"
              class="w-full md:w-1/2 float-left mb-8 md:mr-8 mr-0"
            />
            <WysiwygRenderer v-if="data" :content="data.longDescription" />
          </div>
          <div class="flex flex-col md:flex-row gap-8">
            <div class="w-full md:w-1/2 flex flex-col gap-4 text-lg">
              <div class="flex gap-2">
                <span class="font-bold">Address:</span>
                <a
                  target="_blank"
                  :href="
                    getGoogleMapsLinkForAddress(
                      data.address,
                      data.city,
                      data.state,
                      data.zip
                    )
                  "
                  class="text-hovered-link underline"
                  >{{ data.address }}, {{ data.city }}, {{ data.state }},
                  {{ data.zip }}</a
                >
              </div>
              <div class="flex gap-2" v-if="data.phone">
                <span class="font-bold">Phone Number:</span>
                <a
                  :href="`tel:${data.phone}`"
                  class="text-hovered-link underline"
                  >{{ getFormattedPhoneNumber(data.phone) }}</a
                >
              </div>
              <div class="flex gap-2" v-if="data.email">
                <span class="font-bold">Email:</span>
                <a
                  :href="`mailto:${data.email}`"
                  class="text-hovered-link underline"
                  >{{ data.email }}</a
                >
              </div>
              <span class="font-bold underline" v-if="Object.keys(data.hours).length > 0">Hours</span>
              <div class="flex flex-col gap-2" v-if="Object.keys(data.hours).length > 0">
                <div
                  v-for="(hrs, day, i) in data.hours"
                  :key="day"
                  class="flex"
                >
                  <span class="shrink-0 italic">{{ day }}:</span>
                  <span class="shrink-0 pl-2">{{ hrs }}</span>
                </div>
              </div>
              <div class="flex justify-center mt-8">
                <a :href="`/inventory?location=${data.slug}`" class="shrink-0 m">
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
                </a>
              </div>
            </div>
            <div v-if="data.salesReps.length > 0" class="w-full md:w-1/2 flex flex-col gap-4">
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
                  <p class="text-center text-lg font-bold">
                    {{ salesRep.name }}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </MaxWidthContentWrapper>
    </div>
  </PageDataGate>
</template>
