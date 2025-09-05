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
      <FaqAccordion 
        :data="data.faqs" 
        class="mt-8" 
        :wrapper-custom-styling="data.wrapperCustomStyling"
        :faq-item-custom-styling="data.faqItemCustomStyling"
        :question-custom-styling="data.questionCustomStyling"
        :answer-custom-styling="data.answerCustomStyling"
      />
    </MaxWidthContentWrapper>
</template>
