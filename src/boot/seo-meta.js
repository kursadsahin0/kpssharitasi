import { defineBoot } from '#q-app/wrappers'
import {
  SITE_LOCALE,
  SITE_NAME,
  OG_IMAGE_PATH,
  buildDocumentTitle,
  buildJsonLd,
  pageUrl,
  resolvePageSeo,
} from 'src/config/seo'

function upsertMeta(attr, key, content) {
  let el = document.querySelector(`meta[${attr}="${key}"][data-seo]`)
  if (!el) {
    el = document.createElement('meta')
    el.setAttribute(attr, key)
    el.setAttribute('data-seo', 'true')
    document.head.appendChild(el)
  }
  el.setAttribute('content', content)
}

function upsertLink(rel, href) {
  let el = document.querySelector(`link[rel="${rel}"][data-seo]`)
  if (!el) {
    el = document.createElement('link')
    el.setAttribute('rel', rel)
    el.setAttribute('data-seo', 'true')
    document.head.appendChild(el)
  }
  el.setAttribute('href', href)
}

function updateJsonLd(route) {
  document.querySelectorAll('script[data-seo-jsonld]').forEach((node) => node.remove())

  const data = buildJsonLd(route)
  if (!data) return

  const script = document.createElement('script')
  script.type = 'application/ld+json'
  script.setAttribute('data-seo-jsonld', 'true')
  script.textContent = JSON.stringify(data)
  document.head.appendChild(script)
}

function updateSeo(route) {
  const { title, description } = resolvePageSeo(route)
  const canonical = pageUrl(route.fullPath)
  const ogImage = pageUrl(OG_IMAGE_PATH)
  const documentTitle = buildDocumentTitle(title)

  document.title = documentTitle

  upsertMeta('name', 'description', description)
  upsertLink('canonical', canonical)

  upsertMeta('property', 'og:title', documentTitle)
  upsertMeta('property', 'og:description', description)
  upsertMeta('property', 'og:url', canonical)
  upsertMeta('property', 'og:type', 'website')
  upsertMeta('property', 'og:locale', SITE_LOCALE)
  upsertMeta('property', 'og:site_name', SITE_NAME)
  upsertMeta('property', 'og:image', ogImage)

  upsertMeta('name', 'twitter:card', 'summary_large_image')
  upsertMeta('name', 'twitter:title', documentTitle)
  upsertMeta('name', 'twitter:description', description)
  upsertMeta('name', 'twitter:image', ogImage)

  updateJsonLd(route)
}

export default defineBoot(({ router }) => {
  router.afterEach((to) => {
    updateSeo(to)
  })

  updateSeo(router.currentRoute.value)
})
