/** Google AdSense yayıncı kimliği (AdSense panelinden). */
export const ADSENSE_CLIENT = 'ca-pub-3498040280017092'

/**
 * Onay alana kadar false bırakın. AdSense onayından sonra Netlify'de
 * VITE_ADSENSE_LIVE=true yapın ve redeploy edin.
 */
export const ADSENSE_LIVE =
  import.meta.env.VITE_ADSENSE_LIVE === 'true' ||
  import.meta.env.VITE_ADSENSE_LIVE === true

const slot = (key) => {
  const v = import.meta.env[key]
  return typeof v === 'string' ? v.trim() : ''
}

export const ADSENSE_SLOTS = {
  content: slot('VITE_ADSENSE_SLOT_CONTENT') || slot('VITE_ADSENSE_SLOT_HOME'),
}
