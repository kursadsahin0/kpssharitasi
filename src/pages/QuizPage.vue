<template>
  <q-page class="kpss-page quiz-page q-pa-md">
    <div v-if="!deck.length" class="quiz-page__empty text-center q-pa-xl">
      <p class="text-body1 text-grey-4">Bu konuda henüz soru yok.</p>
      <q-btn
        flat
        color="amber"
        label="Haritaya dön"
        class="q-mt-md"
        @click="router.push({ name: 'subject-map', params: { subjectId } })"
      />
    </div>
    <div v-else-if="current" class="quiz-page__inner">
      <div class="row items-center justify-between q-mb-md">
        <span class="text-caption text-grey-4">
          Soru {{ index + 1 }} / {{ deck.length }}
        </span>
        <q-linear-progress
          :value="(index + 1) / deck.length"
          color="amber"
          track-color="grey-8"
          rounded
          style="width: 120px"
        />
      </div>

      <ChoiceQuestion
        :question="current"
        :locked="locked"
        @select="onSelect"
        @next="nextQuestion"
      />

      <q-btn
        flat
        no-caps
        color="grey-4"
        icon="map"
        label="Haritaya Dön"
        class="back-to-map q-mt-lg full-width"
        @click="router.push({ name: 'subject-map', params: { subjectId: subjectId } })"
      />
    </div>
  </q-page>
</template>

<script setup>
import { computed, ref } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import ChoiceQuestion from 'src/components/quiz/ChoiceQuestion.vue'
import { useContentStore } from 'src/stores/content'
import { enrichQuestionsWithChoices } from 'src/utils/quizChoices'
import 'src/utils/wrongOptionsRevision'
import { wrongOptionsRevision } from 'src/utils/wrongOptionsRevision'

const route = useRoute()
const router = useRouter()
const content = useContentStore()

const topicId = computed(() => route.params.topicId)
const subjectId = computed(() => route.params.subjectId)

const deck = computed(() => {
  void wrongOptionsRevision.value
  const raw = content.quizQuestionsForTopic(topicId.value)
  return enrichQuestionsWithChoices(raw)
})
const index = ref(0)
const correct = ref(0)
const locked = ref(false)

const current = computed(() => deck.value[index.value])

function onSelect({ isCorrect }) {
  if (locked.value) return
  locked.value = true
  if (isCorrect) correct.value += 1
}

function nextQuestion() {
  locked.value = false

  if (index.value + 1 >= deck.value.length) {
    router.replace({
      name: 'result',
      params: { subjectId: subjectId.value, topicId: topicId.value },
      query: {
        correct: String(correct.value),
        total: String(deck.value.length),
      },
    })
    return
  }

  index.value += 1
}
</script>

<style scoped>
.quiz-page {
  background: linear-gradient(180deg, #12101a 0%, #2a2438 100%);
}

.quiz-page__inner {
  max-width: 480px;
  margin: 0 auto;
}

.back-to-map {
  border-radius: 12px;
  border: 1px solid rgba(255, 255, 255, 0.08);
}
</style>
