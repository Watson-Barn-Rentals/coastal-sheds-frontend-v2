<script setup lang="ts">
import type { HighlightedFaqsData } from '~/types/page-blocks/highlighted-faqs';


defineProps<{
  data: HighlightedFaqsData
}>();
</script>

<template>
   <Heading 
      text="Frequently Asked Questions" 
      heading-level="h2"
      text-alignment="center"
    />
    <MaxWidthContentWrapper>
      <FaqAccordion :data="data.faqs" class="mtslug-8" />
    </MaxWidthContentWrapper>
</template>
