<template>
  <LegalPageShell title="KPSS Konu Anlatımları" :updated="''">
    <p>
      Bu bölümde KPSS Genel Kültür derslerinin ünitelerine ait özet konu anlatımlarını bulabilirsiniz.
      Her anlatım, ünitenin sınavda en çok sorulan başlıklarını, karıştırılan kavramlarını ve sınav
      öncesi tekrar edilmesi gereken kısa notları içerir. Bir üniteyi okuduktan sonra konu
      haritasındaki testleri çözerek öğrendiklerinizi pekiştirebilirsiniz.
    </p>

    <section v-for="group in groups" :key="group.subject.id" class="q-mb-lg">
      <h2>{{ group.subject.title }}</h2>
      <ul class="notes-index__list">
        <li v-for="note in group.notes" :key="note.slug">
          <router-link :to="notePath(note)">{{ note.title }}</router-link>
          <span class="text-grey-5"> — {{ note.description }}</span>
        </li>
      </ul>
    </section>

    <AdSenseBlock v-if="contentAdSlot" :ad-slot="contentAdSlot" />
  </LegalPageShell>
</template>

<script setup>
import AdSenseBlock from 'src/components/ads/AdSenseBlock.vue'
import LegalPageShell from 'src/components/legal/LegalPageShell.vue'
import { notePath, notesBySubject } from 'src/assets/data/notes/index.js'
import { subjects } from 'src/assets/data/subjects'
import { ADSENSE_SLOTS } from 'src/config/adsense'

const contentAdSlot = ADSENSE_SLOTS.content
const groups = subjects
  .filter((s) => s.available)
  .map((subject) => ({ subject, notes: notesBySubject(subject.id) }))
  .filter((g) => g.notes.length)
</script>

<style scoped>
.notes-index__list {
  line-height: 1.8;
  padding-left: 1.2rem;
}
</style>
