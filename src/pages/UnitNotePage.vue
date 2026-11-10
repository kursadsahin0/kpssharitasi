<template>
  <q-page class="kpss-page note-page q-pa-lg">
    <div v-if="!note" class="note-page__inner text-center">
      <p class="text-body1">Konu anlatımı bulunamadı.</p>
      <q-btn flat color="amber" label="Konu anlatımları" :to="{ name: 'notes-index' }" />
    </div>

    <article v-else class="note-page__inner">
      <nav class="text-caption text-grey-5 q-mb-md" aria-label="Sayfa yolu">
        <router-link :to="{ name: 'home' }" class="note-page__link">Ana sayfa</router-link>
        <span aria-hidden="true"> · </span>
        <router-link :to="{ name: 'notes-index' }" class="note-page__link"
          >Konu anlatımları</router-link
        >
        <span aria-hidden="true"> · </span>
        <span>{{ subjectTitle }}</span>
      </nav>

      <p class="text-overline text-grey-4 q-mb-xs">KPSS {{ subjectTitle }} · Konu anlatımı</p>
      <h1 class="text-h5 text-weight-bold q-mb-md">{{ note.title }}</h1>
      <p class="text-body1 q-mb-lg">{{ note.intro }}</p>

      <section v-for="section in note.sections" :key="section.heading" class="q-mb-lg">
        <h2 class="text-subtitle1 text-weight-bold q-mb-sm">{{ section.heading }}</h2>
        <p v-for="(para, i) in section.paragraphs" :key="i" class="text-body2 note-page__para">
          {{ para }}
        </p>
      </section>

      <section v-if="note.keyPoints.length" class="note-page__key q-pa-md q-mb-lg">
        <h2 class="text-subtitle1 text-weight-bold q-mt-none q-mb-sm">Sınav öncesi hatırla</h2>
        <ul class="q-my-none">
          <li v-for="(point, i) in note.keyPoints" :key="i" class="text-body2">{{ point }}</li>
        </ul>
      </section>

      <p class="text-body2 text-grey-4 q-mb-md">
        Bu konuyu pekiştirmek için {{ subjectTitle }} konu haritasındaki ilgili testleri çözün;
        yanlış yaptığınız soruları bu sayfadaki başlıklarla karşılaştırarak tekrar edin.
      </p>

      <div class="row q-gutter-sm q-mb-lg">
        <q-btn
          unelevated
          color="amber"
          text-color="dark"
          label="Konu haritasında soru çöz"
          class="kpss-card-btn"
          :to="{ name: 'subject-map', params: { subjectId: note.subjectId } }"
        />
        <q-btn
          flat
          color="amber"
          label="Çalışma rehberi"
          :to="{ name: 'subject-guide', params: { subjectId: note.subjectId } }"
        />
      </div>

      <nav class="row justify-between text-body2 q-mb-lg" aria-label="Önceki ve sonraki konu">
        <router-link v-if="prev" :to="pathOf(prev)" class="note-page__link"
          >← {{ prev.title }}</router-link
        >
        <span v-else />
        <router-link v-if="next" :to="pathOf(next)" class="note-page__link"
          >{{ next.title }} →</router-link
        >
      </nav>

      <AdSenseBlock v-if="contentAdSlot" :ad-slot="contentAdSlot" />
    </article>
  </q-page>
</template>

<script setup>
import { computed } from 'vue'
import { useRoute } from 'vue-router'
import AdSenseBlock from 'src/components/ads/AdSenseBlock.vue'
import { findNote, notePath, notesBySubject } from 'src/assets/data/notes/index.js'
import { subjects } from 'src/assets/data/subjects'
import { ADSENSE_SLOTS } from 'src/config/adsense'

const route = useRoute()
const contentAdSlot = ADSENSE_SLOTS.content

const note = computed(() => findNote(route.params.subjectId, route.params.slug))
const subjectTitle = computed(
  () => subjects.find((s) => s.id === route.params.subjectId)?.title ?? '',
)
const siblings = computed(() => (note.value ? notesBySubject(note.value.subjectId) : []))
const index = computed(() => siblings.value.indexOf(note.value))
const prev = computed(() => (index.value > 0 ? siblings.value[index.value - 1] : null))
const next = computed(() =>
  index.value >= 0 && index.value < siblings.value.length - 1
    ? siblings.value[index.value + 1]
    : null,
)
const pathOf = notePath
</script>

<style scoped>
.note-page {
  background: linear-gradient(180deg, #12101a 0%, #1e1a28 100%);
  color: var(--kpss-text);
}

.note-page__inner {
  max-width: 720px;
  margin: 0 auto;
}

.note-page__para {
  color: rgba(245, 243, 248, 0.85);
  line-height: 1.75;
}

.note-page__key {
  border: 1px solid rgba(255, 213, 79, 0.25);
  border-radius: 12px;
  background: rgba(255, 213, 79, 0.05);
  line-height: 1.7;
}

.note-page__link {
  color: rgba(255, 213, 79, 0.9);
  text-decoration: none;
}

.note-page__link:hover {
  text-decoration: underline;
}
</style>
