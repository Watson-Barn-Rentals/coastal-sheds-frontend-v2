import tailwindcss from "@tailwindcss/vite";
import { getPrerenderPageList } from "./services/api/get-prerender-page-list";

// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: '2024-11-01',
  ssr: true,
  dev: true,
  hooks: {
    async "prerender:routes"(context) {
      const pagesList = await getPrerenderPageList();

      //TODO - Add blog and other dynamic routes here

      const allPrerenderRoutes = [...pagesList]

      for (const page of allPrerenderRoutes) {
        context.routes.add(page);
      }
    },
  },
  nitro: {
    preset: 'netlify',
  },
  runtimeConfig: {
    public: {
      apiRootUrl: process.env.API_ROOT_URL
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