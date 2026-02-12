<script setup lang="ts">
import { getHeaderSettings } from '~/services/api/get-header-settings'
import type { HeaderSettings } from '~/types/header-settings'
import { submitTrackingEvent } from '~/services/submit-tracking-event'

const isMenuOpen = ref(false)
const toggleMenu = () => { isMenuOpen.value = !isMenuOpen.value }

// ✅ Nuxt-state (serialized into payload)
const headerSettings = useState<HeaderSettings | null>('header-settings', () => null)

// ✅ Only fetch once per app load (SSR + client nav safe)
await callOnce('header-settings', async () => {
  headerSettings.value = await getHeaderSettings()
})

const handleHeaderPhoneCtaClick = () => {
  submitTrackingEvent('header-phone-cta-click')
}

const toTrailing = (url?: string) => {
  if (!url) return url as unknown as string
  if (/^(https?:|mailto:|tel:|#)/i.test(url)) return url
  let base = url.startsWith('/') ? url : `/${url}`
  const qIndex = base.indexOf('?')
  const hIndex = base.indexOf('#')
  const cut = [qIndex, hIndex].filter(i => i !== -1).sort((a,b)=>a-b)[0] ?? base.length
  const p = base.slice(0, cut).replace(/\/+/g, '/')
  const tail = base.slice(cut)
  const withSlash = p !== '/' && !p.endsWith('/') ? `${p}/` : p
  return withSlash + tail
}
</script>


<template>
	<div v-if="headerSettings && headerSettings.header_preset === 'floating-rounded'">
		<div
			:class="[
				'hidden sm:flex',
				'fixed top-0 left-0 w-full z-[100] flex px-4 py-2',
				'sm:justify-center justify-end'
			]"
		>
			<header
				:class="[
					'bg-background dark:bg-background-dark border-b-2 border-background-accent dark:border-background-accent-dark',
					'max-w-full h-[60px] rounded-full py-1 px-1',
					'shadow-xl border-2 border-background-accent dark:border-background-accent-dark',
				]"
			>
				<div class="hidden sm:flex mx-2 h-full items-center justify-between">
					<nav class="flex gap-x-2 md:gap-x-4 lg:gap-x-6 gap-y-24 flex-wrap justify-center items-center my-auto h-full overflow-hidden">
						<NavigationHomeNavbarItem
							:logo-url="headerSettings.logo_url"
							class="h-full mx-1"
						/>
						<NavigationNavbarItem
							v-for="(item, index) in headerSettings.menu"
							:key="`navbar-item-${index}`"
							:menu-item="item"
							class="text-xs md:text-sm lg:text-base hover:text-hovered-link"
						/>
						<a
							v-if="headerSettings.show_phone_call_to_action"
							:href="`tel:${headerSettings.phone_call_to_action_phone_number}`"
							class="bg-brand rounded-full flex flex-col items-center justify-center px-4 md:px-6 py-1 relative"
							@click="handleHeaderPhoneCtaClick"
						>
							<span class="text-white text-nowrap text-xs lg:text-sm">{{ headerSettings.phone_call_to_action_label }}</span>
							<span class="text-nowrap font-bold text-white text-xs lg:text-sm">
								{{ headerSettings.phone_call_to_action_phone_number.replace(/(\d{3})(\d{3})(\d{4})/, '($1) $2-$3') }}
							</span>
						</a>
						<ColorModeToggleButton v-if="headerSettings.show_display_mode_toggle" class="my-auto w-4 m-1" />
					</nav>
				</div>
			</header>
		</div>

		<div class="flex sm:hidden justify-between h-[58px] bg-background dark:bg-background-dark border-b-2 border-background-accent dark:border-background-accent-dark p-0.5">
			<HomeNavbarItem
				:logo-url="headerSettings.logo_url"
				class="h-full"
			/>
			<div class="flex fixed right-0 top-0 z-[100] m-1 p-1 h-[50px] w-[50px] justify-center items-center bg-background dark:bg-background-dark border-2 rounded-full border-background-accent dark:border-background-accent-dark cursor-pointer">
				<button
					@click="toggleMenu"
					class="focus:outline-none text-black dark:text-white h-8 w-8 cursor-pointer"
				>
					<UIcon name="material-symbols:menu-rounded" class="h-8 w-8 cursor-pointer" />
				</button>
			</div>
		</div>
	</div>

	<div v-if="headerSettings && headerSettings.header_preset === 'standard-full-width'">
		<div class="w-full h-[60px] hidden sm:block"></div>
		<div
			:class="[
				'hidden sm:flex',
				'fixed top-0 left-0 w-full z-[100] flex',
				'sm:justify-center justify-end'
			]"
		>
			<header
				:class="[
					'bg-background dark:bg-background-dark border-b-2 border-background-accent dark:border-background-accent-dark',
					'max-w-full h-[60px] py-1 px-1 w-full',
					'shadow-xl border-b-2 border-background-accent dark:border-background-accent-dark',
				]"
			>
				<div class="hidden sm:flex mx-2 h-full items-center justify-between">
					<nav class="flex gap-x-2 md:gap-x-4 lg:gap-x-6 gap-y-24 flex-wrap justify-center items-center my-auto h-full overflow-hidden w-full">
						<HomeNavbarItem
							:logo-url="headerSettings.logo_url"
							class="h-full mx-1"
						/>
						<NavigationNavbarItem
							v-for="(item, index) in headerSettings.menu"
							:key="`navbar-item-${index}`"
							:menu-item="item"
							class="text-xs md:text-sm lg:text-base hover:text-hovered-link"
						/>
						<a
							v-if="headerSettings.show_phone_call_to_action"
							:href="`tel:${headerSettings.phone_call_to_action_phone_number}`"
							class="bg-brand rounded-full flex flex-col items-center justify-center px-4 md:px-6 py-1 relative"
							@click="handleHeaderPhoneCtaClick"
						>
							<span class="text-white text-nowrap text-xs lg:text-sm">{{ headerSettings.phone_call_to_action_label }}</span>
							<span class="text-nowrap font-bold text-white text-xs lg:text-sm">
								{{ headerSettings.phone_call_to_action_phone_number.replace(/(\d{3})(\d{3})(\d{4})/, '($1) $2-$3') }}
							</span>
						</a>
						<ColorModeToggleButton v-if="headerSettings.show_display_mode_toggle" class="my-auto w-4 m-1" />
					</nav>
				</div>
			</header>
		</div>

		<div class="flex sm:hidden justify-between h-[58px] bg-background dark:bg-background-dark border-b-2 border-background-accent dark:border-background-accent-dark p-0.5">
			<HomeNavbarItem
				:logo-url="headerSettings.logo_url"
				class="h-full"
			/>
			<div class="flex fixed right-0 top-0 z-[100] m-1 p-1 h-[50px] w-[50px] justify-center items-center bg-background dark:bg-background-dark border-2 rounded-full border-background-accent dark:border-background-accent-dark cursor-pointer">
				<button
					@click="toggleMenu"
					class="focus:outline-none text-black dark:text-white h-8 w-8 cursor-pointer"
				>
					<UIcon name="material-symbols:menu-rounded" class="h-8 w-8 cursor-pointer" />
				</button>
			</div>
		</div>
	</div>

	<USlideover
		v-if="headerSettings"
		v-model:open="isMenuOpen"
		:ui="{ content: 'bg-background dark:bg-background-dark', wrapper: 'fixed inset-0 flex z-50 w-[90vw] ml-[10vw] z-[9999999999]' }"
		color="white"
		side="right"
	>
		<template #content>
			<div class="flex">
				<a
					:href="toTrailing('/')"
					class="h-24 max-w-1/2 m-4 cursor-pointer"
					@click="toggleMenu"
				>
					<div class="w-full h-full flex items-center justify-center">
						<img :src="headerSettings?.logo_url" alt="Logo" class="max-w-full max-h-full object-contain" />
					</div>
				</a>
				<UIcon name="material-symbols:close-rounded" class="absolute top-4 right-4 h-12 w-12 text-black dark:text-white cursor-pointer" @click="toggleMenu" />
			</div>

			<div class="flex flex-col gap-4 p-4 pb-24 overflow-y-auto">
				<NavigationSlideoverNavbarItem
					v-for="(item, index) in headerSettings.menu"
					:key="`slideover-navbar-item-${index}`"
					:menu-item="item"
					@close-mobile-menu="toggleMenu"
				/>
				<NavigationSlideoverColorModeToggle v-if="headerSettings.show_display_mode_toggle" />
			</div>
		</template>
	</USlideover>
</template>
