<script setup lang="ts">
const legal = useRuntimeConfig().public

const venue =
  legal.legalVenueLocation && legal.legalVenueLocation.trim().length > 0
    ? legal.legalVenueLocation
    : `${legal.legalCity}, ${legal.legalState}`

useHead({
  title: `Terms of Use | ${legal.legalOwnerName}`,
  meta: [
    { name: 'description', content: `Terms of Use for ${legal.legalOwnerName}. Your use of this site and services.` }
  ]
})
</script>

<template>
  <main class="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8 py-12 mt-8">
    <header class="mb-8">
      <h1 class="text-3xl font-semibold tracking-tight text-gray-900 dark:text-gray-100">
        Terms of Use
      </h1>
      <p class="mt-2 text-sm text-gray-600 dark:text-gray-400">
        Last Updated:
        <time class="font-medium" :datetime="legal.legalEffectiveISO">{{ legal.legalEffectiveHuman }}</time>
      </p>
    </header>

    <section class="space-y-6 text-gray-800 dark:text-gray-200">
      <p>
        These Terms are between you and <strong>{{ legal.legalOwnerName }}</strong> (“Company”).
      </p>
      <p v-if="legal.legalOperatorName">
        The website is operated by <strong>{{ legal.legalOperatorName }}</strong> as Company’s service provider.
      </p>

      <div>
        <h2 class="text-xl font-semibold text-gray-900 dark:text-gray-100">Eligibility</h2>
        <p class="mt-2">You must be at least 18 years old to use this site.</p>
      </div>

      <div>
        <h2 class="text-xl font-semibold text-gray-900 dark:text-gray-100">Acceptable Use</h2>
        <ul class="mt-2 list-disc pl-6 space-y-1">
          <li>Do not misuse the site or interfere with its operation.</li>
          <li>No unlawful, infringing, or harmful content or conduct.</li>
          <li>No attempts to reverse engineer or resell the site without permission.</li>
        </ul>
      </div>

      <div>
        <h2 class="text-xl font-semibold text-gray-900 dark:text-gray-100">Intellectual Property</h2>
        <p class="mt-2">
          The site and its content are owned by {{ legal.legalOwnerName }} or its licensors. You may use the site for
          personal or internal business purposes; all other rights are reserved.
        </p>
      </div>

      <div>
        <h2 class="text-xl font-semibold text-gray-900 dark:text-gray-100">User Accounts & Content</h2>
        <p class="mt-2">We do not provide user accounts and do not host user-generated content.</p>
      </div>

      <div>
        <h2 class="text-xl font-semibold text-gray-900 dark:text-gray-100">Products & Links</h2>
        <p class="mt-2">
          Product details, pricing, and availability may change without notice. Links to third-party sites are for convenience;
          we are not responsible for their content or practices.
        </p>
      </div>

      <div>
        <h2 class="text-xl font-semibold text-gray-900 dark:text-gray-100">Disclaimers</h2>
        <p class="mt-2">
          THE SITE IS PROVIDED “AS IS” AND “AS AVAILABLE.” TO THE MAXIMUM EXTENT PERMITTED BY LAW, WE DISCLAIM ALL
          WARRANTIES, EXPRESS OR IMPLIED.
        </p>
      </div>

      <div>
        <h2 class="text-xl font-semibold text-gray-900 dark:text-gray-100">Limitation of Liability</h2>
        <p class="mt-2">
          TO THE MAXIMUM EXTENT PERMITTED BY LAW, {{ legal.legalOwnerName }} AND ITS AFFILIATES WILL NOT BE LIABLE FOR
          INDIRECT, INCIDENTAL, SPECIAL, CONSEQUENTIAL, EXEMPLARY, OR PUNITIVE DAMAGES, OR ANY LOSS OF PROFITS, REVENUES,
          DATA, OR GOODWILL.
        </p>
      </div>

      <div>
        <h2 class="text-xl font-semibold text-gray-900 dark:text-gray-100">Indemnification</h2>
        <p class="mt-2">
          You agree to defend, indemnify, and hold harmless {{ legal.legalOwnerName }} from claims arising out of your use of
          the site or violation of these Terms.
        </p>
      </div>

      <div>
        <h2 class="text-xl font-semibold text-gray-900 dark:text-gray-100">Governing Law & Venue</h2>
        <p class="mt-2">
          These Terms are governed by the laws of the State of {{ legal.legalGoverningState }}, without regard to conflicts
          of law principles. Exclusive venue for disputes is in {{ venue }}.
        </p>
      </div>

      <div>
        <h2 class="text-xl font-semibold text-gray-900 dark:text-gray-100">Changes</h2>
        <p class="mt-2">
          We may modify these Terms at any time. Updates are effective when posted, as indicated by the “Last Updated” date.
        </p>
      </div>

      <div>
        <h2 class="text-xl font-semibold text-gray-900 dark:text-gray-100">Contact</h2>
        <p class="mt-2">
          Questions? Contact
          <a class="text-blue-600 hover:underline" :href="`mailto:${legal.legalContactEmail}`">{{ legal.legalContactEmail }}</a>.
        </p>
      </div>
    </section>
  </main>
</template>
