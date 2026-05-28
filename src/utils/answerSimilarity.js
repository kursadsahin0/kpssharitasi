export function normalizeAnswer(text) {
  return String(text)
    .trim()
    .toLowerCase()
    .replace(/\s+/g, ' ')
}

/** Parantez ve fazla boşlukları kaldırarak karşılaştırma metni */
function coreAnswer(text) {
  return normalizeAnswer(text)
    .replace(/\([^)]*\)/g, ' ')
    .replace(/\s+/g, ' ')
    .trim()
}

/**
 * Yanlış şık doğru cevapla aynı/çok yakın mı?
 * Örn. "II. Göktürk Devleti" ≈ "II. Göktürk Devleti (Kutluklar)"
 */
export function isTooSimilarAnswer(candidate, reference) {
  const cand = normalizeAnswer(candidate)
  const ref = normalizeAnswer(reference)
  if (!cand || !ref) return false
  if (cand === ref) return true

  const candCore = coreAnswer(candidate)
  const refCore = coreAnswer(reference)
  if (candCore && refCore && candCore === refCore) return true

  const minLen = Math.min(candCore.length, refCore.length)
  if (minLen >= 10) {
    if (candCore.includes(refCore) || refCore.includes(candCore)) return true
  }

  return false
}

export function filterDistinctAnswers(labels, referenceLabel) {
  const out = []
  for (const label of labels) {
    const trimmed = String(label).trim()
    if (!trimmed) continue
    if (isTooSimilarAnswer(trimmed, referenceLabel)) continue
    if (out.some((existing) => isTooSimilarAnswer(trimmed, existing))) continue
    out.push(trimmed)
  }
  return out
}
