<template>
  <div class="login-page column items-center justify-center q-pa-lg">
    <div class="login-card column items-center q-pa-xl">
      <svg width="96" height="96" viewBox="0 0 288 288" fill="none" class="q-mb-md">
        <path d="M144 80L60 120L144 160L228 120Z" fill="#9B7FD4"/>
        <path d="M144 160L60 120L60 160L144 200Z" fill="#7B5FB8"/>
        <path d="M144 160L228 120L228 160L144 200Z" fill="#B89EE8"/>
        <rect x="201" y="118" width="6" height="54" fill="#FFD54F"/>
        <circle cx="204" cy="172" r="8" fill="#FFD54F"/>
      </svg>

      <h1 class="text-h4 text-weight-bold text-white q-my-sm">KPSS Çalış</h1>
      <p class="text-body2 text-grey-5 q-mb-lg text-center">
        Konu haritasında ilerle, soruları çöz, yıldız kazan.
      </p>

      <q-btn
        class="google-btn full-width"
        unelevated
        no-caps
        size="lg"
        :loading="loading"
        @click="login"
      >
        <svg class="q-mr-sm" width="20" height="20" viewBox="0 0 24 24">
          <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
          <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
          <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
          <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
        </svg>
        Google ile Giriş Yap
      </q-btn>
    </div>
  </div>
</template>

<script setup>
import { ref, watch, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useQuasar } from 'quasar'
import { useAuthStore } from 'src/stores/auth'

const router = useRouter()
const $q = useQuasar()
const authStore = useAuthStore()
const loading = ref(false)

onMounted(() => {
  authStore.init()
})

watch(
  () => authStore.isLoggedIn,
  (loggedIn) => {
    if (loggedIn) router.replace({ name: 'home' })
  },
  { immediate: true },
)

async function login() {
  loading.value = true
  try {
    const user = await authStore.loginWithGoogle()
    // Native redirect flow returns null here; navigation happens after auth state updates.
    if (user) router.replace({ name: 'home' })
  } catch (error) {
    const message =
      error?.message ||
      (typeof error === 'string' ? error : JSON.stringify(error || {})) ||
      'Giriş başarısız. Tekrar deneyin.'
    if (typeof $q.notify === 'function') {
      $q.notify({ message, color: 'negative', timeout: 6000 })
    } else {
      console.error('[login] notify unavailable:', message)
      window.alert(message)
    }
  } finally {
    loading.value = false
  }
}
</script>

<style scoped>
.login-page {
  min-height: 100vh;
  background: linear-gradient(180deg, #12101a 0%, #1e1a28 100%);
}

.login-card {
  max-width: 360px;
  width: 100%;
  background: rgba(255, 255, 255, 0.05);
  border: 1px solid rgba(255, 255, 255, 0.08);
  border-radius: 24px;
}

.google-btn {
  background: #fff !important;
  color: #3c4043 !important;
  font-weight: 600;
  border-radius: 12px;
  letter-spacing: 0.01em;
}
</style>
