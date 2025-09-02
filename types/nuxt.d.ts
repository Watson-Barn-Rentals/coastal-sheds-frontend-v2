import type { Agent } from '@fingerprintjs/fingerprintjs'

declare module '#app' {
  interface NuxtApp {
    $fingerprint: () => Promise<Agent>
  }
}
declare module 'vue' {
  interface ComponentCustomProperties {
    $fingerprint: () => Promise<Agent>
  }
}
export {}
