/** Google AdSense yayıncı kimliği (AdSense panelinden). */
export const ADSENSE_CLIENT = 'ca-pub-3498040280017092'

const slot = (key) => {
  const v = import.meta.env[key]
  return typeof v === 'string' ? v.trim() : ''
}

/** Reklam birimi oluşturduktan sonra .env ile slot id girin; boşsa blok gösterilmez. */
export const ADSENSE_SLOTS = {
  home: slot('VITE_ADSENSE_SLOT_HOME'),
  subjectMap: slot('VITE_ADSENSE_SLOT_SUBJECT_MAP'),
  result: slot('VITE_ADSENSE_SLOT_RESULT'),
}
