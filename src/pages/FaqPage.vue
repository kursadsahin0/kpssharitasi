<template>
  <LegalPageShell title="Sık Sorulan Sorular">
    <div v-for="item in faqItems" :key="item.q" class="faq-item q-mb-lg">
      <h2>{{ item.q }}</h2>
      <p>{{ item.a }}</p>
    </div>

    <AdSenseBlock v-if="contentAdSlot" :ad-slot="contentAdSlot" />
  </LegalPageShell>
</template>

<script setup>
import { faqItems } from 'src/assets/data/faq'
import AdSenseBlock from 'src/components/ads/AdSenseBlock.vue'
import LegalPageShell from 'src/components/legal/LegalPageShell.vue'
import { ADSENSE_SLOTS } from 'src/config/adsense'

const contentAdSlot = ADSENSE_SLOTS.content
</script>

<style scoped>
.faq-item h2 {
  font-size: 1.05rem;
  font-weight: 700;
  margin-bottom: 0.35rem;
}

.faq-item p {
  margin: 0;
  color: rgba(245, 243, 248, 0.85);
  line-height: 1.65;
}
</style>
