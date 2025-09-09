import type { ReviewRequestChannelItem } from '~/types/review-request-channel-item'
import type { ReviewRequestItem } from '~/types/review-request-item'

export const submitReviewRequestChannelClickedEvent = async (reviewRequest: ReviewRequestItem, channel: ReviewRequestChannelItem): Promise<void> => {
  const config = useRuntimeConfig()

  try {
    $fetch(`${config.public.apiRootUrl}/api/review-requests/${encodeURIComponent(reviewRequest.slug)}/channel-clicked/${encodeURIComponent(channel.id)}`)
  } catch (err: any) {
    console.error('Error submitting review request channel clicked event:', err)
  }
}
