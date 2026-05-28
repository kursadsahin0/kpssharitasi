import { defineBoot } from '#q-app/wrappers'
import { initializeApp } from 'firebase/app'
import { getAuth } from 'firebase/auth'

const firebaseConfig = {
  apiKey: 'AIzaSyCcSIbLKFXWzX1bE7jO0ZOSINcve59npOk',
  authDomain: 'nextjs-auth-6ade1.firebaseapp.com',
  projectId: 'nextjs-auth-6ade1',
  storageBucket: 'nextjs-auth-6ade1.firebasestorage.app',
  messagingSenderId: '907355166468',
  appId: '1:907355166468:web:4f8e2c9a4e219556506251',
}

const app = initializeApp(firebaseConfig)
const auth = getAuth(app)

export { app, auth }

export default defineBoot(() => {
})
