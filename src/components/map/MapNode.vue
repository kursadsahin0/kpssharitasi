<template>
  <button
    type="button"
    class="map-node"
    :class="nodeClass"
    :style="positionStyle"
    :disabled="locked"
    :aria-label="topic.title"
    :data-topic-id="topic.id"
    @click="$emit('select', topic.id)"
  >
    <span v-if="locked" class="map-node__icon">
      <q-icon name="lock" size="18px" />
    </span>
    <span v-else class="map-node__order">{{ topic.order }}</span>
    <span v-if="stars > 0" class="map-node__stars">
      <q-icon
        v-for="n in 3"
        :key="n"
        name="star"
        size="10px"
        :class="{ 'map-node__star--on': n <= stars }"
      />
    </span>
  </button>
</template>

<script setup>
import { computed } from 'vue'

const props = defineProps({
  topic: { type: Object, required: true },
  locked: { type: Boolean, default: false },
  active: { type: Boolean, default: false },
  completed: { type: Boolean, default: false },
  stars: { type: Number, default: 0 },
})

defineEmits(['select'])

const positionStyle = computed(() => {
  const pos = props.topic.mapPosition ?? {}
  if (pos.topPx != null) {
    return {
      left: `${pos.x ?? 50}%`,
      top: `${pos.topPx}px`,
    }
  }
  return {
    left: `${pos.x ?? 50}%`,
    top: `${pos.y ?? 50}%`,
  }
})

const nodeClass = computed(() => ({
  'map-node--locked': props.locked,
  'map-node--active': props.active,
  'map-node--done': props.completed && !props.locked,
}))
</script>

<style scoped>
.map-node {
  position: absolute;
  transform: translate(-50%, -50%);
  width: 52px;
  height: 52px;
  border-radius: 50%;
  border: 3px solid rgba(255, 255, 255, 0.35);
  background: rgba(255, 255, 255, 0.12);
  color: #fff;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  padding: 0;
  z-index: 2;
  transition: transform 0.2s ease, box-shadow 0.2s ease, background 0.2s ease;
}

.map-node--active {
  border-color: #c9a227;
  background: rgba(201, 162, 39, 0.35);
  box-shadow: 0 0 0 6px rgba(201, 162, 39, 0.2);
  animation: pulse 2s ease-in-out infinite;
}

.map-node--done {
  border-color: rgba(255, 255, 255, 0.7);
  background: rgba(92, 75, 122, 0.85);
}

.map-node--locked {
  opacity: 0.45;
  cursor: not-allowed;
}

.map-node__order {
  font-weight: 700;
  font-size: 1rem;
  line-height: 1;
}

.map-node__stars {
  display: flex;
  gap: 1px;
  margin-top: 2px;
}

.map-node__star--on {
  color: #f5c842;
}

.map-node :deep(.q-icon:not(.map-node__star--on)) {
  color: rgba(255, 255, 255, 0.25);
}

@keyframes pulse {
  0%,
  100% {
    transform: translate(-50%, -50%) scale(1);
  }
  50% {
    transform: translate(-50%, -50%) scale(1.06);
  }
}
</style>
