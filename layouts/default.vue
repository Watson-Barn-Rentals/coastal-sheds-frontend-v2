
<script lang="ts" setup>
    useHead({
      script: [
        {
          src: 'https://widget.leadferno.com/leadbox.js',
          'data-leadferno': '',
          'data-bid': '4435ba16-2987-4fbd-a93b-bcc263fda919',
          'data-url': 'https://api.leadferno.com/v0'
        }
      ]
    })
</script>
<template>
  <UApp>
      <Header />
      <main class="bg-background dark:bg-background-dark font-body overflow-auto min-h-screen">
        <slot />
      </main>
      <Footer />
  </UApp>
</template>
