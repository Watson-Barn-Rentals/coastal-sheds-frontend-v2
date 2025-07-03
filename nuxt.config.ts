import tailwindcss from "@tailwindcss/vite";

console.log('🛠  BUILD – PREVIEW_MODE =', process.env.PREVIEW_MODE);

const isPreview = process.env.PREVIEW_MODE === 'true';

// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: '2024-11-01',

  // enable SSR only in preview mode
  ssr: isPreview,

  // Nitro preset & prerender settings depend on preview mode
  nitro: {
    preset: isPreview ? 'netlify' : 'netlify-static',
    prerender: 
    {
      crawlLinks: false,
    },
  },

  // only prerender routes when NOT in preview
  routeRules: isPreview
    ? {}
    : {
        '/**': { prerender: true },
      },

  hooks: {
    async 'prerender:routes'(context) {
      const apiRoot = process.env.API_ROOT_URL;
      if (!apiRoot) {
        throw new Error('Missing API_ROOT_URL environment variable');
      }
      const res = await fetch(`${apiRoot}/api/get-prerender-page-list`);
      if (!res.ok) {
        throw new Error(`Failed to fetch page list: ${res.status} ${res.statusText}`);
      }
      const { data: pageList } = (await res.json()) as { data: string[] };
      for (const route of pageList) {
        context.routes.add(route);
      }
    },
  },

  runtimeConfig: {
    public: {
      apiRootUrl: process.env.API_ROOT_URL,
      previewMode: isPreview,
      mainSiteUrl: process.env.MAIN_SITE_URL || '',
      previewSiteUrl: process.env.PREVIEW_SITE_URL || '',
    },
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
      googleAnalytics: { id: 'G-L2JCGM5R9C' },
      metaPixel:       { id: 'YOUR_ID' },
      hotjar:          { id: 6439262 },
    },
  },

  plugins: [
    '~/plugins/vueuse-motion.ts',
  ],

  css: [
    '~/assets/css/main.css',
    '~/assets/css/theme.css',
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
});
