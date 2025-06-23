// plugins/vueuse-motion.ts
import { defineNuxtPlugin } from '#app'
import { MotionPlugin } from '@vueuse/motion'

export default defineNuxtPlugin((nuxtApp) => {
  // registers both the v-motion directive and <Motion> components globally
  nuxtApp.vueApp.use(MotionPlugin)
})
