<script setup lang="ts">
import type { HighlightedBlogPostsData } from '~/types/page-blocks/highlighted-blog-posts';


defineProps<{
  data: HighlightedBlogPostsData
}>();
</script>

<template>
    <MaxWidthContentWrapper>
      <CardGallery class="my-8">
        <BlogPostCard
          v-for="blogPost in data.blogPosts"
          :key="blogPost.slug"
          :hero-image="blogPost.heroImage"
          :slug="blogPost.slug"
          :title="blogPost.title"
          :description="blogPost.short_description"
          :date-published="new Date(blogPost.published_at)"
        />
      </CardGallery>
    </MaxWidthContentWrapper>
</template>
