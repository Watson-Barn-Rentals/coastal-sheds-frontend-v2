import tailwindcss from "@tailwindcss/vite";

console.log('🛠  BUILD – PREVIEW_MODE =', process.env.PREVIEW_MODE);

// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: '2024-11-01',
  ssr: process.env.PREVIEW_MODE === 'true',
  hooks: {
    async 'prerender:routes'(context) {
      const apiRoot = process.env.API_ROOT_URL
      if (!apiRoot) {
        throw new Error('Missing API_ROOT_URL environment variable')
      }

      const pageListRequestResult = await fetch(`${apiRoot}/api/get-prerender-page-list`)
      if (!pageListRequestResult.ok) {
        throw new Error(`Failed to fetch page list: ${pageListRequestResult.status} ${pageListRequestResult.statusText}`)
      }
      const { data: pageList } = await pageListRequestResult.json() as { data: string[] }

      const allRoutes = [...pageList]

      for (const route of allRoutes) {
        context.routes.add(route)
      }
    },
  },
  nitro: {
    preset: process.env.PREVIEW_MODE === 'true' ? 'netlify' : 'netlify-static',
    prerender: {
      crawlLinks: false,
    },
  },
  routeRules: {
    '/**': { prerender: true },
  },
  runtimeConfig: {
    public: {
      apiRootUrl: process.env.API_ROOT_URL,
      previewMode: process.env.PREVIEW_MODE === 'true',
      mainSiteUrl: process.env.MAIN_SITE_URL || '',
      previewSiteUrl: process.env.PREVIEW_SITE_URL || '',
    }
  },
  devtools: { enabled: true },
  devServer: {
    host: '0.0.0.0',
    port: 3000,
  },
  modules: [
    '@nuxt/ui-pro',
    '@nuxtjs/color-mode',
    '@vueuse/nuxt',
    '@vueuse/motion/nuxt',
    '@nuxt/scripts',
  ],
  scripts: {
    registry: {
      googleAnalytics: {
        id: 'G-L2JCGM5R9C',
      },
      metaPixel: {
        id: 'YOUR_ID'
      },
      hotjar: {
        id: 6439262,
      }
    }
  },
  plugins: [
    '~/plugins/vueuse-motion.ts',
  ],
  css: [
    '~/assets/css/main.css',
    '~/assets/css/theme.css'
  ],
  vite: {
    plugins: [
      tailwindcss(),
    ],
  },
  colorMode: {
    classSuffix: '',
    preference: 'system',
  },
})