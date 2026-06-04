const STORAGE_KEY = 'kpss-cookie-consent-v1'

export function hasCookieConsent() {
  try {
    return localStorage.getItem(STORAGE_KEY) === 'accepted'
  } catch {
    return false
  }
}

export function acceptCookieConsent() {
  try {
    localStorage.setItem(STORAGE_KEY, 'accepted')
  } catch {
    // private mode
  }
}
