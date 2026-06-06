import { ADSENSE_CLIENT } from 'src/config/adsense'
import { hasCookieConsent } from 'src/utils/cookieConsent'

/** AdSense: yalnızca yeterli yayıncı metni olan sayfalarda reklam. */
export const ADSENSE_ALLOWED_ROUTE_NAMES = new Set([
  'home',
  'about',
  'faq',
  'subject-guide',
])

/** Quiz, sonuç, harita vb. — reklam yasak (AdSense politika ihlali). */
export const ADSENSE_BLOCKED_ROUTE_NAMES = new Set([
  'quiz',
  'result',
  'subject-map',
])

export function canShowAdsense(routeName) {
  if (!routeName || ADSENSE_BLOCKED_ROUTE_NAMES.has(routeName)) return false
  if (!ADSENSE_ALLOWED_ROUTE_NAMES.has(routeName)) return false
  return hasCookieConsent()
}

let scriptLoading = null

export function loadAdSenseScript() {
  if (typeof document === 'undefined') return Promise.resolve(false)

  const existing = document.querySelector(
    `script[src*="adsbygoogle.js"][src*="${ADSENSE_CLIENT}"]`,
  )
  if (existing) return Promise.resolve(true)

  if (scriptLoading) return scriptLoading

  scriptLoading = new Promise((resolve) => {
    const script = document.createElement('script')
    script.async = true
    script.src = `https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=${ADSENSE_CLIENT}`
    script.crossOrigin = 'anonymous'
    script.onload = () => resolve(true)
    script.onerror = () => resolve(false)
    document.head.appendChild(script)
  })

  return scriptLoading
}
