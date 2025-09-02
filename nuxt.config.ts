// nuxt.config.ts
import { defineNuxtConfig } from 'nuxt/config'
import tailwindcss from '@tailwindcss/vite'
import fs from 'fs'

const isPreviewMode = process.env.PREVIEW_MODE === 'true'

const staticPageRoutes = new Set<string>() // collect non-dynamic pages

export default defineNuxtConfig({
  compatibilityDate: '2024-11-01',

  // Preview mode = CSR (no SSR). Otherwise SSR on (Netlify Functions).
  ssr: !isPreviewMode,

  /**
   * IMPORTANT:
   * Remove the global `/**: { prerender: true }`. We only prerender
   * the exact routes we add in the hooks below.
   */
  routeRules: {
    // (empty or add other rules as needed; do NOT set global prerender)
  },

  nitro: {
    // Use Netlify preset so un-prerendered routes are SSR'd by Functions
    preset: 'netlify',
    prerender: {
      // We’ll explicitly add routes; avoid accidental crawling
      crawlLinks: false,
      // routes: []  // filled by the hooks below
    },
  },

  plugins: [
    '~/plugins/vueuse-motion.ts',
    '~/plugins/site-settings.ts',
    '~/plugins/fingerprint.client.ts',
  ],

  hooks: {
    'prerender:routes': async (ctx) => {
      if (isPreviewMode) return
    
      const apiRoot = process.env.API_ROOT_URL
      if (!apiRoot) throw new Error('Missing API_ROOT_URL')

      const res = await fetch(`${apiRoot}/api/get-prerender-page-list`)
      if (!res.ok) throw new Error(`Failed to fetch page list: ${res.status} ${res.statusText}`)
      const { data: pageList } = (await res.json()) as { data: string[] }
      pageList.forEach(route => ctx.routes.add(route))
    }
  },

  runtimeConfig: {
    public: {
      apiRootUrl: process.env.API_ROOT_URL!,
      mainSiteUrl: process.env.MAIN_SITE_URL || '',
      previewMode: isPreviewMode,
      fallbackTitle: '',
      fallbackDescription: '',
      pageTitleSiteName: process.env.PAGE_TITLE_SITE_NAME || '',
      siteRootUrl: process.env.SITE_ROOT_URL || '',
    },
  },

  devtools: { enabled: true },

  devServer: {
    host: '0.0.0.0',
    port: 3000,
  },

  vite: {
    plugins: [tailwindcss()],
  },

  modules: [
    '@nuxt/ui-pro',
    '@nuxtjs/color-mode',
    '@vueuse/nuxt',
    '@vueuse/motion/nuxt',
    '@nuxt/scripts',
    'nuxt-headlessui',
    'nuxt-schema-org',
  ],

  scripts: {
    registry: {
      googleAnalytics: { id: 'G-L2JCGM5R9C' },
      metaPixel:       { id: 'YOUR_ID' },
      hotjar:          { id: 6439262 },
    },
  },

  css: [
    '~/assets/css/main.css',
    '~/assets/css/breakpoints.css',
    '~/assets/css/animations.css',
    '~/assets/css/fallback-theme.css',
  ],

  colorMode: {
    classSuffix: '',
    preference: 'system',
  },
})