// plugins/asyncDataOverride.ts
import { useAsyncData as _useAsyncData } from '#app'

export function useAsyncData(key: any, handler: any, opts: any = {}) {
  // In static (non-preview) mode, disable client-side re-fetch
  const isPreview = process.env.PREVIEW_MODE === 'true'
  if (!isPreview) {
    opts = {
      // only run on server/build
      server: true,
      // never run on client
      client: false,
      ...opts,
    }
  }
  return _useAsyncData(key, handler, opts)
}
