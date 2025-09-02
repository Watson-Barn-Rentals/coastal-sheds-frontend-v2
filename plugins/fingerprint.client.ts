import FingerprintJS from '@fingerprintjs/fingerprintjs'

const fpPromise = FingerprintJS.load()

export default defineNuxtPlugin(() => {
  return {
    provide: {
      fingerprint: () => fpPromise, // returns Promise<Agent>
    },
  }
})
