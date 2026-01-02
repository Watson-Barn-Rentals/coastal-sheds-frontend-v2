<script lang="ts" setup>
import MaxWidthContentWrapper from "~/components/max-width-content-wrapper.vue";
import { getProductItem } from "~/services/api/get-product-item";
import { submitTrackingEvent } from "~/services/submit-tracking-event";
import type { ImageMediaItem } from "~/types/image-media-item";
import type { ProductItem } from "~/types/product-item";

definePageMeta({
	key: (route) => route.fullPath, // remount on path change
	layout: "default",
});

const config = useRuntimeConfig();
const route = useRoute();
const slug = computed(() => route.params.slug as string);

const { data, pending, error, refresh } = await useAsyncData<ProductItem>(
	() => `product-category-${slug.value}`, // key depends on slug
	() => getProductItem(slug.value), // fetch depends on slug
	{ watch: [slug] } // re-fetch when slug changes
);

const canonicalUrl = computed(
	() => `${config.public.siteRootUrl}/products/${slug.value}/`
);

// Hero helpers
const hero = computed(() => data.value?.heroImage ?? null);
const heroAbsUrl = computed(() => {
	const u = hero.value?.original_url;
	if (!u) return undefined;
	return u.startsWith("http")
		? u
		: new URL(u, config.public.siteRootUrl).toString();
});

// Optional: parse a numeric price from `starting_price` ("$3,499" → 3499)
function parsePrice(str?: string | null): number | undefined {
	if (!str) return;
	const n = Number(String(str).replace(/[^0-9.]/g, ""));
	return Number.isFinite(n) ? n : undefined;
}
const priceNumber = computed(() => parsePrice(data.value?.starting_price));

/**
 * Offers helpers:
 * - If your API already provides an `offers` payload, we’ll use it.
 * - Otherwise we synthesize a minimal Offer only when `starting_price` exists.
 * - If neither exist => no offers; we’ll emit Thing instead of Product.
 */
function dataHasOffers(d?: ProductItem | null): boolean {
	const o = (d as any)?.offers;
	if (!o) return false;
	if (Array.isArray(o)) return o.length > 0;
	return typeof o === "object" && Object.keys(o).length > 0;
}
const isProduct = computed(
	() => priceNumber.value != null || dataHasOffers(data.value)
);

// Link hints + canonical + explicit OG type (avoid type errors by using useHead)
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

	// Use "product" only when we truly emit a Product schema
	const meta = [
		{
			property: "og:type",
			content: isProduct.value ? "product" : "website",
		},
	];

	return { link: links, meta };
});

// Meta tags
useSeoMeta({
	title: () => {
		if (!data.value) return "Product Details";
		const base = `${data.value.product_line_title} ${data.value.title}`;
		const brand = config.public.pageTitleSiteName || "";
		return brand ? `${base} | ${brand}` : base;
	},
	description: () => {
		if (!data.value) return "";
		// Short, keyworded blurb + gentle CTA
		const base = (data.value.short_description || "").trim();
		const extra = "See photos, features, and in-stock availability.";
		return [base, extra].filter(Boolean).join(" ").slice(0, 158);
	},

	// OG (image from hero if available)
	ogTitle: () => data.value?.title ?? "Product",
	ogDescription: () => data.value?.short_description ?? "",
	ogUrl: () => canonicalUrl.value,
	ogImage: () => heroAbsUrl.value,
	ogImageAlt: () =>
		(hero.value?.alt ||
			`${data.value?.product_line_title ?? ""} ${
				data.value?.title ?? "Product"
			} image`) as any,

	// Twitter
	twitterCard: () => (heroAbsUrl.value ? "summary_large_image" : "summary"),
	twitterTitle: () => data.value?.title ?? "Product",
	twitterDescription: () => data.value?.short_description ?? "",
	twitterImage: () => heroAbsUrl.value,

	// Optional: hide thin pages from index (tune to your rules)
	robots: () =>
		data.value?.long_description ? "index, follow" : "noindex, follow",
});

// JSON-LD
useSchemaOrg(() => {
	if (!data.value) return [];

	const productUrl = new URL(
		`/products/${data.value.slug}`,
		config.public.siteRootUrl
	).toString();
	const categoryUrl = new URL(
		`/product-categories/${data.value.product_category_slug}`,
		config.public.siteRootUrl
	).toString();
	const lineUrl = new URL(
		`/product-lines/${data.value.product_line_slug}`,
		config.public.siteRootUrl
	).toString();

	const images = [
		data.value.heroImage?.original_url,
		...(data.value.additionalImages?.map((i) => i.original_url) ?? []),
	].filter(Boolean);

	// Prefer API-provided offers if present; else synthesize when we have a price
	const apiOffers = (data.value as any)?.offers;
	const synthesizedOffer =
		priceNumber.value != null
			? {
					"@type": "Offer",
					price: priceNumber.value,
					priceCurrency: "USD", // adjust if needed
					url: productUrl,
					availability: "https://schema.org/InStock", // change if unknown/out of stock
			  }
			: undefined;

	const offers = dataHasOffers(data.value) ? apiOffers : synthesizedOffer;

	const productLike = {
		name: data.value.title,
		description:
			data.value.short_description || data.value.long_description,
		image: images.length ? images : undefined,
		url: productUrl,
	};

	// If we have price or any offers → emit Product, else Thing (no offers).
	if (isProduct.value) {
		return [
			// WebPage (helps Google understand page context)
			defineWebPage({
				name: `${data.value.product_line_title} ${data.value.title}`,
				description: data.value.short_description,
				url: canonicalUrl.value,
				inLanguage: "en-US",
			}),

			// Breadcrumbs
			defineBreadcrumb({
				itemListElement: [
					{ name: "Home", item: config.public.siteRootUrl },
					{
						name: "Products",
						item: new URL(
							"/products",
							config.public.siteRootUrl
						).toString(),
					},
					{
						name: data.value.product_category_title,
						item: categoryUrl,
					},
					{ name: data.value.product_line_title, item: lineUrl },
					{ name: data.value.title, item: canonicalUrl.value },
				],
			}),

			// Product with offers
			{
				"@type": "Product",
				...productLike,
				category: `${data.value.product_category_title} > ${data.value.product_line_title}`,
				brand: config.public.pageTitleSiteName
					? {
							"@type": "Brand",
							name: config.public.pageTitleSiteName,
					  }
					: undefined,
				isRelatedTo: data.value.product_line_title,
				offers, // present via API or synthesized
			},
		];
	}

	// Fallback: Thing (no Product-specific requirements)
	return [
		defineWebPage({
			name: `${data.value.product_line_title} ${data.value.title}`,
			description: data.value.short_description,
			url: canonicalUrl.value,
			inLanguage: "en-US",
		}),
		defineBreadcrumb({
			itemListElement: [
				{ name: "Home", item: config.public.siteRootUrl },
				{
					name: "Products",
					item: new URL(
						"/products",
						config.public.siteRootUrl
					).toString(),
				},
				{ name: data.value.product_category_title, item: categoryUrl },
				{ name: data.value.product_line_title, item: lineUrl },
				{ name: data.value.title, item: canonicalUrl.value },
			],
		}),
		{
			"@type": "Thing",
			...productLike,
		},
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
</script>

<template>
	<PageDataGate :sources="[{ data, pending, error, refresh }]">
		<div v-if="data">
			<Heading
				class="mt-12 md:mt-24"
				:text="`${data.product_line_title} ${data.title}`"
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
						<div class="flex justify-center mb-10 gap-10">
							<NuxtLink
								v-if="data.designer_link"
								:to="data.designer_link"
								target="_blank"
								class="shrink-0"
							>
								<button
									class="flex gap-2 p-3 rounded-lg text-white bg-brand shadow-lg hover:-translate-y-1 hover:shadow-xl transition-all duration-300 ease-in-out group cursor-pointer"
									@click="
										submitTrackingEvent(
											'click-3d-design-button-on-product-page'
										)
									"
								>
									<UIcon
										name="tdesign:map-3d"
										dynamic
										class="h-6 w-6 my-auto sm:h-8 sm:w-8 text-white"
									/>
									<p
										class="font-title select-none text-white font-semibold text-sm sm:text-base my-auto shrink-0"
									>
										Design in 3D
									</p>
								</button>
							</NuxtLink>
							<NuxtLink
								:to="`/inventory?product=${data.slug}`"
								class="shrink-0"
								@click="
									submitTrackingEvent(
										'click-view-in-stock-items-button-on-product-page'
									)
								"
							>
								<button
									class="flex gap-2 p-3 rounded-lg text-black bg-accent shadow-lg hover:-translate-y-1 hover:shadow-xl transition-all duration-300 ease-in-out group cursor-pointer"
								>
									<UIcon
										name="material-symbols:event-list-rounded"
										dynamic
										class="h-6 w-6 my-auto sm:h-8 sm:w-8"
									/>
									<p
										class="font-title select-none font-semibold text-sm sm:text-base my-auto shrink-0"
									>
										View Inventory
									</p>
								</button>
							</NuxtLink>
						</div>
						<WysiwygRenderer :content="data.long_description" />
					</div>
				</div>
			</MaxWidthContentWrapper>
		</div>
	</PageDataGate>
</template>
