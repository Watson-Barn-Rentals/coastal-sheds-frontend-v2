<script lang="ts" setup>
import { getAllBlogPosts } from '~/services/api/get-all-blog-posts'
import type { BlogPostData } from '~/types/blog-post-data'

definePageMeta({ layout: 'default', key: r => 'blog-posts' })


const { data, pending, error, refresh } = await useAsyncData<BlogPostData[]>(
  'all-blog-posts',
  getAllBlogPosts,
)

useSeoMeta({
  title: () => 'Browse Blog Posts',
  description: () => 'Browse all of our blog posts — practical guides, showcased products, and more.'
})
</script>

<template>
    <Heading 
      text="Browse All Blog Posts" 
      heading-level="h1"
      text-alignment="center"
      class="mt-12 md:mt-24"
    />
    <MaxWidthContentWrapper>
      <CardGallery class="my-8">
        <BlogPostCard
          v-for="blogPost in data"
          :key="blogPost.slug"
          :hero-image="blogPost.heroImage"
          :slug="blogPost.slug"
          :title="blogPost.title"
          :description="blogPost.short_description"
          :date-published="new Date(blogPost.published_at)"
        />
        <NoItemsCard v-if="data!.length === 0" message="No Blog Posts to Display" />
      </CardGallery>
    </MaxWidthContentWrapper>
</template>
