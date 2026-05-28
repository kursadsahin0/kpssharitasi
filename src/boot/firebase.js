import { defineBoot } from '#q-app/wrappers'
import { initializeApp } from 'firebase/app'
import { getAuth } from 'firebase/auth'

const requiredEnvKeys = [
  'VITE_FIREBASE_API_KEY',
  'VITE_FIREBASE_AUTH_DOMAIN',
  'VITE_FIREBASE_PROJECT_ID',
  'VITE_FIREBASE_STORAGE_BUCKET',
  'VITE_FIREBASE_MESSAGING_SENDER_ID',
  'VITE_FIREBASE_APP_ID',
]

const missingEnvKeys = requiredEnvKeys.filter((key) => !import.meta.env[key])
const firebaseReady = missingEnvKeys.length === 0

const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID,
}

const app = firebaseReady ? initializeApp(firebaseConfig) : null
const auth = app ? getAuth(app) : null
const firebaseInitError = firebaseReady
  ? ''
  : `[firebase] Missing required env var(s): ${missingEnvKeys.join(', ')}`

if (!firebaseReady) {
  console.error(firebaseInitError)
}

export { app, auth, firebaseReady, firebaseInitError }

export default defineBoot(() => {
})
