import { defineNuxtConfig } from 'nuxt/config'
import tailwindcss from '@tailwindcss/vite'

export default defineNuxtConfig({
  compatibilityDate: '2024-11-01',

  // enable SSR so we can prerender …
  ssr: true,

  // … and emit a fully static site
  nitro: {
    preset: 'static',
  },

  // prerender every route
  routeRules: {
    '/**': { prerender: true },
    '/**?token=**': { ssr: true },
  },

  plugins: [
    '~/plugins/vueuse-motion.ts',
  ],

  hooks: {
    // fetch dynamic route list at build time
    'prerender:routes': async (ctx) => {
      const apiRoot = process.env.API_ROOT_URL
      if (!apiRoot) {
        throw new Error('Missing API_ROOT_URL environment variable')
      }
      const res = await fetch(`${apiRoot}/api/get-prerender-page-list`)
      if (!res.ok) {
        throw new Error(`Failed to fetch page list: ${res.status} ${res.statusText}`)
      }
      const { data: pageList } = await res.json() as { data: string[] }
      pageList.forEach(route => ctx.routes.add(route))
    },
  },

  runtimeConfig: {
    public: {
      apiRootUrl: process.env.API_ROOT_URL!,
      mainSiteUrl: process.env.MAIN_SITE_URL || '',
    },
  },

  devtools: { enabled: true },
  devServer: { host: '0.0.0.0', port: 3000 },

  modules: [
    '@nuxt/ui-pro',
    '@nuxtjs/color-mode',
    '@vueuse/nuxt',
    '@vueuse/motion/nuxt',
    '@nuxt/scripts',
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
    '~/assets/css/theme.css',
  ],

  vite: {
    plugins: [tailwindcss()],
  },

  colorMode: {
    classSuffix: '',
    preference: 'system',
  },
})
