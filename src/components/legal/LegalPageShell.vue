<template>
  <q-page class="kpss-page legal-page q-pa-lg">
    <div class="legal-page__inner">
      <h1 class="text-h5 text-weight-bold q-mb-md">{{ title }}</h1>
      <p v-if="updated" class="text-caption text-grey-5 q-mb-lg">Son güncelleme: {{ updated }}</p>
      <slot />
    </div>
  </q-page>
</template>

<script setup>
defineProps({
  title: { type: String, required: true },
  updated: { type: String, default: '28 Mayıs 2026' },
})
</script>

<style scoped>
.legal-page {
  background: linear-gradient(180deg, #12101a 0%, #1e1a28 100%);
  color: var(--kpss-text);
}

.legal-page__inner {
  max-width: 720px;
  margin: 0 auto;
}

.legal-page__inner :deep(h2) {
  font-size: 1.1rem;
  font-weight: 700;
  margin: 1.5rem 0 0.5rem;
}

.legal-page__inner :deep(p),
.legal-page__inner :deep(li) {
  line-height: 1.65;
}

.legal-page__inner :deep(ul) {
  padding-left: 1.25rem;
  margin: 0.5rem 0 1rem;
}

.legal-page__inner :deep(a) {
  color: #ffd54f;
  text-decoration: none;
}

.legal-page__inner :deep(a:hover) {
  text-decoration: underline;
}
</style>
