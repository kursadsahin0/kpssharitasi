<template>
  <LegalPageShell :title="homeGuide.title">
    <p v-for="(para, i) in homeGuide.paragraphs" :key="i" class="q-mb-md">
      {{ para }}
    </p>

    <section v-for="section in homeGuide.sections" :key="section.heading" class="q-mb-md">
      <h2>{{ section.heading }}</h2>
      <p>{{ section.body }}</p>
    </section>

    <h2>Ders rehberleri</h2>
    <ul class="q-mb-lg">
      <li><router-link :to="{ name: 'subject-guide', params: { subjectId: 'tarih' } }">KPSS Tarih çalışma rehberi</router-link></li>
      <li><router-link :to="{ name: 'subject-guide', params: { subjectId: 'cografya' } }">KPSS Coğrafya çalışma rehberi</router-link></li>
      <li><router-link :to="{ name: 'subject-guide', params: { subjectId: 'vatandaslik' } }">KPSS Vatandaşlık çalışma rehberi</router-link></li>
    </ul>

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
