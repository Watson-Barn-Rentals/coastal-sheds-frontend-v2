import { defineNuxtModule, addTemplate } from "@nuxt/kit"

export default defineNuxtModule({
  meta: { name: "prerender-routes" },

  async setup(_, nuxt) {
    let routes: string[] = []

    // Fetch once, early in build
    nuxt.hook("build:before", async () => {
      const isPreviewMode = process.env.PREVIEW_MODE === "true"
      const apiRoot = process.env.API_ROOT_URL

      if (isPreviewMode || !apiRoot) {
        routes = []
        return
      }

      const res = await fetch(`${apiRoot}/api/get-prerender-page-list`, {
        headers: { Accept: "application/json" },
      })

      if (!res.ok) {
        console.warn(
          `[prerender] get-prerender-page-list ${res.status} ${res.statusText}`
        )
        routes = []
        return
      }

      const json = (await res.json()) as { data?: unknown }
      const raw = Array.isArray(json.data) ? (json.data as string[]) : []

      // endpoint already normalized; just dedupe + sort
      routes = Array.from(new Set(raw.map(String))).sort((a, b) => a.localeCompare(b))

      console.log(`[prerender] fetched ${routes.length} prerender routes`)
    })

    // Generate #build/prerender-routes.generated
    nuxt.hook("app:templates", () => {
      addTemplate({
        filename: "prerender-routes.generated.ts",
        getContents: () =>
          `// AUTO-GENERATED. DO NOT EDIT.\nexport default ${JSON.stringify(routes, null, 2)} as const;\n`,
      })
    })

    // Feed Nitro prerender list from same source (no second fetch)
    nuxt.hook("nitro:config", (nitroConfig) => {
      nitroConfig.prerender = nitroConfig.prerender || {}
      nitroConfig.prerender.routes = [
        ...(nitroConfig.prerender.routes || []),
        ...routes,
      ]
    })
  },
})
