<script lang="ts" setup>

const route = useRoute();
const { slug } = route.params;

</script>
<template>
    <p>Location Page for product slug: {{ slug }}</p>
</template>