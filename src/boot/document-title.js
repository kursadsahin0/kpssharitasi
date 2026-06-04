import { defineBoot } from '#q-app/wrappers'

const SITE_NAME = 'KPSS Haritası'

export default defineBoot(({ router }) => {
  router.afterEach((to) => {
    const pageTitle = to.meta?.title
    document.title = pageTitle ? `${pageTitle} | ${SITE_NAME}` : SITE_NAME
  })
})
