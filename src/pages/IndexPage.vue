<template>
  <q-page class="kpss-page index-page">
    <div class="index-page__inner q-pa-lg">
      <header class="index-page__hero q-mb-xl">
        <p class="text-overline text-grey-4 q-mb-xs">Genel Kültür</p>
        <h1 class="text-h4 text-weight-bold q-my-none">KPSS Çalış</h1>
        <p class="text-body2 text-grey-4 q-mt-sm q-mb-none">
          Konu haritasında ilerle, soruları çöz, yıldız kazan. Ücretsiz KPSS Genel Kültür
          pratiği.
        </p>
      </header>

      <div class="column q-gutter-md">
        <q-card
          v-for="subject in content.subjects"
          :key="subject.id"
          class="subject-card"
          :class="{ 'subject-card--disabled': !subject.available }"
          flat
          @click="openSubject(subject)"
        >
          <q-card-section class="row items-center no-wrap">
            <q-avatar
              :style="{ background: subject.theme.primary }"
              text-color="white"
              icon-size="28px"
              size="52px"
            >
              <q-icon :name="subject.icon" />
            </q-avatar>
            <div class="col q-ml-md">
              <div class="text-h6 text-weight-bold">{{ subject.title }}</div>
              <div class="text-caption text-grey-4">{{ subject.subtitle }}</div>
              <q-linear-progress
                v-if="subject.available"
                :value="progressFor(subject.id)"
                color="amber"
                track-color="grey-8"
                rounded
                class="q-mt-sm"
              />
            </div>
            <q-icon
              :name="subject.available ? 'chevron_right' : 'lock'"
              size="sm"
              color="grey-5"
            />
          </q-card-section>
        </q-card>
      </div>

      <p class="text-center q-mt-xl">
        <router-link :to="{ name: 'study-guide' }" class="index-page__guide-link">
          KPSS nasıl çalışılır?
        </router-link>
      </p>

      <p v-if="lastTopicLabel" class="text-caption text-grey-5 q-mt-md text-center">
        Son çalışma: {{ lastTopicLabel }}
      </p>
    </div>
  </q-page>
</template>

<script setup>
import { computed } from 'vue'
import { useRouter } from 'vue-router'
import { useQuasar } from 'quasar'
import { useContentStore } from 'src/stores/content'
import { useProgressStore } from 'src/stores/progress'

const router = useRouter()
const $q = useQuasar()
const content = useContentStore()
const progress = useProgressStore()

function progressFor(subjectId) {
  const topicList = content.topicsBySubject(subjectId)
  if (!topicList.length) return 0
  const done = topicList.filter((t) => progress.getTopicProgress(t.id).completed).length
  return done / topicList.length
}

const lastTopicLabel = computed(() => {
  if (!progress.lastTopicId) return null
  const topic = content.getTopic(progress.lastTopicId)
  return topic?.title ?? null
})

function openSubject(subject) {
  if (!subject.available) {
    $q.notify({ message: 'Bu ders yakında eklenecek.', color: 'grey-8' })
    return
  }
  router.push({ name: 'subject-map', params: { subjectId: subject.id } })
}
</script>

<style scoped>
.index-page {
  background: linear-gradient(180deg, #12101a 0%, #1e1a28 100%);
}

.index-page__inner {
  max-width: 480px;
  margin: 0 auto;
}

.index-page__guide-link {
  color: rgba(255, 213, 79, 0.9);
  text-decoration: none;
  font-size: 14px;
}

.index-page__guide-link:hover {
  text-decoration: underline;
}

.subject-card {
  background: rgba(255, 255, 255, 0.06);
  border: 1px solid rgba(255, 255, 255, 0.08);
  border-radius: var(--kpss-radius);
  cursor: pointer;
  transition: transform 0.15s ease, box-shadow 0.15s ease;
  color: var(--kpss-text);
}

.subject-card:active:not(.subject-card--disabled) {
  transform: scale(0.98);
}

.subject-card--disabled {
  opacity: 0.55;
  cursor: default;
}
</style>
