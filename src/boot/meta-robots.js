import { defineBoot } from '#q-app/wrappers'

const NOINDEX_ROUTES = new Set(['quiz', 'result', 'subject-map'])

export default defineBoot(({ router }) => {
  let metaTag = document.querySelector('meta[name="robots"]')

  function updateRobots(routeName) {
    if (!metaTag) {
      metaTag = document.createElement('meta')
      metaTag.setAttribute('name', 'robots')
      document.head.appendChild(metaTag)
    }
    metaTag.setAttribute(
      'content',
      NOINDEX_ROUTES.has(routeName) ? 'noindex, nofollow' : 'index, follow',
    )
  }

  router.afterEach((to) => {
    updateRobots(to.name)
  })

  updateRobots(router.currentRoute.value.name)
})
