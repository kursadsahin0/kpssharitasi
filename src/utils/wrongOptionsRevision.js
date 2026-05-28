import { ref } from 'vue'

/** questions-*.js düzenlenince quiz destesini yeniden hesaplatır (dev HMR) */
export const wrongOptionsRevision = ref(0)

if (import.meta.hot) {
  const modules = import.meta.glob('../assets/data/questions-*.js')
  for (const path of Object.keys(modules)) {
    import.meta.hot.accept(path, () => {
      wrongOptionsRevision.value += 1
    })
  }
}
