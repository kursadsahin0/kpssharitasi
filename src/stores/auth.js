import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import {
  GoogleAuthProvider,
  signInWithPopup,
  signOut,
  onAuthStateChanged,
} from 'firebase/auth'
import { auth, firebaseReady, firebaseInitError } from 'src/boot/firebase'

export const useAuthStore = defineStore('auth', () => {
  const user = ref(null)
  const loading = ref(true)

  const isLoggedIn = computed(() => !!user.value)
  const displayName = computed(() => user.value?.displayName || '')
  const photoURL = computed(() => user.value?.photoURL || '')
  const email = computed(() => user.value?.email || '')

  function init() {
    if (!firebaseReady || !auth) {
      loading.value = false
      console.error(firebaseInitError || '[auth] Firebase is not configured.')
      return
    }
    onAuthStateChanged(auth, (firebaseUser) => {
      if (firebaseUser) {
        user.value = {
          uid: firebaseUser.uid,
          displayName: firebaseUser.displayName,
          email: firebaseUser.email,
          photoURL: firebaseUser.photoURL,
        }
      } else {
        user.value = null
      }
      loading.value = false
    })
  }

  async function loginWithGoogle() {
    if (!firebaseReady || !auth) {
      throw new Error(firebaseInitError || '[auth] Firebase is not configured.')
    }
    try {
      const provider = new GoogleAuthProvider()
      const result = await signInWithPopup(auth, provider)
      return result.user ?? null
    } catch (error) {
      console.error('[auth] Google sign-in failed:', error.message)
      throw error
    }
  }

  async function logout() {
    if (!firebaseReady || !auth) {
      user.value = null
      return
    }
    await signOut(auth)
    user.value = null
  }

  return {
    user,
    loading,
    isLoggedIn,
    displayName,
    photoURL,
    email,
    init,
    loginWithGoogle,
    logout,
  }
})
