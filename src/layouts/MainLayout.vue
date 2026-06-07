<template>
  <q-layout view="lHh Lpr lFf">
    <q-header class="kpss-header" borderless>
      <q-toolbar class="kpss-toolbar">
        <div class="header-brand row items-center no-wrap" style="cursor:pointer" @click="router.push({ name: 'home' })">
          <div class="brand-icon">
            <svg width="22" height="22" viewBox="0 0 288 288" fill="none">
              <path d="M144 80L60 120L144 160L228 120Z" fill="#B89EE8"/>
              <path d="M144 160L60 120L60 160L144 200Z" fill="#9B7FD4"/>
              <path d="M144 160L228 120L228 160L144 200Z" fill="#D4C4F0"/>
            </svg>
          </div>
          <span class="brand-text">{{ headerTitle }}</span>
        </div>

        <q-space />

        <div class="header-actions row items-center no-wrap">
          <div class="star-chip row items-center no-wrap">
            <q-icon name="star_rate" size="18px" class="star-icon" />
            <span class="star-value">{{ totalStars }}</span>
          </div>
        </div>
      </q-toolbar>
    </q-header>

    <q-page-container>
      <router-view />
    </q-page-container>

    <q-footer class="kpss-footer">
      <CookieConsentBanner />
      <div class="kpss-footer__inner">
        <nav class="kpss-footer__nav">
          <router-link :to="{ name: 'study-guide' }" class="kpss-footer__link">Rehber</router-link>
          <span class="kpss-footer__dot">•</span>
          <router-link :to="{ name: 'about' }" class="kpss-footer__link">Hakkında</router-link>
          <span class="kpss-footer__dot">•</span>
          <router-link :to="{ name: 'faq' }" class="kpss-footer__link">SSS</router-link>
          <span class="kpss-footer__dot">•</span>
          <router-link :to="{ name: 'contact' }" class="kpss-footer__link">İletişim</router-link>
          <span class="kpss-footer__dot">•</span>
          <router-link :to="{ name: 'privacy-policy' }" class="kpss-footer__link">Gizlilik</router-link>
          <span class="kpss-footer__dot">•</span>
          <router-link :to="{ name: 'terms' }" class="kpss-footer__link">Koşullar</router-link>
        </nav>
        <p class="kpss-footer__copy text-caption text-grey-6">
          © {{ year }} KPSS Haritası
        </p>
      </div>
    </q-footer>
  </q-layout>
</template>

<script setup>
import { computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import CookieConsentBanner from 'src/components/legal/CookieConsentBanner.vue'
import { useContentStore } from 'src/stores/content'
import { useProgressStore } from 'src/stores/progress'

const route = useRoute()
const router = useRouter()
const content = useContentStore()
const progress = useProgressStore()

const subject = computed(() => {
  const id = route.params.subjectId
  return id ? content.getSubject(id) : null
})

const headerTitle = computed(() => {
  if (route.name === 'subject-map' && subject.value) return subject.value.title
  if (route.meta?.title) return route.meta.title
  return 'KPSS Haritası'
})

const year = new Date().getFullYear()

const totalStars = computed(() => {
  let stars = 0
  for (const key of Object.keys(progress.byTopic)) {
    const p = progress.byTopic[key]
    if (p?.stars) stars += p.stars
  }
  return stars
})

</script>

<style scoped>
.kpss-header {
  background: rgba(18, 16, 26, 0.85);
  backdrop-filter: blur(20px) saturate(1.4);
  border-bottom: 1px solid rgba(255, 255, 255, 0.06);
}

.kpss-toolbar {
  padding: 6px 16px;
  min-height: 56px;
}

.back-btn {
  color: rgba(255, 255, 255, 0.85);
  margin-right: 4px;
}

.header-brand {
  gap: 10px;
}

.brand-icon {
  width: 36px;
  height: 36px;
  border-radius: 10px;
  background: linear-gradient(135deg, rgba(155, 127, 212, 0.2), rgba(92, 75, 122, 0.3));
  display: flex;
  align-items: center;
  justify-content: center;
  border: 1px solid rgba(155, 127, 212, 0.25);
}

.brand-text {
  font-size: 17px;
  font-weight: 700;
  color: #fff;
  letter-spacing: 0.02em;
}

.header-actions {
  gap: 12px;
}

.star-chip {
  background: linear-gradient(135deg, rgba(255, 213, 79, 0.12), rgba(255, 183, 0, 0.08));
  border: 1px solid rgba(255, 213, 79, 0.2);
  border-radius: 20px;
  padding: 5px 12px 5px 8px;
  gap: 5px;
}

.star-icon {
  color: #FFD54F;
  filter: drop-shadow(0 0 4px rgba(255, 213, 79, 0.4));
}

.star-value {
  font-size: 14px;
  font-weight: 800;
  color: #FFD54F;
  text-shadow: 0 0 8px rgba(255, 213, 79, 0.3);
}

.kpss-footer {
  background: rgba(18, 16, 26, 0.9);
  border-top: 1px solid rgba(255, 255, 255, 0.06);
}

.kpss-footer__inner {
  padding: 10px 16px 12px;
  text-align: center;
}

.kpss-footer__nav {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  justify-content: center;
  gap: 8px;
  font-size: 13px;
  margin-bottom: 4px;
}

.kpss-footer__copy {
  margin: 0;
}

.kpss-footer__link {
  color: rgba(255, 255, 255, 0.75);
  text-decoration: none;
}

.kpss-footer__link:hover {
  color: #ffd54f;
}

.kpss-footer__dot {
  color: rgba(255, 255, 255, 0.35);
}

</style>
