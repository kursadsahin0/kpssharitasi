<template>
  <q-page class="kpss-page result-page q-pa-lg flex flex-center">
    <div class="result-page__inner text-center">
      <p class="text-overline text-grey-4">Sonuç</p>
      <h2 class="text-h3 text-weight-bold q-my-sm">%{{ percent }}</h2>
      <p class="text-body1 q-mb-lg">
        {{ correct }} / {{ total }} doğru
      </p>

      <div class="result-stars q-mb-xl">
        <q-icon
          v-for="n in 3"
          :key="n"
          name="star"
          size="40px"
          :class="{ 'result-stars__on': n <= stars }"
          class="result-stars__icon"
        />
      </div>
      <p class="text-subtitle1 text-amber q-mb-xl">{{ starsLabelText }}</p>

      <div class="q-mb-lg">
        <AdSenseBlock ad-slot="3456789012" />
      </div>

      <q-btn
        unelevated
        color="amber"
        text-color="dark"
        class="kpss-card-btn full-width q-mb-sm"
        label="Haritaya dön"
        @click="goMap"
      />
      <q-btn
        v-if="stars < 3"
        flat
        color="grey-4"
        class="kpss-card-btn full-width"
        label="Tekrar çöz"
        @click="retry"
      />
    </div>
  </q-page>
</template>

<script setup>
import { computed, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import AdSenseBlock from 'src/components/ads/AdSenseBlock.vue'
import { scoreToStars, starsLabel } from 'src/utils/stars'
import { useProgressStore } from 'src/stores/progress'

const route = useRoute()
const router = useRouter()
const progress = useProgressStore()

const correct = computed(() => Number(route.query.correct) || 0)
const total = computed(() => Number(route.query.total) || 1)
const percent = computed(() => Math.round((correct.value / total.value) * 100))
const stars = computed(() => scoreToStars(percent.value))
const starsLabelText = computed(() => starsLabel(stars.value))

const topicId = computed(() => route.params.topicId)
const subjectId = computed(() => route.params.subjectId)

onMounted(() => {
  progress.recordAttempt(topicId.value, correct.value, total.value)
})

function goMap() {
  router.push({ name: 'subject-map', params: { subjectId: subjectId.value } })
}

function retry() {
  router.replace({
    name: 'quiz',
    params: { subjectId: subjectId.value, topicId: topicId.value },
  })
}
</script>

<style scoped>
.result-page {
  background: linear-gradient(180deg, #1e1a28 0%, #12101a 100%);
}

.result-page__inner {
  max-width: 360px;
  width: 100%;
}

.result-stars__icon {
  color: rgba(255, 255, 255, 0.2);
  margin: 0 4px;
  transition: transform 0.35s ease, color 0.35s ease;
}

.result-stars__on {
  color: #f5c842;
  animation: star-pop 0.4s ease backwards;
}

.result-stars__on:nth-child(1) {
  animation-delay: 0.1s;
}
.result-stars__on:nth-child(2) {
  animation-delay: 0.25s;
}
.result-stars__on:nth-child(3) {
  animation-delay: 0.4s;
}

@keyframes star-pop {
  from {
    transform: scale(0);
    opacity: 0;
  }
  to {
    transform: scale(1);
    opacity: 1;
  }
}
</style>
