<script lang="ts" setup>

const route = useRoute();
const { slug } = route.params;

</script>
<template>
    <p>Product Page for product slug: {{ slug }}</p>
</template>