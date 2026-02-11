<script setup lang="ts">
const legal = useRuntimeConfig().public

useHead({
  title: `Privacy Policy | ${legal.legalOwnerName}`,
  meta: [
    { name: 'description', content: `Privacy Policy for ${legal.legalOwnerName}. How we collect and use information for customers in the Southeastern United States.` }
  ]
})
</script>

<template>
  <main class="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8 py-12 mt-8">
    <header class="mb-8">
      <h1 class="text-3xl font-semibold tracking-tight text-gray-900 dark:text-gray-100">
        Privacy Policy
      </h1>
      <p class="mt-2 text-sm text-gray-600 dark:text-gray-400">
        Last Updated:
        <time class="font-medium" :datetime="legal.legalEffectiveISO">{{ legal.legalEffectiveHuman }}</time>
      </p>
    </header>

    <section class="space-y-6 text-gray-800 dark:text-gray-200">
      <div>
        <h2 class="text-xl font-semibold text-gray-900 dark:text-gray-100">Who We Are</h2>
        <p class="mt-2">
          {{ legal.legalOwnerName }} (the “Company”), a {{ legal.legalEntityType }} located in
          {{ legal.legalCity }}, {{ legal.legalState }}.
          Contact:
          <a class="text-blue-600 hover:underline" :href="`mailto:${legal.legalContactEmail}`">{{ legal.legalContactEmail }}</a>
          <span v-if="legal.legalContactPhone"> • {{ legal.legalContactPhone }}</span>.
        </p>
        <p class="mt-2" v-if="legal.legalOperatorName">
          This site is operated by <strong>{{ legal.legalOperatorName }}</strong> as Company’s service provider.
        </p>
      </div>

      <div>
        <h2 class="text-xl font-semibold text-gray-900 dark:text-gray-100">Scope</h2>
        <p class="mt-2">
          {{ legal.legalRegionNote }}
        </p>
      </div>

      <div>
        <h2 class="text-xl font-semibold text-gray-900 dark:text-gray-100">Information We Collect</h2>
        <ul class="mt-2 list-disc pl-6 space-y-1">
          <li><strong>Information you provide:</strong> details submitted via contact forms (e.g., name, phone number, email).</li>
          <li><strong>Automatic data:</strong> IP address, device/browser info, and site usage via cookies or similar technologies.</li>
        </ul>
      </div>

      <div>
        <h2 class="text-xl font-semibold text-gray-900 dark:text-gray-100">How We Use Information</h2>
        <ul class="mt-2 list-disc pl-6 space-y-1">
          <li>Respond to inquiries and provide customer support.</li>
          <li>Operate, maintain, and improve the site.</li>
          <li>Analyze site performance and usage (e.g., analytics).</li>
          <li>Protect against fraud/abuse and comply with law.</li>
        </ul>
      </div>

      <div>
        <h2 class="text-xl font-semibold text-gray-900 dark:text-gray-100">Cookies & Tracking</h2>
        <p class="mt-2">
          We use cookies for essential functions and analytics. Google Analytics is connected and may be used for remarketing.
          We also use Meta Pixel and Hotjar. See our
          <AppLink class="text-blue-600 hover:underline" to="/cookies">Cookies Notice</AppLink> for details and choices.
        </p>
      </div>

      <div>
        <h2 class="text-xl font-semibold text-gray-900 dark:text-gray-100">Sharing of Information</h2>
        <p class="mt-2">
          We share information with service providers who help run the site (e.g., hosting on Netlify,
          analytics via Google Analytics, Hotjar, and Meta Pixel). These providers process information on our
          behalf under appropriate agreements.
        </p>
        <p class="mt-2 italic">
          We do not sell or share personal information for targeted advertising.
        </p>
      </div>

      <div>
        <h2 class="text-xl font-semibold text-gray-900 dark:text-gray-100">Your Choices</h2>
        <ul class="mt-2 list-disc pl-6 space-y-1">
          <li><strong>Communications:</strong> If you receive marketing, you can opt out using the links provided or by contacting us.</li>
          <li><strong>Cookies:</strong> Manage cookies in your browser and see our <AppLink class="text-blue-600 hover:underline" to="/cookies">Cookies Notice</AppLink>.</li>
          <li><strong>Access/Deletion:</strong> Request access to or deletion of your personal information at
            <a class="text-blue-600 hover:underline" :href="`mailto:${legal.legalContactEmail}`">{{ legal.legalContactEmail }}</a>.
          </li>
        </ul>
      </div>

      <div>
        <h2 class="text-xl font-semibold text-gray-900 dark:text-gray-100">Children’s Privacy</h2>
        <p class="mt-2">
          Our services are not directed to children under 13, and we do not knowingly collect their personal information.
        </p>
      </div>

      <div>
        <h2 class="text-xl font-semibold text-gray-900 dark:text-gray-100">Data Retention</h2>
        <p class="mt-2">
          We retain information only as long as necessary for the purposes above or as required by law.
        </p>
      </div>

      <div>
        <h2 class="text-xl font-semibold text-gray-900 dark:text-gray-100">Security</h2>
        <p class="mt-2">
          We use reasonable administrative, technical, and physical safeguards. No method of transmission or storage is 100% secure.
        </p>
      </div>

      <div>
        <h2 class="text-xl font-semibold text-gray-900 dark:text-gray-100">Changes</h2>
        <p class="mt-2">
          We may update this Policy. Changes are effective when posted, as reflected by the “Last Updated” date.
        </p>
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
