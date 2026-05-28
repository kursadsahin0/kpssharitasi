import { defineRouter } from '#q-app/wrappers'
import {
  createRouter,
  createMemoryHistory,
  createWebHistory,
  createWebHashHistory,
} from 'vue-router'
import { onAuthStateChanged } from 'firebase/auth'
import { auth, firebaseReady } from 'src/boot/firebase'
import routes from './routes'

function getCurrentUser() {
  if (!firebaseReady || !auth) return Promise.resolve(null)
  return new Promise((resolve) => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      unsubscribe()
      resolve(user)
    })
  })
}

export default defineRouter((/* { store, ssrContext } */) => {
  const createHistory = process.env.SERVER
    ? createMemoryHistory
    : process.env.VUE_ROUTER_MODE === 'history'
      ? createWebHistory
      : createWebHashHistory

  const Router = createRouter({
    scrollBehavior: () => ({ left: 0, top: 0 }),
    routes,
    history: createHistory(process.env.VUE_ROUTER_BASE),
  })

  Router.beforeEach(async (to) => {
    const requiresAuth = to.matched.some((r) => r.meta.requiresAuth)
    if (requiresAuth) {
      const user = await getCurrentUser()
      if (!user) return { name: 'login' }
    } else if (to.name === 'login') {
      const user = await getCurrentUser()
      if (user) return { name: 'home' }
    }
  })

  return Router
})
