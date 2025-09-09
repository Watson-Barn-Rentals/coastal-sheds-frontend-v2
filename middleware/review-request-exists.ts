import { defineNuxtRouteMiddleware, navigateTo } from 'nuxt/app'
import { getReviewRequest } from '~/services/api/get-review-request'

export default defineNuxtRouteMiddleware(async (to) => {
  // Only guard routes that have a :slug param (e.g. /leave-a-review/:slug)
  const slug = to.params?.slug
  if (typeof slug !== 'string' || !slug.length) return

  try {
    await getReviewRequest(slug)
  } catch {
    // Any error -> redirect to the fallback page
    return navigateTo('/leave-us-a-review', { redirectCode: 302 })
  }
})
