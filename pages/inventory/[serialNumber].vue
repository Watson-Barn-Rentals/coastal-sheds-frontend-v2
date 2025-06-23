<script lang="ts" setup>

const route = useRoute();
const { serialNumber } = route.params;

</script>
<template>
    <p>Inventory Page for Serial Number: {{ serialNumber }}</p>
</template>