<template>
  <div v-if="showAd" class="adsense-block">
    <p class="adsense-block__label text-caption text-grey-6 q-mb-xs">Reklam</p>
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
import { computed, nextTick, onMounted, onUnmounted, ref } from 'vue'
import { useRoute } from 'vue-router'
import { ADSENSE_CLIENT } from 'src/config/adsense'
import { canShowAdsense, loadAdSenseScript } from 'src/utils/adsensePolicy'

const props = defineProps({
  adSlot: { type: String, default: '' },
  format: { type: String, default: 'auto' },
  fullWidthResponsive: { type: Boolean, default: true },
})

const route = useRoute()
const rendered = ref(false)

const showAd = computed(() => {
  if (!props.adSlot) return false
  return canShowAdsense(route.name)
})

async function renderAd() {
  if (!showAd.value || rendered.value) return
  const loaded = await loadAdSenseScript()
  if (!loaded) return
  await nextTick()
  try {
    ;(window.adsbygoogle = window.adsbygoogle || []).push({})
    rendered.value = true
  } catch {
    // Reklam engelleyici
  }
}

function onConsent() {
  renderAd()
}

onMounted(() => {
  renderAd()
  window.addEventListener('kpss-cookie-consent', onConsent)
})

onUnmounted(() => {
  window.removeEventListener('kpss-cookie-consent', onConsent)
})
</script>

<style scoped>
.adsense-block {
  min-height: 90px;
  width: 100%;
  margin-top: 24px;
  padding-top: 16px;
  border-top: 1px solid rgba(255, 255, 255, 0.06);
}

.adsense-block__label {
  text-align: center;
}
</style>
