<script setup lang="ts">
import type { FormColumnData } from '~/types/page-blocks/column-sections/form-column-section';


defineProps<{
  data: FormColumnData
}>();
</script>

<template>
  <FormRenderer 
    :form="data.form" 
    :submit-label="data.submitLabel"
  />
</template>
