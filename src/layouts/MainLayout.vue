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

          <div v-if="authStore.isLoggedIn" class="user-avatar-wrap">
            <q-btn flat dense round padding="2px">
              <q-avatar size="34px" class="user-avatar" color="grey-9" text-color="white">
                <img
                  v-if="authStore.photoURL"
                  :src="authStore.photoURL"
                  referrerpolicy="no-referrer"
                />
                <span v-else style="font-size:14px;font-weight:700">{{ authStore.displayName?.charAt(0) || 'K' }}</span>
              </q-avatar>
              <q-menu
                v-model="menuOpen"
                anchor="bottom right"
                self="top right"
                class="user-menu"
                :offset="[0, 8]"
              >
              <div class="menu-content">
                <div class="menu-user-section">
                  <q-avatar size="44px" class="menu-avatar">
                    <img
                      v-if="authStore.photoURL"
                      :src="authStore.photoURL"
                      referrerpolicy="no-referrer"
                    />
                    <q-icon v-else name="person" size="24px" color="white" />
                  </q-avatar>
                  <div class="menu-user-info">
                    <div class="menu-user-name">{{ authStore.displayName }}</div>
                    <div class="menu-user-email">{{ authStore.email }}</div>
                  </div>
                </div>
                <div class="menu-divider"></div>
                <button class="menu-item" @click="goToProfile">
                  <q-icon name="person" size="20px" class="menu-item-icon" />
                  <span>Profil</span>
                </button>
                <button class="menu-item menu-item--danger" @click="handleLogout">
                  <q-icon name="logout" size="20px" class="menu-item-icon" />
                  <span>Çıkış Yap</span>
                </button>
              </div>
              </q-menu>
            </q-btn>
          </div>
        </div>
      </q-toolbar>
    </q-header>

    <q-page-container>
      <router-view />
    </q-page-container>
  </q-layout>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useContentStore } from 'src/stores/content'
import { useProgressStore } from 'src/stores/progress'
import { useAuthStore } from 'src/stores/auth'

const route = useRoute()
const router = useRouter()
const content = useContentStore()
const progress = useProgressStore()
const authStore = useAuthStore()

const menuOpen = ref(false)

onMounted(() => {
  authStore.init()
})

const subject = computed(() => {
  const id = route.params.subjectId
  return id ? content.getSubject(id) : null
})

const headerTitle = computed(() => {
  if (route.name === 'subject-map' && subject.value) return subject.value.title
  if (route.meta?.title) return route.meta.title
  return 'KPSS Haritası'
})

const totalStars = computed(() => {
  let stars = 0
  for (const key of Object.keys(progress.byTopic)) {
    const p = progress.byTopic[key]
    if (p?.stars) stars += p.stars
  }
  return stars
})

function goToProfile() {
  menuOpen.value = false
  router.push({ name: 'profile' })
}

async function handleLogout() {
  menuOpen.value = false
  await authStore.logout()
  router.replace({ name: 'login' })
}
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

.user-avatar {
  border: 2px solid rgba(255, 255, 255, 0.12) !important;
  background: #2a2438 !important;
}


</style>

<style>
.user-menu {
  border-radius: 16px !important;
  background: #1e1a28 !important;
  border: 1px solid rgba(255, 255, 255, 0.1) !important;
  box-shadow: 0 20px 60px rgba(0, 0, 0, 0.6) !important;
  overflow: hidden !important;
  min-width: 240px !important;
}

.user-menu .q-menu__content {
  background: #1e1a28 !important;
}

.menu-content {
  padding: 8px 0;
  background: #1e1a28;
}

.menu-user-section {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 16px 16px 12px;
}

.menu-avatar {
  border: 2px solid rgba(155, 127, 212, 0.4) !important;
  background: linear-gradient(135deg, #5C4B7A, #3D2E5C) !important;
  flex-shrink: 0;
}

.menu-user-info {
  overflow: hidden;
}

.menu-user-name {
  font-size: 15px;
  font-weight: 700;
  color: #f5f3f8;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.menu-user-email {
  font-size: 12px;
  color: rgba(245, 243, 248, 0.45);
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.menu-divider {
  height: 1px;
  background: rgba(255, 255, 255, 0.07);
  margin: 8px 12px;
}

.menu-item {
  display: flex;
  align-items: center;
  gap: 12px;
  width: 100%;
  padding: 10px 16px;
  border: none;
  background: none;
  color: rgba(245, 243, 248, 0.8);
  font-size: 14px;
  font-weight: 500;
  cursor: pointer;
  transition: background 0.15s ease;
  font-family: inherit;
}

.menu-item:hover {
  background: rgba(255, 255, 255, 0.06);
}

.menu-item-icon {
  color: rgba(155, 127, 212, 0.7);
}

.menu-item--danger {
  color: #ef5350;
}

.menu-item--danger .menu-item-icon {
  color: #ef5350;
}
</style>
