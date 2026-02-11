// nuxt.config.ts
import { defineNuxtConfig } from "nuxt/config";
import tailwindcss from "@tailwindcss/vite";
import fs from "node:fs";
import path from "node:path";

const isPreviewMode = process.env.PREVIEW_MODE === "true";

const EDGE_TTL = Number(process.env.EDGE_TTL ?? 300);
const EDGE_SWR = Number(process.env.EDGE_SWR ?? 86400);

export default defineNuxtConfig({
	compatibilityDate: "2024-11-01",

	app: {
		head: {
			htmlAttrs: { lang: "en" },
		},
	},

	ssr: !isPreviewMode,

	routeRules: {
		"/inventory/": {
			ssr: true,
			prerender: false,
			headers: {
				"Cache-Control": "public, max-age=0, must-revalidate",
				"Netlify-CDN-Cache-Control": `public, s-maxage=${EDGE_TTL}, stale-while-revalidate=${EDGE_SWR}`,
				"Cache-Tag": "inventory inventory-list",
				"Netlify-Vary": "header=x-cache-bucket",
			},
		},

		"/inventory/**": {
			ssr: true,
			prerender: false,
			headers: {
				"Cache-Control": "public, max-age=0, must-revalidate",
				"Netlify-CDN-Cache-Control": `public, s-maxage=${EDGE_TTL}, stale-while-revalidate=${EDGE_SWR}`,
				"Netlify-Vary": "header=x-cache-bucket",
				// inventory inventory-item inventory-item:{serial} tags added dynamically in server/plugins/cache-tags.ts
			},
		},

		  // Catch-all: everything else
  		"/**": {
  		  // Let Nuxt decide per-route SSR/prerender, but apply caching headers.
  		  headers: {
  		    "Cache-Control": "public, max-age=0, must-revalidate",
  		    "Netlify-CDN-Cache-Control": `public, s-maxage=${EDGE_TTL}, stale-while-revalidate=${EDGE_SWR}`,
  		  },
  		},
	},

	nitro: {
		preset: "netlify",
		prerender: {
			crawlLinks: false,
			concurrency: Number(process.env.PRERENDER_CONCURRENCY ?? 2),
			interval: Number(process.env.PRERENDER_INTERVAL ?? 150),
		},
	},

	plugins: [
		"~/plugins/vueuse-motion.ts",
		"~/plugins/site-settings.ts",
		"~/plugins/fingerprint.client.ts",
		"~/plugins/fix-leadferno-background.client.ts",
	],

	hooks: {
		"prerender:routes": async (ctx) => {
		  if (isPreviewMode) return
	
		  const apiRoot = process.env.API_ROOT_URL
		  if (!apiRoot) throw new Error("Missing API_ROOT_URL")
		
		  const res = await fetch(`${apiRoot}/api/get-prerender-page-list`, {
		    headers: { Accept: "application/json" },
		  })
		  if (!res.ok) {
		    throw new Error(`get-prerender-page-list ${res.status} ${res.statusText}`)
		  }
	
		  const { data } = (await res.json()) as { data?: string[] }
		  for (const route of data ?? []) ctx.routes.add(route)
		},

		/**
		 * Runs after Nitro builds public assets (typed hook).
		 * Safe place to write _redirects and _netlify-forms.html.
		 */
		"nitro:build:public-assets": async (nitro) => {
			if (isPreviewMode) {
				console.log(
					"Preview mode active; skipping _redirects and forms registration.",
				);
				return;
			}

			const apiRoot = process.env.API_ROOT_URL;
			if (!apiRoot) {
				console.warn(
					"Missing API_ROOT_URL; skipping _redirects and forms registration.",
				);
				return;
			}

			const publishDir = nitro.options.output.publicDir;

			/* 1) Build Netlify `_redirects` from CMS */
			try {
				const res = await fetch(`${apiRoot}/api/redirects`, {
					headers: { Accept: "application/json" },
				});
				if (!res.ok)
					throw new Error(
						`Failed to fetch redirects: ${res.status} ${res.statusText}`,
					);

				const json = (await res.json()) as {
					data: Array<{
						from: string;
						to: string;
						status?: number | string;
						force?: boolean;
						enabled?: boolean;
					}>;
				};

				const lines: string[] = [];
				lines.push("/_netlify-forms.html  /_netlify-forms.html  200!");

				for (const r of json.data ?? []) {
					if (r.enabled === false) continue;
					const status = String(r.status ?? "301");
					const bang = r.force ? "!" : "";
					lines.push(`${r.from}  ${r.to}  ${status}${bang}`);
				}

				const redirectsPath = path.join(publishDir, "_redirects");
				const baselinePath = path.join(process.cwd(), "public", "_redirects");
				let baseline = "";
				if (fs.existsSync(baselinePath))
					baseline = fs.readFileSync(baselinePath, "utf8").trim();

				const dynamicRules = lines.join("\n").trim();
				const final =
					[baseline, dynamicRules].filter(Boolean).join("\n") + "\n";
				fs.writeFileSync(redirectsPath, final, "utf8");
				console.log(
					`Wrote ${lines.length} redirect rules to ${redirectsPath}`,
				);
			} catch (err) {
				console.error("Failed to build _redirects from CMS:", err);
			}

			/* 2) Generate Netlify Forms registration (no file inputs) */
			try {
				const res = await fetch(`${apiRoot}/api/list-forms`, {
					headers: { Accept: "application/json" },
				});
				if (!res.ok)
					throw new Error(`list-forms ${res.status} ${res.statusText}`);

				const { data } = (await res.json()) as {
					data: Array<{
						netlifyName: string;
						fields: Array<{
							key: string;
							type: string;
							options?: Array<{ value: string; label: string }>;
						}>;
					}>;
				};

				const chunks: string[] = [];
				chunks.push(
					'<!doctype html><html><head><meta charset="utf-8"><title>Netlify Forms Detection</title></head><body style="display:none;">',
				);

				for (const form of data ?? []) {
					chunks.push(
						`<form name="${form.netlifyName}" method="POST" data-netlify="true" data-netlify-honeypot="bot-field" netlify>`,
					);
					chunks.push(
						`<input type="hidden" name="form-name" value="${form.netlifyName}" />`,
					);
					chunks.push(`<input type="text" name="bot-field" />`);

					for (const f of form.fields ?? []) {
						const t = String(f.type || "").toLowerCase();
						if (t === "hidden") {
							chunks.push(
								`<input type="hidden" name="${f.key}" value="">`,
							);
						} else if (t === "checkbox" && (f.options?.length ?? 0) > 0) {
							chunks.push(
								`<input type="checkbox" name="${f.key}[]" value="${f.options![0].value}">`,
							);
						} else if (t === "radio" && (f.options?.length ?? 0) > 0) {
							chunks.push(
								`<input type="radio" name="${f.key}" value="${f.options![0].value}">`,
							);
						} else if (t === "select") {
							const opt = f.options?.[0]?.value ?? "";
							chunks.push(
								`<select name="${f.key}"><option value="${opt}">${opt}</option></select>`,
							);
						} else {
							chunks.push(
								`<input type="text" name="${f.key}" value="">`,
							);
						}
					}

					chunks.push("</form>");
				}

				chunks.push("</body></html>");

				const detectionPath = path.join(publishDir, "_netlify-forms.html");
				fs.writeFileSync(detectionPath, chunks.join("\n"), "utf8");
				console.log(`Wrote Netlify detection file: ${detectionPath}`);
			} catch (e) {
				console.warn("Skipping _netlify-forms.html generation:", e);
			}
		},
	},

	runtimeConfig: {
		public: {
			apiRootUrl: process.env.API_ROOT_URL!,
			mainSiteUrl: process.env.MAIN_SITE_URL || "",
			previewMode: isPreviewMode,
			fallbackTitle: "",
			fallbackDescription: "",
			pageTitleSiteName: process.env.PAGE_TITLE_SITE_NAME || "",
			siteRootUrl: process.env.SITE_ROOT_URL || "",
			legalOwnerName:
				process.env.NUXT_PUBLIC_LEGAL_OWNER_NAME || "Your Business",
			legalEntityType: process.env.NUXT_PUBLIC_LEGAL_ENTITY_TYPE || "LLC",
			legalCity: process.env.NUXT_PUBLIC_LEGAL_CITY || "",
			legalState: process.env.NUXT_PUBLIC_LEGAL_STATE || "",
			legalGoverningState:
				process.env.NUXT_PUBLIC_LEGAL_GOVERNING_STATE ||
				process.env.NUXT_PUBLIC_LEGAL_STATE ||
				"",
			legalVenueLocation:
				process.env.NUXT_PUBLIC_LEGAL_VENUE_LOCATION || "",
			legalContactEmail:
				process.env.NUXT_PUBLIC_LEGAL_CONTACT_EMAIL ||
				"legal@example.com",
			legalContactPhone:
				process.env.NUXT_PUBLIC_LEGAL_CONTACT_PHONE || "",
			legalOperatorName:
				process.env.NUXT_PUBLIC_LEGAL_OPERATOR_NAME || "",
			legalRegionNote:
				process.env.NUXT_PUBLIC_LEGAL_REGION_NOTE ||
				"Our services are intended for customers in the Southeastern United States.",
			legalEffectiveISO:
				process.env.NUXT_PUBLIC_LEGAL_EFFECTIVE_ISO || "2025-10-01",
			legalEffectiveHuman:
				process.env.NUXT_PUBLIC_LEGAL_EFFECTIVE_HUMAN ||
				"October 1, 2025",
		},
	},

	devtools: { enabled: true },
	devServer: { host: "0.0.0.0", port: 3000 },

	vite: {
		plugins: [tailwindcss()],
	},

	modules: [
		"@nuxt/ui-pro",
		"@nuxtjs/color-mode",
		"@vueuse/nuxt",
		"@vueuse/motion/nuxt",
		"@nuxt/scripts",
		"nuxt-headlessui",
		"nuxt-schema-org",
	],

	scripts: {
		registry: {
			googleAnalytics: {
				id: process.env.GOOGLE_ANALYTICS_ID || "G-XXXXXXX",
			},
			metaPixel: { id: process.env.META_PIXEL_ID || "YOUR_ID" },
			hotjar: { id: Number(process.env.HOTJAR_ID) || Number("0000000") },
		},
	},

	css: [
		"~/assets/css/main.css",
		"~/assets/css/breakpoints.css",
		"~/assets/css/animations.css",
		"~/assets/css/fallback-theme.css",
	],

	colorMode: { classSuffix: "", preference: "system" },
});
