<template>
  <div class="flashcard">
    <div class="flashcard__progress text-caption text-grey-7">
      Soru {{ index + 1 }} / {{ total }}
      <q-linear-progress
        :value="(index + 1) / total"
        color="primary"
        class="q-mt-sm"
        rounded
      />
    </div>

    <q-card flat bordered class="flashcard__card q-pa-lg">
      <p class="flashcard__question">{{ question.text }}</p>

      <transition name="fade">
        <div v-if="revealed" class="flashcard__answer q-mt-lg">
          <div class="text-overline text-grey-7">Cevap</div>
          <p class="flashcard__answer-text">{{ question.answer }}</p>
        </div>
      </transition>
    </q-card>

    <div class="flashcard__actions q-mt-lg">
      <q-btn
        v-if="!revealed"
        unelevated
        color="primary"
        label="Cevabı Göster"
        class="full-width"
        size="lg"
        @click="$emit('reveal')"
      />
      <template v-else>
        <q-btn
          outline
          color="negative"
          label="Bilemedim"
          class="col"
          size="lg"
          @click="$emit('answer', false)"
        />
        <q-btn
          unelevated
          color="positive"
          label="Bildim"
          class="col"
          size="lg"
          @click="$emit('answer', true)"
        />
      </template>
    </div>
  </div>
</template>

<script setup>
defineProps({
  question: { type: Object, required: true },
  index: { type: Number, required: true },
  total: { type: Number, required: true },
  revealed: { type: Boolean, default: false },
})

defineEmits(['reveal', 'answer'])
</script>

<style scoped>
.flashcard__card {
  border-radius: 16px;
  min-height: 200px;
}

.flashcard__question {
  font-size: 1.15rem;
  line-height: 1.55;
  margin: 0;
  font-weight: 500;
}

.flashcard__answer-text {
  font-size: 1.1rem;
  line-height: 1.5;
  margin: 4px 0 0;
  color: var(--kpss-primary, #5c4b7a);
  font-weight: 600;
}

.flashcard__actions {
  display: flex;
  gap: 12px;
}

.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.25s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
</style>
