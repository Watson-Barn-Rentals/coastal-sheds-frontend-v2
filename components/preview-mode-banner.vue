<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue'
import { useCookie } from '#imports'

const TTL_MS = 30 * 60 * 1000  // 30 minutes

const previewCookie = useCookie('previewToken', { path: '/' })
const show = ref(false)
const timeLeft = ref('00:00')

let timer: ReturnType<typeof setInterval>

function formatTime(ms: number) {
  const total = Math.max(0, ms)
  const m = Math.floor(total / 60000)
  const s = Math.floor((total % 60000) / 1000)
  return `${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`
}

function updateCountdown() {
  const start = Number(localStorage.getItem('previewSessionStart') || '0')
  const elapsed = Date.now() - start
  const remaining = TTL_MS - elapsed
  timeLeft.value = formatTime(remaining)
  if (remaining <= 0) {
    exitPreview()
  }
}

function exitPreview() {
previewCookie.value = null
localStorage.removeItem('previewSessionStart')
  show.value = false
  clearInterval(timer)
  // optionally reload to clear drafts
  window.location.reload()
}

onMounted(() => {
  const token = previewCookie.value
  if (token) {
    show.value = true
    if (!localStorage.getItem('previewSessionStart')) {
      localStorage.setItem('previewSessionStart', Date.now().toString())
    }
    updateCountdown()
    timer = setInterval(updateCountdown, 1000)
  }
})

const text = computed<string>(() => {
  return `You are in preview mode. Expires in ${timeLeft.value}.`
})

onUnmounted(() => {
  clearInterval(timer)
})
</script>

<template>
    <div
        v-if="show" 
        class="w-full bg-red-500 flex justify-center p-4 gap-4"
    >
        <span class="text-white">{{ text }}</span>
        <UButton
            variant="outline"
            label="Exit Preview Mode"
            color="neutral"
            icon="material-symbols:exit-to-app"
            size="sm"
            class="cursor-pointer"
            @click="exitPreview"
        />
    </div>
</template>

