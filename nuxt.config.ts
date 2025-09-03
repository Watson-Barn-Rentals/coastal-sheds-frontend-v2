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

  hooks: {
    'prerender:routes': async (ctx) => {
      if (isPreviewMode) return

      const apiRoot = process.env.API_ROOT_URL
      if (!apiRoot) throw new Error('Missing API_ROOT_URL')

      const res = await fetch(`${apiRoot}/api/get-prerender-page-list`)
      if (!res.ok) throw new Error(`Failed to fetch page list: ${res.status} ${res.statusText}`)
      const { data: pageList } = (await res.json()) as { data: string[] }
      pageList.forEach(route => ctx.routes.add(route))
    },

    // After Nitro compiles, emit _redirects and netlify-forms.html into the publish dir
    'nitro:init': (nitro) => {
      nitro.hooks.hook('compiled', async () => {
        if (isPreviewMode) return

        const apiRoot = process.env.API_ROOT_URL
        if (!apiRoot) {
          console.warn('Missing API_ROOT_URL; skipping _redirects & forms registration.')
          return
        }

        const publishDir = nitro.options.output.publicDir

        /* ---------- 1) Build Netlify `_redirects` from CMS ---------- */
        try {
          const res = await fetch(`${apiRoot}/api/redirects`, { headers: { Accept: 'application/json' } })
          if (!res.ok) throw new Error(`Failed to fetch redirects: ${res.status} ${res.statusText}`)

          const json = (await res.json()) as {
            data: Array<{ from: string; to: string; status?: number | string; force?: boolean; enabled?: boolean }>
          }

          const lines: string[] = []
          for (const r of json.data ?? []) {
            if (r.enabled === false) continue
            const status = String(r.status ?? '301')
            const bang = r.force ? '!' : ''
            lines.push(`${r.from}  ${r.to}  ${status}${bang}`) // Netlify: "<from>  <to>  <status[!]>"
          }

          const redirectsPath = path.join(publishDir, '_redirects')
          const baselinePath = path.join(process.cwd(), 'public', '_redirects')
          let baseline = ''
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

        /* ---------- 2) Generate Netlify Forms registration ---------- */
        try {
          // 👉 build an endpoint that returns minimal detection data
          // shape: { data: Array<{ netlifyName: string; fields: Array<{ key: string; type: string; options?: Array<{value:string;label:string}> }> }> }
          const res = await fetch(`${apiRoot}/api/list-forms`, { headers: { Accept: 'application/json' } })
          if (!res.ok) throw new Error(`list-forms ${res.status} ${res.statusText}`)
          const { data } = await res.json() as {
            data: Array<{ netlifyName: string; fields: Array<{ key: string; type: string; options?: Array<{ value: string; label: string }> }> }>
          }

          const chunks: string[] = []
          chunks.push(
            '<!doctype html><html><head><meta charset="utf-8"><title>Netlify Forms Detection</title></head><body style="display:none;">'
          )

          for (const form of data ?? []) {
            chunks.push(`<form name="${form.netlifyName}" data-netlify="true" netlify>`)
            // include a honeypot so detection sees it:
            chunks.push(`<input type="text" name="bot-field" />`)

            for (const f of form.fields ?? []) {
              const t = String(f.type || '').toLowerCase()
              if (t === 'hidden') {
                chunks.push(`<input type="hidden" name="${f.key}" value="">`)
              } else if (t === 'checkbox' && (f.options?.length ?? 0) > 0) {
                // ✅ IMPORTANT: use [] for multi-value names, matching your runtime submission
                chunks.push(`<input type="checkbox" name="${f.key}[]" value="${f.options![0].value}">`)
              } else if (t === 'radio' && (f.options?.length ?? 0) > 0) {
                chunks.push(`<input type="radio" name="${f.key}" value="${f.options![0].value}">`)
              } else if (t === 'select') {
                const opt = f.options?.[0]?.value ?? ''
                chunks.push(`<select name="${f.key}"><option value="${opt}">${opt}</option></select>`)
              } else if (t === 'file') {
                // Netlify only supports 1 file per field
                chunks.push(`<input type="file" name="${f.key}">`)
              } else {
                // text/email/tel/url/password/textarea fallback as text
                chunks.push(`<input type="text" name="${f.key}" value="">`)
              }
            }

            chunks.push('</form>')
          }

          chunks.push('</body></html>')

          const out = chunks.join('\n')
          const publishDir = nitro.options.output.publicDir
          const detectionPath = path.join(publishDir, '_netlify-forms.html')
          fs.writeFileSync(detectionPath, out, 'utf8')
          console.log(`Wrote Netlify detection file: ${detectionPath}`)
        } catch (e) {
          console.warn('Skipping _netlify-forms.html generation:', e)
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
