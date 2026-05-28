<template>
  <div class="topic-map">
    <div ref="scrollEl" class="topic-map__body" :style="bodyStyle">
      <div class="topic-map__track" :style="trackStyle">
        <svg
          class="topic-map__path"
          :viewBox="`0 0 100 ${trackHeight}`"
          preserveAspectRatio="none"
        >
          <path
            v-if="pathD"
            :d="pathD"
            fill="none"
            stroke="rgba(255,255,255,0.18)"
            stroke-width="0.6"
            stroke-dasharray="1.5 2"
          />
          <path
            v-if="completedPathD"
            :d="completedPathD"
            fill="none"
            stroke="rgba(201,162,39,0.75)"
            stroke-width="1"
          />
        </svg>

        <template v-for="topic in topics" :key="topic.id">
          <div
            v-if="topic.mapPosition?.unitHeader"
            class="topic-map__unit-label"
            :style="unitLabelStyle(topic)"
          >
            {{ topic.mapPosition.unitHeader }}
          </div>
          <MapNode
            :topic="topic"
            :locked="!isUnlocked(topic.id)"
            :active="topic.id === activeTopicId"
            :completed="getProgress(topic.id).completed"
            :stars="getProgress(topic.id).stars"
            @select="$emit('select-topic', topic)"
          />
        </template>
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed, nextTick, ref, watch } from 'vue'
import { MAP_PADDING_TOP, assignMapPositions } from 'src/utils/mapLayout.js'
import MapNode from './MapNode.vue'

const props = defineProps({
  topics: { type: Array, required: true },
  theme: { type: Object, default: () => ({}) },
  isUnlocked: { type: Function, required: true },
  getProgress: { type: Function, required: true },
  activeTopicId: { type: String, default: null },
})

defineEmits(['select-topic'])

const scrollEl = ref(null)

const layout = computed(() => assignMapPositions(props.topics))

watch(
  () => props.activeTopicId,
  async (id) => {
    if (!id || !scrollEl.value) return
    await nextTick()
    scrollEl.value
      .querySelector(`[data-topic-id="${id}"]`)
      ?.scrollIntoView({ block: 'center', behavior: 'smooth' })
  },
  { immediate: true },
)

const trackHeight = computed(() => layout.value.trackHeight)

const bodyStyle = computed(() => ({
  background: props.theme?.gradient || '#1e1a28',
}))

const trackStyle = computed(() => ({
  minHeight: `${trackHeight.value}px`,
}))

function unitLabelStyle(topic) {
  const topPx = topic.mapPosition?.topPx ?? MAP_PADDING_TOP
  return {
    top: `${Math.max(8, topPx - 28)}px`,
  }
}

const nodes = computed(() =>
  props.topics.map((t) => {
    const pos = t.mapPosition ?? { x: 50, topPx: MAP_PADDING_TOP }
    return {
      id: t.id,
      x: pos.x,
      y: pos.topPx,
    }
  }),
)

function buildPath(points, endIndex) {
  if (points.length < 2) return ''
  const slice = points.slice(0, endIndex + 1)
  let d = `M ${slice[0].x} ${slice[0].y}`
  for (let i = 1; i < slice.length; i += 1) {
    const prev = slice[i - 1]
    const curr = slice[i]
    const midY = (prev.y + curr.y) / 2
    d += ` C ${prev.x} ${midY}, ${curr.x} ${midY}, ${curr.x} ${curr.y}`
  }
  return d
}

const pathD = computed(() => buildPath(nodes.value, nodes.value.length - 1))

const completedPathD = computed(() => {
  let lastDone = -1
  props.topics.forEach((t, i) => {
    if (props.getProgress(t.id).completed) lastDone = i
  })
  if (lastDone < 1) return ''
  return buildPath(nodes.value, lastDone)
})
</script>

<style scoped>
.topic-map {
  flex: 1;
  display: flex;
  flex-direction: column;
  min-height: 0;
  width: 100%;
}

.topic-map__body {
  position: relative;
  flex: 1;
  width: 100%;
  min-height: 0;
  overflow-y: auto;
  overflow-x: hidden;
  -webkit-overflow-scrolling: touch;
  border-radius: var(--kpss-radius);
}

.topic-map__track {
  position: relative;
  width: 100%;
  max-width: 420px;
  margin: 0 auto;
  padding: 16px 24px 32px;
  box-sizing: border-box;
}

.topic-map__path {
  position: absolute;
  inset: 0;
  width: 100%;
  height: 100%;
  pointer-events: none;
}

.topic-map__unit-label {
  position: absolute;
  left: 50%;
  transform: translateX(-50%);
  z-index: 1;
  max-width: 92%;
  padding: 4px 14px;
  font-size: 0.65rem;
  font-weight: 600;
  letter-spacing: 0.08em;
  text-transform: uppercase;
  text-align: center;
  color: rgba(255, 255, 255, 0.55);
  background: rgba(0, 0, 0, 0.25);
  border-radius: 999px;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  pointer-events: none;
}
</style>
