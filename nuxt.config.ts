// nuxt.config.ts
import { defineNuxtConfig } from 'nuxt/config'
import tailwindcss from '@tailwindcss/vite'
import fs from 'node:fs'
import path from 'node:path'

const isPreviewMode = process.env.PREVIEW_MODE === 'true'
const staticPageRoutes = new Set<string>()

export default defineNuxtConfig({
  compatibilityDate: '2024-11-01',
  ssr: !isPreviewMode,

  routeRules: {},

  nitro: {
    preset: 'netlify',
    prerender: {
      crawlLinks: false,
    },
  },

  plugins: [
    '~/plugins/vueuse-motion.ts',
    '~/plugins/site-settings.ts',
    '~/plugins/fingerprint.client.ts',
  ],

  /**
   * ✅ Use Nuxt's top-level hooks:
   *    1) 'prerender:routes' (your existing prerendering)
   *    2) 'nitro:init' -> nitro.hooks.hook('compiled', ...) to write _redirects
   */
  hooks: {
    // keep your prerender logic
    'prerender:routes': async (ctx) => {
      if (isPreviewMode) return

      const apiRoot = process.env.API_ROOT_URL
      if (!apiRoot) throw new Error('Missing API_ROOT_URL')

      const res = await fetch(`${apiRoot}/api/get-prerender-page-list`)
      if (!res.ok) throw new Error(`Failed to fetch page list: ${res.status} ${res.statusText}`)
      const { data: pageList } = (await res.json()) as { data: string[] }
      pageList.forEach(route => ctx.routes.add(route))
    },

    // ✅ Attach to Nitro's lifecycle after Nitro instance exists
    'nitro:init': (nitro) => {
      nitro.hooks.hook('compiled', async () => {
        // Optionally skip in preview mode
        if (isPreviewMode) return

        const apiRoot = process.env.API_ROOT_URL
        if (!apiRoot) {
          console.warn('Missing API_ROOT_URL; skipping _redirects generation.')
          return
        }

        try {
          const res = await fetch(`${apiRoot}/api/redirects`, {
            headers: { Accept: 'application/json' },
          })
          if (!res.ok) {
            throw new Error(`Failed to fetch redirects: ${res.status} ${res.statusText}`)
          }

          const json = (await res.json()) as {
            data: Array<{ from: string; to: string; status?: number | string; force?: boolean; enabled?: boolean }>
          }

          const lines: string[] = []
          for (const r of json.data ?? []) {
            if (r.enabled === false) continue
            const status = String(r.status ?? '301')
            const bang = r.force ? '!' : ''
            // Netlify format: "<from>  <to>  <status[!]>"
            lines.push(`${r.from}  ${r.to}  ${status}${bang}`)
          }

          // Merge with optional static /public/_redirects
          const publishDir = nitro.options.output.publicDir
          const redirectsPath = path.join(publishDir, '_redirects')

          let baseline = ''
          const baselinePath = path.join(process.cwd(), 'public', '_redirects')
          if (fs.existsSync(baselinePath)) {
            baseline = fs.readFileSync(baselinePath, 'utf8').trim()
          }

          const dynamicRules = lines.join('\n').trim()
          const final = [baseline, dynamicRules].filter(Boolean).join('\n') + '\n'
          fs.writeFileSync(redirectsPath, final, 'utf8')
          console.log(`Wrote ${lines.length} redirect rules to ${redirectsPath}`)
        } catch (err) {
          console.error('Failed to build _redirects from CMS:', err)
        }
      })
    },
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
      metaPixel: { id: 'YOUR_ID' },
      hotjar: { id: 6439262 },
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
