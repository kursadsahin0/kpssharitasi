<template>
  <div v-if="isConfigured" class="adsense-block">
    <ins
      class="adsbygoogle"
      style="display: block"
      :data-ad-client="client"
      :data-ad-slot="adSlot"
      :data-ad-format="format"
      :data-full-width-responsive="fullWidthResponsive ? 'true' : 'false'"
    />
  </div>
</template>

<script setup>
import { computed, nextTick, onMounted, ref } from 'vue'

const props = defineProps({
  adSlot: { type: String, required: true },
  client: { type: String, default: '' },
  format: { type: String, default: 'auto' },
  fullWidthResponsive: { type: Boolean, default: true },
})

const scriptLoaded = ref(false)

const client = computed(() => props.client || import.meta.env.VITE_ADSENSE_CLIENT || '')
const adSlot = computed(() => props.adSlot)
const isConfigured = computed(() => Boolean(client.value && adSlot.value))

function ensureAdSenseScript() {
  if (!isConfigured.value) return

  const src = `https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=${client.value}`
  const existing = document.querySelector(`script[src="${src}"]`)
  if (existing) {
    scriptLoaded.value = true
    return
  }

  const script = document.createElement('script')
  script.async = true
  script.src = src
  script.crossOrigin = 'anonymous'
  script.onload = () => {
    scriptLoaded.value = true
  }
  script.onerror = () => {
    scriptLoaded.value = false
  }
  document.head.appendChild(script)
}

async function renderAd() {
  if (!isConfigured.value || !scriptLoaded.value) return
  await nextTick()
  try {
    ;(window.adsbygoogle = window.adsbygoogle || []).push({})
  } catch {
    // Ad blockers or duplicate push can throw; ignore safely.
  }
}

onMounted(async () => {
  ensureAdSenseScript()
  if (scriptLoaded.value) {
    await renderAd()
    return
  }
  const timer = setInterval(async () => {
    if (!scriptLoaded.value) return
    clearInterval(timer)
    await renderAd()
  }, 150)
  setTimeout(() => clearInterval(timer), 5000)
})
</script>

<style scoped>
.adsense-block {
  min-height: 90px;
  width: 100%;
}
</style>
