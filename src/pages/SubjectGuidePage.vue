<template>
  <q-page class="kpss-page guide-page q-pa-lg">
    <div v-if="!guide" class="guide-page__inner text-center">
      <p class="text-body1">Rehber bulunamadı.</p>
      <q-btn flat color="amber" label="Ana sayfa" :to="{ name: 'home' }" />
    </div>

    <article v-else class="guide-page__inner">
      <p class="text-overline text-grey-4 q-mb-xs">Çalışma rehberi</p>
      <h1 class="text-h5 text-weight-bold q-mb-md">{{ guide.title }}</h1>
      <p class="text-body1 q-mb-lg">{{ guide.intro }}</p>

      <section v-for="section in guide.sections" :key="section.heading" class="q-mb-lg">
        <h2 class="text-subtitle1 text-weight-bold q-mb-sm">{{ section.heading }}</h2>
        <p class="text-body2 text-grey-4">{{ section.body }}</p>
      </section>

      <q-btn
        unelevated
        color="amber"
        text-color="dark"
        label="Konu haritasına git"
        class="kpss-card-btn q-mb-lg"
        :to="{ name: 'subject-map', params: { subjectId } }"
      />

      <AdSenseBlock v-if="contentAdSlot" :ad-slot="contentAdSlot" />
    </article>
  </q-page>
</template>

<script setup>
import { computed } from 'vue'
import { useRoute } from 'vue-router'
import AdSenseBlock from 'src/components/ads/AdSenseBlock.vue'
import { subjectGuides } from 'src/assets/data/subjectGuides'
import { ADSENSE_SLOTS } from 'src/config/adsense'

const route = useRoute()
const contentAdSlot = ADSENSE_SLOTS.content

const subjectId = computed(() => route.params.subjectId)
const guide = computed(() => subjectGuides[subjectId.value] ?? null)
</script>

<style scoped>
.guide-page {
  background: linear-gradient(180deg, #12101a 0%, #1e1a28 100%);
  color: var(--kpss-text);
}

.guide-page__inner {
  max-width: 720px;
  margin: 0 auto;
}

.guide-page__inner h2 {
  color: var(--kpss-text);
}
</style>
