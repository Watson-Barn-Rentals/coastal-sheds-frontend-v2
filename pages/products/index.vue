<script lang="ts" setup>
import { getProductCategoriesList } from '~/services/api/get-product-categories-list'
import { type ProductCategoryItem } from '~/types/product-category-item'

definePageMeta({
  title: 'Browse Product Categories',
  meta: [
    {
      name: 'description',
      content: 'Browse our product categories'
    }
  ],
  layout: 'default',
})

const { data } = await useAsyncData<ProductCategoryItem[]>(
  'product-categories-list',
  getProductCategoriesList,
)
</script>

<template>
    <Heading 
      text="Browse Products & Services" 
      heading-level="h1"
      text-alignment="center"
      class="mt-12 md:mt-24"
    />
    <p class="text-center text-lg md:text-xl mb-8 mt-4">Explore our wide range of products to find the perfect fit for your needs.</p>
    <MaxWidthContentWrapper>
      <CardGallery class="my-8">
        <ProductCard
          v-for="productCategory in (data || [])"
          :key="productCategory.slug"
          class="h-full"
          :heroImage="productCategory.heroImage"
          :title="productCategory.title"
          :description="productCategory.short_description"
          :link="productCategory.override_page_url ? productCategory.override_page_url : `/product-categories/${productCategory.slug}`"
        />
        <NoItemsCard v-if="data!.length === 0" message="No Products to Display" />
      </CardGallery>
    </MaxWidthContentWrapper>
</template>
