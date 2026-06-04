<template>
  <div v-if="showAd" class="adsense-block">
    <ins
      class="adsbygoogle"
      style="display: block"
      :data-ad-client="ADSENSE_CLIENT"
      :data-ad-slot="adSlot"
      :data-ad-format="format"
      :data-full-width-responsive="fullWidthResponsive ? 'true' : 'false'"
    />
  </div>
</template>

<script setup>
import { computed, nextTick, onMounted } from 'vue'
import { ADSENSE_CLIENT } from 'src/config/adsense'

const props = defineProps({
  adSlot: { type: String, required: true },
  format: { type: String, default: 'auto' },
  fullWidthResponsive: { type: Boolean, default: true },
})

const showAd = computed(() => Boolean(props.adSlot && ADSENSE_CLIENT))

function scriptReady() {
  return document.querySelector(
    `script[src*="adsbygoogle.js"][src*="${ADSENSE_CLIENT}"]`,
  )
}

function waitForScript(maxMs = 8000) {
  return new Promise((resolve) => {
    if (scriptReady()) {
      resolve(true)
      return
    }
    const start = Date.now()
    const t = setInterval(() => {
      if (scriptReady() || Date.now() - start > maxMs) {
        clearInterval(t)
        resolve(Boolean(scriptReady()))
      }
    }, 100)
  })
}

async function renderAd() {
  if (!showAd.value) return
  await waitForScript()
  await nextTick()
  try {
    ;(window.adsbygoogle = window.adsbygoogle || []).push({})
  } catch {
    // Reklam engelleyici veya çift push
  }
}

onMounted(() => {
  renderAd()
})
</script>

<style scoped>
.adsense-block {
  min-height: 90px;
  width: 100%;
}
</style>
