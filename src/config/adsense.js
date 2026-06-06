/** Google AdSense yayıncı kimliği (AdSense panelinden). */
export const ADSENSE_CLIENT = 'ca-pub-3498040280017092'

const slot = (key) => {
  const v = import.meta.env[key]
  return typeof v === 'string' ? v.trim() : ''
}

/** Yalnızca içerik sayfalarında kullanın. Slot yoksa reklam gösterilmez. */
export const ADSENSE_SLOTS = {
  content: slot('VITE_ADSENSE_SLOT_CONTENT') || slot('VITE_ADSENSE_SLOT_HOME'),
}
