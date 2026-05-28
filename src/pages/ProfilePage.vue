<template>
  <q-page class="kpss-page profile-page">
    <div class="profile-inner q-pa-lg">

      <div class="profile-header column items-center q-mb-xl">
        <q-avatar size="80px" class="profile-avatar q-mb-md">
          <img
            v-if="authStore.photoURL"
            :src="authStore.photoURL"
            referrerpolicy="no-referrer"
          />
          <q-icon v-else name="person" size="40px" color="white" />
        </q-avatar>
        <h2 class="text-h5 text-weight-bold text-white q-my-none">
          {{ authStore.displayName }}
        </h2>
        <p class="text-caption text-grey-5 q-mt-xs q-mb-none">
          {{ authStore.email }}
        </p>
      </div>

      <div class="stats-grid q-mb-lg">
        <div class="stat-card">
          <q-icon name="star_rate" size="28px" class="stat-icon stat-icon--star" />
          <div class="stat-value">{{ totalStars }}</div>
          <div class="stat-label">Toplam Yıldız</div>
        </div>
        <div class="stat-card">
          <q-icon name="check_circle" size="28px" class="stat-icon stat-icon--done" />
          <div class="stat-value">{{ completedTopics }}</div>
          <div class="stat-label">Tamamlanan Konu</div>
        </div>
        <div class="stat-card">
          <q-icon name="quiz" size="28px" class="stat-icon stat-icon--quiz" />
          <div class="stat-value">{{ totalAttempts }}</div>
          <div class="stat-label">Toplam Deneme</div>
        </div>
        <div class="stat-card">
          <q-icon name="trending_up" size="28px" class="stat-icon stat-icon--avg" />
          <div class="stat-value">%{{ averageScore }}</div>
          <div class="stat-label">Ortalama Başarı</div>
        </div>
      </div>

      <h3 class="text-subtitle1 text-weight-bold text-white q-mb-sm">Dersler</h3>
      <div class="column q-gutter-sm q-mb-xl">
        <div
          v-for="sub in subjectProgress"
          :key="sub.id"
          class="subject-stat-card row items-center no-wrap q-pa-md"
        >
          <q-avatar
            :style="{ background: sub.theme.primary }"
            text-color="white"
            size="42px"
          >
            <q-icon :name="sub.icon" size="22px" />
          </q-avatar>
          <div class="col q-ml-md">
            <div class="row items-center justify-between">
              <span class="text-body2 text-weight-bold text-white">{{ sub.title }}</span>
              <span class="text-caption text-amber">
                <q-icon name="star" size="14px" /> {{ sub.stars }}
              </span>
            </div>
            <q-linear-progress
              :value="sub.progress"
              color="amber"
              track-color="grey-9"
              rounded
              class="q-mt-xs"
              size="6px"
            />
            <div class="text-caption text-grey-5 q-mt-xs">
              {{ sub.completed }} / {{ sub.total }} konu tamamlandı
            </div>
          </div>
        </div>
      </div>

      <div class="column q-gutter-sm">
        <q-btn
          outline
          no-caps
          color="red-4"
          icon="logout"
          label="Çıkış Yap"
          class="logout-btn"
          @click="handleLogout"
        />
        <q-btn
          flat
          no-caps
          color="grey-6"
          icon="delete_forever"
          label="İlerlemeyi Sıfırla"
          size="sm"
          @click="confirmReset"
        />
      </div>

    </div>
  </q-page>
</template>

<script setup>
import { computed } from 'vue'
import { useRouter } from 'vue-router'
import { useQuasar } from 'quasar'
import { useAuthStore } from 'src/stores/auth'
import { useProgressStore } from 'src/stores/progress'
import { useContentStore } from 'src/stores/content'

const router = useRouter()
const $q = useQuasar()
const authStore = useAuthStore()
const progress = useProgressStore()
const content = useContentStore()

const totalStars = computed(() => {
  let s = 0
  for (const p of Object.values(progress.byTopic)) {
    if (p?.stars) s += p.stars
  }
  return s
})

const completedTopics = computed(() => {
  return Object.values(progress.byTopic).filter((p) => p?.completed).length
})

const totalAttempts = computed(() => {
  let a = 0
  for (const p of Object.values(progress.byTopic)) {
    if (p?.attempts) a += p.attempts
  }
  return a
})

const averageScore = computed(() => {
  const entries = Object.values(progress.byTopic).filter((p) => p?.bestScore > 0)
  if (!entries.length) return 0
  const sum = entries.reduce((acc, p) => acc + p.bestScore, 0)
  return Math.round(sum / entries.length)
})

const subjectProgress = computed(() => {
  return content.subjects.map((sub) => {
    const topics = content.topicsBySubject(sub.id)
    const topicIds = topics.map((t) => t.id)
    let stars = 0
    let completed = 0
    for (const id of topicIds) {
      const p = progress.byTopic[id]
      if (p?.stars) stars += p.stars
      if (p?.completed) completed += 1
    }
    return {
      ...sub,
      stars,
      completed,
      total: topicIds.length,
      progress: topicIds.length > 0 ? completed / topicIds.length : 0,
    }
  })
})

async function handleLogout() {
  await authStore.logout()
  router.replace({ name: 'login' })
}

function confirmReset() {
  $q.dialog({
    title: 'İlerlemeyi Sıfırla',
    message: 'Tüm yıldızlar ve ilerleme silinecek. Emin misiniz?',
    cancel: { flat: true, label: 'İptal' },
    ok: { color: 'red', label: 'Sıfırla', flat: true },
    dark: true,
  }).onOk(() => {
    progress.resetAll()
    $q.notify({ message: 'İlerleme sıfırlandı.', color: 'grey-8' })
  })
}
</script>

<style scoped>
.profile-page {
  background: linear-gradient(180deg, #12101a 0%, #1e1a28 100%);
}

.profile-inner {
  max-width: 480px;
  margin: 0 auto;
}

.profile-avatar {
  border: 3px solid rgba(155, 127, 212, 0.3);
  background: #2a2438;
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.3);
}

.stats-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 12px;
}

.stat-card {
  background: rgba(255, 255, 255, 0.05);
  border: 1px solid rgba(255, 255, 255, 0.08);
  border-radius: 16px;
  padding: 16px;
  text-align: center;
}

.stat-icon {
  margin-bottom: 8px;
}

.stat-icon--star { color: #FFD54F; }
.stat-icon--done { color: #4ECDC4; }
.stat-icon--quiz { color: #9B7FD4; }
.stat-icon--avg { color: #FF8A65; }

.stat-value {
  font-size: 22px;
  font-weight: 800;
  color: #fff;
}

.stat-label {
  font-size: 11px;
  color: rgba(245, 243, 248, 0.5);
  margin-top: 2px;
  text-transform: uppercase;
  letter-spacing: 0.04em;
}

.subject-stat-card {
  background: rgba(255, 255, 255, 0.05);
  border: 1px solid rgba(255, 255, 255, 0.08);
  border-radius: 14px;
}

.logout-btn {
  border-radius: 12px;
}
</style>
