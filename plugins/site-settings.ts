// ~/plugins/site-settings.ts
export default defineNuxtPlugin(async (nuxtApp) => {
  const config = useRuntimeConfig()
  const apiRoot = config.public.apiRootUrl

  // Fetch both endpoints in parallel
  const [themeRes, generalRes] = await Promise.all([
    $fetch<{ data: {
      color_brand: string
      color_accent: string
      color_secondary_accent: string
      color_background: string
      color_background_dark: string
      color_background_accent: string
      color_background_accent_dark: string
      color_hovered_link: string
      font_title: string
      font_body: string
      font_import_links: string[]
    } }>(`${apiRoot}/api/get-theme-settings`),

    $fetch<{ data: {
      favicon_url: string
    } }>(`${apiRoot}/api/get-general-site-settings`),
  ])

  const theme = themeRes.data
  const general = generalRes.data

  // Provide all settings for convenient injection
  nuxtApp.provide('siteSettings', { theme, general })

  // Set favicon dynamically
  useHead({
    link: [
      {
        rel: 'icon',
        type: 'image/x-icon',
        href: general.favicon_url,
      },
    ],
  })

  // Build CSS variables (light + dark). Keep light vars on :root; override in .dark.
  const css = `
:root{
  --color-brand:${theme.color_brand};
  --color-accent:${theme.color_accent};
  --color-secondary-accent:${theme.color_secondary_accent};
  --color-background:${theme.color_background};
  --color-background-accent:${theme.color_background_accent};
  --color-hovered-link:${theme.color_hovered_link};

  --font-title:${theme.font_title};
  --font-body:${theme.font_body};
}
.dark{
  --color-background:${theme.color_background_dark};
  --color-background-accent:${theme.color_background_accent_dark};
}
`

  // Inject the CSS variables into <head> (SSR + CSR safe)
  useHead({
    style: [
      {
        // key to avoid duplicates on client hydration
        key: 'site-theme-vars',
        // Nuxt 3: put CSS as the "children" property
        children: css,
      },
    ],
  })
})

// Type helper for injection:
declare module '#app' {
  interface NuxtApp {
    $siteSettings: {
      theme: {
        color_brand: string
        color_accent: string
        color_secondary_accent: string
        color_background: string
        color_background_dark: string
        color_background_accent: string
        color_background_accent_dark: string
        color_hovered_link: string
        font_title: string
        font_body: string
        font_import_links: string[]
      }
      general: {
        favicon_url: string
      }
    }
  }
}
declare module 'vue' {
  interface ComponentCustomProperties {
    $siteSettings: NuxtApp['$siteSettings']
  }
}
