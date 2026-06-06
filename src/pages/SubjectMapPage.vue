<template>
  <q-page class="kpss-page map-page">
    <div v-if="!subject" class="map-page__message q-pa-lg text-center">
      <p class="text-body1">Ders bulunamadı.</p>
      <q-btn flat color="amber" label="Ana sayfa" :to="{ name: 'home' }" />
    </div>

    <div v-else-if="topics.length" class="map-page__content">
      <div v-if="guideIntro" class="map-page__intro q-pa-md">
        <p class="text-body2 text-grey-4 q-mb-sm">{{ guideIntro }}</p>
        <q-btn
          flat
          dense
          no-caps
          color="amber"
          label="Çalışma rehberini oku"
          :to="{ name: 'subject-guide', params: { subjectId } }"
        />
      </div>

      <TopicMap
        :topics="topics"
        :theme="subject.theme"
        :is-unlocked="isUnlocked"
        :get-progress="getProgress"
        :active-topic-id="activeTopicId"
        @select-topic="onSelectTopic"
      />
    </div>

    <div v-else class="map-page__message q-pa-lg text-center">
      <p class="text-body1">Bu derste henüz konu yok.</p>
    </div>

    <q-dialog v-model="detailOpen" position="bottom">
      <q-card v-if="selectedTopic" class="topic-detail kpss-glass">
        <q-card-section>
          <div class="text-h6 text-weight-bold">{{ selectedTopic.title }}</div>
          <div class="text-body2 text-grey-4 q-mt-xs">
            {{ questionCount }} soru
            <span v-if="topicProgress.bestScore > 0">
              · En iyi: %{{ topicProgress.bestScore }}
            </span>
          </div>
          <div class="q-mt-sm">
            <q-icon
              v-for="n in 3"
              :key="n"
              name="star"
              :color="n <= topicProgress.stars ? 'amber' : 'grey-7'"
              size="22px"
            />
          </div>
        </q-card-section>
        <q-card-actions class="q-px-md q-pb-md">
          <q-btn
            unelevated
            color="amber"
            text-color="dark"
            class="col kpss-card-btn"
            :label="topicProgress.completed ? 'Tekrar çöz' : 'Başla'"
            @click="startQuiz"
          />
          <q-btn flat label="Kapat" @click="detailOpen = false" />
        </q-card-actions>
      </q-card>
    </q-dialog>
  </q-page>
</template>

<script setup>
import { computed, ref } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useQuasar } from 'quasar'
import TopicMap from 'src/components/map/TopicMap.vue'
import { subjectGuides } from 'src/assets/data/subjectGuides'
import { useContentStore } from 'src/stores/content'
import { useProgressStore } from 'src/stores/progress'

const route = useRoute()
const router = useRouter()
const $q = useQuasar()
const content = useContentStore()
const progress = useProgressStore()

const subjectId = computed(() => route.params.subjectId)
const subject = computed(() => content.getSubject(subjectId.value))
const topics = computed(() => content.topicsBySubject(subjectId.value))
const guideIntro = computed(() => subjectGuides[subjectId.value]?.intro ?? null)
const topicIds = computed(() => topics.value.map((t) => t.id))

function isUnlocked(topicId) {
  return progress.isTopicUnlocked(topicId, topicIds.value)
}

function getProgress(topicId) {
  return progress.getTopicProgress(topicId)
}

const activeTopicId = computed(() => {
  const firstOpen = topics.value.find((t) => isUnlocked(t.id) && !getProgress(t.id).completed)
  return firstOpen?.id ?? topics.value[topics.value.length - 1]?.id ?? null
})

const detailOpen = ref(false)
const selectedTopic = ref(null)

const topicProgress = computed(() => {
  if (!selectedTopic.value) return { stars: 0, bestScore: 0, completed: false }
  return progress.getTopicProgress(selectedTopic.value.id)
})

const questionCount = computed(() => {
  if (!selectedTopic.value) return 0
  return content.questionCountByTopic(selectedTopic.value.id)
})

function onSelectTopic(topic) {
  if (!isUnlocked(topic.id)) {
    $q.notify({ message: 'Önce önceki konuyu tamamlayın.', color: 'grey-8' })
    return
  }
  selectedTopic.value = topic
  detailOpen.value = true
}

function startQuiz() {
  if (!selectedTopic.value) return
  detailOpen.value = false
  router.push({
    name: 'quiz',
    params: { subjectId: subjectId.value, topicId: selectedTopic.value.id },
  })
}
</script>

<style scoped>
.map-page {
  background: #12101a;
  min-height: calc(100vh - 56px);
  display: flex;
  flex-direction: column;
}

.map-page__message {
  color: var(--kpss-text);
}

.map-page__intro {
  max-width: 560px;
  margin: 0 auto;
  border-bottom: 1px solid rgba(255, 255, 255, 0.06);
}

.topic-detail {
  color: var(--kpss-text);
  background: #2a2438 !important;
  border-radius: 20px 20px 0 0;
}
</style>
