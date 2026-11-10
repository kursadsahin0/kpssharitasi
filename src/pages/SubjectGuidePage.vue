<template>
  <q-page class="kpss-page guide-page q-pa-lg">
    <div v-if="!guide" class="guide-page__inner text-center">
      <p class="text-body1">Rehber bulunamadı.</p>
      <q-btn flat color="amber" label="Ana sayfa" :to="{ name: 'home' }" />
    </div>

    <article v-else class="guide-page__inner">
      <nav class="guide-page__breadcrumb text-caption text-grey-5 q-mb-md" aria-label="Sayfa yolu">
        <router-link :to="{ name: 'home' }" class="guide-page__crumb">Ana sayfa</router-link>
        <span aria-hidden="true"> · </span>
        <router-link :to="{ name: 'study-guide' }" class="guide-page__crumb">Rehber</router-link>
        <span aria-hidden="true"> · </span>
        <span>{{ guide.title }}</span>
      </nav>

      <p class="text-overline text-grey-4 q-mb-xs">Çalışma rehberi</p>
      <h1 class="text-h5 text-weight-bold q-mb-md">{{ guide.title }}</h1>
      <p class="text-body1 q-mb-lg">{{ guide.intro }}</p>

      <section v-for="section in guide.sections" :key="section.heading" class="q-mb-lg">
        <h2 class="text-subtitle1 text-weight-bold q-mb-sm">{{ section.heading }}</h2>
        <p class="text-body2 text-grey-4">{{ section.body }}</p>
      </section>

      <section v-if="units.length" class="q-mb-lg">
        <h2 class="text-subtitle1 text-weight-bold q-mb-sm">Konu listesi</h2>
        <p class="text-body2 text-grey-4">
          KPSS Haritası’ndaki {{ subjectTitle }} konu haritası aşağıdaki ünite ve konulardan oluşur.
          Konular haritada bu sırayla açılır; her konunun sonunda çoktan seçmeli bir test bulunur.
        </p>
        <div v-for="unit in units" :key="unit.title" class="q-mb-md">
          <h3 class="text-body1 text-weight-bold q-my-sm">{{ unit.title }}</h3>
          <ul class="guide-page__topics text-body2 text-grey-4">
            <li v-for="topic in unit.topics" :key="topic.id">{{ topic.title }}</li>
          </ul>
        </div>
      </section>

      <q-btn
        unelevated
        color="amber"
        text-color="dark"
        label="Konu haritasına git"
        class="kpss-card-btn q-mb-lg"
        :to="{ name: 'subject-map', params: { subjectId } }"
      />

      <nav class="text-body2 q-mb-lg" aria-label="Diğer rehberler">
        <span class="text-grey-5">Diğer rehberler: </span>
        <template v-for="(other, i) in otherGuides" :key="other.id">
          <span v-if="i" aria-hidden="true"> · </span>
          <router-link
            :to="{ name: 'subject-guide', params: { subjectId: other.id } }"
            class="guide-page__crumb"
            >{{ other.title }}</router-link
          >
        </template>
      </nav>

      <AdSenseBlock v-if="contentAdSlot" :ad-slot="contentAdSlot" />
    </article>
  </q-page>
</template>

<script setup>
import { computed } from 'vue'
import { useRoute } from 'vue-router'
import AdSenseBlock from 'src/components/ads/AdSenseBlock.vue'
import { subjectGuides } from 'src/assets/data/subjectGuides'
import { subjects } from 'src/assets/data/subjects'
import { topicDefs } from 'src/assets/data/topics'
import { ADSENSE_SLOTS } from 'src/config/adsense'

const route = useRoute()
const contentAdSlot = ADSENSE_SLOTS.content

const subjectId = computed(() => route.params.subjectId)
const guide = computed(() => subjectGuides[subjectId.value] ?? null)

const subjectTitle = computed(
  () => subjects.find((s) => s.id === subjectId.value)?.title ?? '',
)

const units = computed(() => {
  const map = new Map()
  for (const t of topicDefs) {
    if (t.subjectId !== subjectId.value) continue
    if (!map.has(t.unitTitle)) map.set(t.unitTitle, { title: t.unitTitle, topics: [] })
    map.get(t.unitTitle).topics.push(t)
  }
  for (const unit of map.values()) unit.topics.sort((a, b) => a.order - b.order)
  return [...map.values()]
})

const otherGuides = computed(() =>
  subjects.filter((s) => s.available && s.id !== subjectId.value && subjectGuides[s.id]),
)
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

.guide-page__crumb {
  color: rgba(255, 213, 79, 0.85);
  text-decoration: none;
}

.guide-page__topics {
  margin: 0;
  padding-left: 1.2rem;
  line-height: 1.7;
}

.guide-page__crumb:hover {
  text-decoration: underline;
}
</style>
