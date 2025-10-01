<script setup lang="ts">
const legal = useRuntimeConfig().public

useHead({
  title: `Cookies Notice | ${legal.legalOwnerName}`,
  meta: [
    { name: 'description', content: `Cookies Notice for ${legal.legalOwnerName}. Learn how we use cookies, analytics, and your choices.` }
  ]
})
</script>

<template>
  <main class="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8 py-12 mt-8">
    <header class="mb-8">
      <h1 class="text-3xl font-semibold tracking-tight text-gray-900 dark:text-gray-100">
        Cookies Notice
      </h1>
      <p class="mt-2 text-sm text-gray-600 dark:text-gray-400">
        Last Updated:
        <time class="font-medium" :datetime="legal.legalEffectiveISO">{{ legal.legalEffectiveHuman }}</time>
      </p>
    </header>

    <section class="space-y-6 text-gray-800 dark:text-gray-200">
      <div>
        <h2 class="text-xl font-semibold text-gray-900 dark:text-gray-100">What Are Cookies?</h2>
        <p class="mt-2">
          Cookies are small files placed on your device to help operate and improve our site, remember preferences, and analyze usage.
          We also use similar technologies (e.g., pixels, local storage).
        </p>
      </div>

      <div>
        <h2 class="text-xl font-semibold text-gray-900 dark:text-gray-100">How We Use Cookies</h2>

        <div class="mt-3 rounded-lg border border-gray-200 dark:border-gray-700 overflow-hidden">
          <table class="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
            <thead class="bg-gray-50 dark:bg-gray-800">
              <tr>
                <th scope="col" class="px-4 py-3 text-left text-sm font-semibold text-gray-700 dark:text-gray-200">Category</th>
                <th scope="col" class="px-4 py-3 text-left text-sm font-semibold text-gray-700 dark:text-gray-200">Purpose</th>
                <th scope="col" class="px-4 py-3 text-left text-sm font-semibold text-gray-700 dark:text-gray-200">Examples</th>
                <th scope="col" class="px-4 py-3 text-left text-sm font-semibold text-gray-700 dark:text-gray-200">Duration</th>
              </tr>
            </thead>
            <tbody class="divide-y divide-gray-200 dark:divide-gray-700">
              <tr class="bg-white dark:bg-gray-900">
                <td class="px-4 py-3 align-top">Essential</td>
                <td class="px-4 py-3 align-top">Core site functions, security, load balancing.</td>
                <td class="px-4 py-3 align-top">Session ID, CSRF token</td>
                <td class="px-4 py-3 align-top">Session / short-term</td>
              </tr>
              <tr class="bg-white dark:bg-gray-900">
                <td class="px-4 py-3 align-top">Analytics</td>
                <td class="px-4 py-3 align-top">Understand site traffic and performance.</td>
                <td class="px-4 py-3 align-top">Google Analytics (GA4), Hotjar</td>
                <td class="px-4 py-3 align-top">Persistent (per provider)</td>
              </tr>
              <tr class="bg-white dark:bg-gray-900">
                <td class="px-4 py-3 align-top">Advertising/Remarketing</td>
                <td class="px-4 py-3 align-top">Show relevant ads and measure campaigns (if used).</td>
                <td class="px-4 py-3 align-top">Meta Pixel; Google Analytics remarketing features</td>
                <td class="px-4 py-3 align-top">Persistent (per provider)</td>
              </tr>
              <tr class="bg-white dark:bg-gray-900">
                <td class="px-4 py-3 align-top">Functionality</td>
                <td class="px-4 py-3 align-top">Remember preferences (e.g., saved items or location).</td>
                <td class="px-4 py-3 align-top">Preference settings</td>
                <td class="px-4 py-3 align-top">Persistent</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      <div>
        <h2 class="text-xl font-semibold text-gray-900 dark:text-gray-100">Your Choices</h2>
        <ul class="mt-2 list-disc pl-6 space-y-1">
          <li>Use any site controls provided to manage non-essential cookies.</li>
          <li>Set your browser to block or delete cookies. Note: essential cookies are required for basic functionality.</li>
          <li>For analytics/ads providers, you may opt out via their tools or industry pages.</li>
        </ul>
      </div>

      <div>
        <h2 class="text-xl font-semibold text-gray-900 dark:text-gray-100">Contact</h2>
        <p class="mt-2">
          Questions? Email
          <a class="text-blue-600 hover:underline" :href="`mailto:${legal.legalContactEmail}`">{{ legal.legalContactEmail }}</a>.
        </p>
      </div>
    </section>
  </main>
</template>
