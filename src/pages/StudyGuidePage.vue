<template>
  <LegalPageShell :title="homeGuide.title">
    <p v-for="(para, i) in homeGuide.paragraphs" :key="i" class="q-mb-md">
      {{ para }}
    </p>

    <p class="q-mb-lg">
      <router-link :to="{ name: 'faq' }">Sık sorulan sorular</router-link>
      ·
      <router-link :to="{ name: 'about' }">Hakkında</router-link>
      ·
      <router-link :to="{ name: 'contact' }">İletişim</router-link>
    </p>

    <AdSenseBlock v-if="contentAdSlot" :ad-slot="contentAdSlot" />
  </LegalPageShell>
</template>

<script setup>
import AdSenseBlock from 'src/components/ads/AdSenseBlock.vue'
import LegalPageShell from 'src/components/legal/LegalPageShell.vue'
import { kpssHomeGuide } from 'src/assets/data/subjectGuides'
import { ADSENSE_SLOTS } from 'src/config/adsense'

const homeGuide = kpssHomeGuide
const contentAdSlot = ADSENSE_SLOTS.content
</script>
