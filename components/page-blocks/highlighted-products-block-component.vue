<script setup lang="ts">
import type { HighlightedProductsData } from '~/types/page-blocks/highlighted-products';


defineProps<{
  data: HighlightedProductsData
}>();
</script>

<template>
      <MaxWidthContentWrapper>
        <CardGallery class="my-8">
          <ProductCard
            v-for="product in data.products"
            :key="product.slug"
            class="h-full"
            :heroImage="product.heroImage"
            :title="product.title"
            :description="product.short_description"
            :showStartingPrice="data.showStartingPrice"
            :startingPrice="product.starting_price ?? undefined"
            :show3dDesignLink="data.show3dDesignLink"
            :designerLink="product.designer_link ?? undefined"
            :link="
              product.override_page_url
                ? product.override_page_url
                : `/product-categories/${product.slug}`
            "
          />
          <NoItemsCard
            v-if="data.products!.length === 0"
            message="No Products to Display"
          />
        </CardGallery>
      </MaxWidthContentWrapper>
</template>
