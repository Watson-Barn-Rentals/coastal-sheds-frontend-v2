<script lang="ts" setup>
import MaxWidthContentWrapper from '~/components/max-width-content-wrapper.vue'
import { getBlogPost } from '~/services/api/get-blog-post'
import type { BlogPostData } from '~/types/blog-post-data'

const config = useRuntimeConfig()
const route = useRoute()
const slug = computed(() => route.params.slug as string)

definePageMeta({ layout: 'default', key: r => r.fullPath })
useHead({
  link: [{ rel: 'canonical', href: `${config.public.siteRootUrl}/blog/${slug.value}` }],
})

const { data, pending, error, refresh } = await useAsyncData<BlogPostData>(
  () => `blog-post:${slug.value}`,
  () => getBlogPost(slug.value),
  { watch: [slug] }
)

useSeoMeta({
  title: () => `${data.value?.title ?? ''}${ data.value?.published_at ? ` (${new Date(data.value.published_at).toLocaleDateString()})` : ''} - ${config.public.siteName}`,
  description: () => data.value?.short_description ?? '',
})

useBlogPostSchema({
  title: computed(() => data.value!.title),
  description: computed(() => data.value!.short_description),
  slug: computed(() => data.value!.slug),
  publishedAt: computed(() => new Date(data.value!.published_at).toISOString()),
})

</script>

<template>
  <PageDataGate :sources="[{ data, pending, error, refresh }]">
    <div 
      v-if="data!.heroImage" 
      class="relative overflow-hidden [aspect-ratio:2/1] sm:[aspect-ratio:3/1] md:[aspect-ratio:4/1]"
    >
      <ResponsiveImage
        :image-media-item="data!.heroImage"
        class="absolute inset-0 size-full object-contain fade-bottom-mask"
      />
  
    </div>
    <div class="absolute top-0 left-0 w-full flex flex-col justify-center mt-[86px]">
      <Heading 
        class="w-full"
        :text="data!.title" 
        heading-level="h1"
        text-alignment="center"
        :class="{
          'medium-black-glow text-white': data!.heroImage,
        }"
      />
      <p
        class="font-title text-center mt-4"
        :class="{
          'medium-black-glow text-white': data!.heroImage,
        }"
      >
        Published {{ new Date(data!.published_at).toLocaleDateString() }}
      </p>
    </div>
    
  
    <MaxWidthContentWrapper>
        <PageBlockRenderer
          class="mt-8"
          :page-blocks="data!.blocks"
        />
        <div
        v-if="data!.relatedBlogPosts && data!.relatedBlogPosts.length"
        >
          <Heading 
            class="w-full"
            text="Explore Related Blog Posts" 
            heading-level="h2"
            text-alignment="center"
          />
          <CardGallery 
            
            class="my-8"
          >
            <BlogPostCard
              v-for="blogPost in data!.relatedBlogPosts"
              :key="blogPost.slug"
              :hero-image="blogPost.heroImage"
              :slug="blogPost.slug"
              :title="blogPost.title"
              :description="blogPost.short_description"
              :date-published="new Date(blogPost.published_at)"
            />
          </CardGallery>
        </div>
    </MaxWidthContentWrapper>
  </PageDataGate>
</template>

<style scoped>
.medium-black-glow {
  filter: drop-shadow(0 0 4px black) drop-shadow(0 0 8px black);
}

/* Fade bottom of image to transparent */
.fade-bottom-mask {
  mask-image: linear-gradient(to bottom, rgba(0,0,0,1) 50%, rgba(0,0,0,0) 100%);
  -webkit-mask-image: linear-gradient(to bottom, rgba(0,0,0,1) 50%, rgba(0,0,0,0) 100%);
}
</style>
