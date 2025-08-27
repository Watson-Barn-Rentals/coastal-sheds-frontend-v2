<script setup lang="ts">
defineProps<{
  content: string
}>()
</script>

<template>
  <div
    class="wysiwyg-formatting"
    v-html="content"
  />
</template>

<style>
.wysiwyg-formatting ul {
  list-style-type: disc;
  padding-left: 1.5rem; /* adjust indentation as needed */
  margin: 0.5rem 0;
}

.wysiwyg-formatting ol {
  list-style-type: decimal;
  padding-left: 1.5rem; /* adjust indentation as needed */
  margin: 0.5rem 0;
}

.wysiwyg-formatting p + p {
  margin-top: 1rem;
}

</style>
