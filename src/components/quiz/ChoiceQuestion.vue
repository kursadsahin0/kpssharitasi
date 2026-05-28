<template>
  <div class="choice-question">
    <q-card class="choice-question__card kpss-glass q-pa-lg">
      <p class="choice-question__text">{{ question.text }}</p>

      <div class="choice-question__options column q-gutter-sm q-mt-md">
        <q-btn
          v-for="choice in question.choices"
          :key="choice.key"
          unelevated
          no-caps
          class="choice-question__option kpss-card-btn"
          :class="optionClass(choice.key)"
          :disable="locked"
          @click="select(choice.key)"
        >
          <span class="choice-question__key">{{ choice.key }}</span>
          <span class="choice-question__label">{{ choice.label }}</span>
          <q-icon
            v-if="locked && choice.key === question.correctKey"
            name="check_circle"
            class="q-ml-auto"
          />
          <q-icon
            v-else-if="locked && choice.key === selectedKey && choice.key !== question.correctKey"
            name="cancel"
            class="q-ml-auto"
          />
        </q-btn>
      </div>
    </q-card>

    <q-btn
      v-if="locked"
      unelevated
      color="amber"
      text-color="dark"
      class="kpss-card-btn full-width q-mt-lg"
      label="Sonraki soru"
      @click="$emit('next')"
    />
  </div>
</template>

<script setup>
import { ref, watch } from 'vue'

const props = defineProps({
  question: { type: Object, required: true },
  locked: { type: Boolean, default: false },
})

const emit = defineEmits(['select', 'next'])

const selectedKey = ref(null)

watch(
  () => props.question.id,
  () => {
    selectedKey.value = null
  },
)

function select(key) {
  if (props.locked) return
  selectedKey.value = key
  const isCorrect = key === props.question.correctKey
  emit('select', { key, isCorrect })
}

function optionClass(key) {
  if (!props.locked) return ''
  if (key === props.question.correctKey) return 'choice-question__option--correct'
  if (key === selectedKey.value) return 'choice-question__option--wrong'
  return 'choice-question__option--muted'
}
</script>

<style scoped>
.choice-question__text {
  font-size: 1.05rem;
  line-height: 1.55;
  margin: 0;
  font-weight: 500;
}

.choice-question__option {
  width: 100%;
  justify-content: flex-start;
  text-align: left;
  padding: 12px 16px;
  background: rgba(255, 255, 255, 0.06);
  color: var(--kpss-text);
  border: 2px solid transparent;
}

.choice-question__option--correct {
  background: rgba(33, 186, 69, 0.2);
  border-color: #21ba45;
}

.choice-question__option--wrong {
  background: rgba(193, 0, 21, 0.2);
  border-color: #c10015;
}

.choice-question__option--muted {
  opacity: 0.45;
}

.choice-question__key {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 28px;
  height: 28px;
  border-radius: 8px;
  background: rgba(255, 255, 255, 0.12);
  font-weight: 700;
  margin-right: 12px;
  flex-shrink: 0;
}

.choice-question__label {
  flex: 1;
  line-height: 1.35;
  white-space: normal;
}
</style>
