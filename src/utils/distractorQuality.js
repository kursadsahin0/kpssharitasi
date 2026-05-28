import { isTooSimilarAnswer, normalizeAnswer } from './answerSimilarity.js'

const HISTORIC_PERSON =
  /\b(Mete|Attila|Bumin|Bilge|Kürşat|Maniakh|Balamir|Uldız|Alp Arslan|Osman Gazi|Orhan Bey|Murat|Bayezit|Mehmet|Fatih|Kanuni|Yavuz|Selim|Cem|Timur|Cengiz|Marco Polo|Kolomb|Polo|Tonyukuk|Kutluk|İstemi|Yagbu|Kültigin|Halil|Gennadios|Batuta|Kantakuzen|Vlad|Kelsen|Gökalp|Mahmut|Kaşgarlı)\b/i

const STATE_MARKERS =
  /Devleti|İmparatorluğu|Beyliği|Krallığı|Hanlığı|İmparatorluk|Hanlık|Sultanlığı/i

const PERSON_MARKERS =
  /\b(Bey|Paşa|Kağan|Hatun|Vezir|Komutan|Yagbu|Sultan|Halife|Sadrazam|Beylerbeyi|Patrik|Voyvoda)\b/i

const PLACE_MARKERS =
  /Kalesi|Camii|Şehri|Bölgesi|Nehri|Burnu|Köyü|Gölü|Hisarı|Sarayı|Boğazı|Dağı|Ovası|Körfezi|Denizi|Adası|İstasyonu|Kapısı/i

const BATTLE_MARKERS = /Savaşı|Antlaşması|Muharebesi|Seferi|İsyanı\b/i

const GROUP_OR_TRIBE =
  /\b(Akhunlar|Moğollar|Avarlar|Töles|Uygurlar|Basmiller|Karluklar|Oğuzlar|Kıpçaklar|Peçenekler|Kumanlar|Hung|Oguzlar|Karluk|Uygur|Basmil|Uzlar|Eftalitler|Bulgar|Juan Juan)\b/i

const MEANING_PHRASE =
  /\b(demektir|türemek|çoğalmak|miğfer|çağı|halk|manası|asimile|skolastik|kültür|andronova|serfler)\b/i

const NON_PERSON_NOUN =
  /(Yazıtı|Tengri|Otağı|Anıtı|Abidesi|Kitabesi|Boğası|Dağı|Nehri|Gölü|Kapı|Elma|Demir Kapı|Kızıl Elma|Gök Tengri|Karabalsagun)/i

const NON_PERSON_CONCEPT =
  /(Meclisi|Meclis|Yolu|Yolunu|Divanı|Ocağı|Kurultay|Ülüsü|İstişare|Teşkilat|Kanunu|Sistemi|Politikası|Ticaret|İpek|Kürk|Saltanat|Hakanlığı|İhtiyarlar|Töre|Kut\b|Böri\b|Ülken|hukuk kuralları)/i

const PERSON_EVENT_PHRASE =
  /yılında|yılı\b|kurması|donanma|fethe|yapmış|vermiş|olarak|sonucu|nedeni|döneminde|zamanında/i

export function commaCount(text) {
  return (String(text).match(/,/g) ?? []).length
}

export function isLengthCompatible(candidate, correct) {
  const c = String(correct).trim().length
  const w = String(candidate).trim().length
  if (c <= 12) return w >= 2 && w <= 38
  if (c <= 30) return w >= c * 0.4 && w <= c * 2.1
  if (c <= 55) return w >= c * 0.45 && w <= c * 1.85
  return w >= c * 0.5 && w <= c * 1.55
}

export function topicEraGroup(topicId = '') {
  const id = String(topicId)
  if (/vatandaslik/.test(id)) return 'vatandaslik'
  if (/cografya/.test(id)) return 'cografya'
  if (/osmanli|kurulus|yukselme|fatih|kanuni|mesrutiyet|tanzimat|19-|18-|17-|balkan/.test(id)) {
    return 'osmanli'
  }
  if (/gokturk|uygur|hun|karahan|selcuk|islam|asya|orta-asya|turk-adi|beylik|timur|akkoyunlu/.test(id)) {
    return 'erken'
  }
  return 'genel'
}

export function classifyAnswerKind(answer) {
  const a = String(answer).trim()
  if (!a) return 'unknown'
  if (/^\d{4}$/.test(a)) return 'year'
  if (BATTLE_MARKERS.test(a)) return 'battle'
  if (STATE_MARKERS.test(a)) return 'state'
  if (/\b(Akhunlar|Eftalitler)\b/i.test(a)) return 'state'
  if (PLACE_MARKERS.test(a)) return 'place'
  if (PERSON_MARKERS.test(a) || HISTORIC_PERSON.test(a)) return 'person'
  if (GROUP_OR_TRIBE.test(a) && !STATE_MARKERS.test(a)) return 'tribe'
  if (
    commaCount(a) >= 1 &&
    !STATE_MARKERS.test(a) &&
    a.length < 55 &&
    /\b(demektir|sahibi|manası|çağı|politikası|türemek|çoğalmak|töreli|kanun|nizam|miğfer|halk)\b/i.test(a)
  ) {
    return 'short'
  }
  if (
    commaCount(a) >= 1 &&
    !STATE_MARKERS.test(a) &&
    a.length < 55 &&
    /\b(Çin|Moğol|Kitan|Rus|Bizans|Sasani|Abbas|Frank|Hun|Selçuklu|Osmanlı)\b/i.test(a)
  ) {
    return 'state'
  }
  if (commaCount(a) >= 1 && !STATE_MARKERS.test(a) && a.length < 55) return 'tribe'
  if (a.length > 52) return 'long'
  if (a.length > 28) return 'medium'
  return 'short'
}

/** Soru metninden beklenen cevap tipi */
export function inferQuestionKind(question) {
  const text = question.text ?? ''
  const answerKind = classifyAnswerKind(question.answer)

  // Türkçe ı/ş/ğ sonrası \b güvenilir değil; anlam sorularını önce yakala
  if (/anlamı|anlamda|ne\s+demektir|ne\s+anlama|hangi\s+anlam|isminin\s+anlamı|isiminin\s+anlamı/i.test(text)) {
    return 'meaning'
  }
  if (/Türk\s+(adı|isimi|ismin)/i.test(text) && /anlam/i.test(text)) {
    return 'meaning'
  }
  if (
    /\b(kim(dir|in|lerin)?|hangi\s+(hükümdar|padişah|kağan|komutan|vezir|lider|elçi|seyyah|bilgin|mimar)|adına\s+dikilmiş|kimlerin|lakabı|mahlası)\b/i.test(
      text,
    )
  ) {
    return 'person'
  }
  if (/\b(boyları|boylar|boyu|Türk boyları|hangi boy)\b/i.test(text)) return 'tribe'
  if (/topluluğu\s+hangisidir|Türk\s+topluluğu|hangi\s+topluluk/i.test(text)) return 'tribe'
  if (
    /\b(hangi\s+devlet|devletlerin|devlet\s+hangisidir|devleti\s+hangisidir|hangi\s+Türk\s+devleti|Türk\s+devleti|son verdiği devlet|hangi\s+ülke|ülkeye\s+açılır|hangi\s+imparatorluk)\b/i.test(
      text,
    )
  ) {
    return 'state'
  }
  if (/\b(neresidir|nerede|hangi\s+(yer|şehir|bölge|kale|nehir|il|merkez)|en\s+(güney|kuzey|doğu|batı))\b/i.test(text)) {
    return 'place'
  }
  if (/\b(hangi\s+yıl|yılında\s+yapılmış|hangi\s+tarih)\b/i.test(text)) return 'year'
  if (/\b(savaşının\s+adı|hangi\s+savaş|antlaşması|seferi|muharebesi|isyanı\s+nedir)\b/i.test(text)) {
    return 'battle'
  }
  if (/\b(ne\s+ad\s+verilir|ne\s+isim\s+verilir|ünvanı\s+nedir)\b/i.test(text)) {
    return answerKind === 'person' ? 'person' : 'institution'
  }
  if (/\b(ortak\s+özellik|özellikleri)\b/i.test(text)) return 'concept'
  if (/\b(amacı\s+nedir|amacı\s+ne|geçişin\s+amacı|toplanma\s+amacı|amaçları)\b/i.test(text)) {
    return 'concept'
  }
  if (/\b(nedeni|sonucu|özelliği|sebebi|amacı)\b/i.test(text)) return 'concept'
  if (
    /\bnelerdir\b/i.test(text) &&
    (String(question.answer).length > 42 || /[;]|yapmaları|savaş|taraf/i.test(question.answer))
  ) {
    return 'concept'
  }
  if (/anlamı\s+nedir|isminin\s+anlamı/i.test(text)) return 'meaning'
  if (/\bne\s+denir\b/i.test(text)) {
    if (answerKind === 'person') return 'person'
    if (answerKind === 'state') return 'state'
    if (answerKind === 'tribe') return 'tribe'
    return 'definition'
  }
  if (/\bnedir\??/i.test(text) && !/anlam/i.test(text)) {
    if (answerKind === 'person') return 'person'
    if (answerKind === 'state') return 'state'
    if (answerKind === 'tribe') return 'tribe'
    return 'definition'
  }

  if (answerKind === 'tribe' && /\b(anlam|demektir|nedir)\b/i.test(text)) return 'meaning'
  if (answerKind === 'short' && /\b(anlam|demektir|nedir)\b/i.test(text)) return 'meaning'

  return answerKind
}

function isProperStateLabel(label) {
  if (!label) return false
  if (STATE_MARKERS.test(label)) return true
  if (
    /^(Çin|Bizans|İran|Suriye|Bulgaristan|Rusya|Sasani|Avar|Göktürk|Uygur|Selçuklu|Osmanlı|Venedik|Memluk|Asya Hun|Avrupa Hun)/i.test(
      label.split(/[,;]/)[0].trim(),
    )
  ) {
    return true
  }
  if (/\b(Akhunlar|Eftalitler)\b/i.test(label)) return true
  return false
}

function looksLikeTribeAnswer(label) {
  if (!label) return false
  if (MEANING_PHRASE.test(label)) return false
  if (/(alfabe|yazıtı|kitabesi|eseri|düşünce|kültürü|medeniyet|anlayışı)/i.test(label)) return false
  if (STATE_MARKERS.test(label)) return false
  if (PERSON_MARKERS.test(label) && !GROUP_OR_TRIBE.test(label)) return false
  if (NON_PERSON_CONCEPT.test(label) || NON_PERSON_NOUN.test(label)) return false
  if (PERSON_EVENT_PHRASE.test(label)) return false
  if (GROUP_OR_TRIBE.test(label)) return true
  if (commaCount(label) >= 1 && !STATE_MARKERS.test(label)) {
    if (!GROUP_OR_TRIBE.test(label)) return false
    const parts = label.split(',').map((s) => s.trim())
    return parts.every((p) => !STATE_MARKERS.test(p) && p.length > 1)
  }
  if (/\b(lar|ler)\s*$/i.test(label.trim()) && label.length < 45) return true
  return false
}

function looksLikePersonAnswer(label) {
  if (NON_PERSON_CONCEPT.test(label) || NON_PERSON_NOUN.test(label)) return false
  if (PERSON_EVENT_PHRASE.test(label)) return false
  if (STATE_MARKERS.test(label)) return false
  if (GROUP_OR_TRIBE.test(label) && !PERSON_MARKERS.test(label)) return false
  if (label.length > 42 && commaCount(label) === 0) return false

  if (PERSON_MARKERS.test(label) || HISTORIC_PERSON.test(label)) {
    if (commaCount(label) >= 1) return true
    const wordCount = label.split(/\s+/).length
    if (wordCount > 3 && !HISTORIC_PERSON.test(label)) return false
    return label.length <= 42
  }
  if (commaCount(label) >= 1) {
    const parts = label.split(',').map((s) => s.trim())
    return parts.every(
      (p) =>
        PERSON_MARKERS.test(p) ||
        HISTORIC_PERSON.test(p) ||
        /\b(Kağan|Han|Yagbu|Tonyukuk|Kürşat|Kültigin|Bilge)\b/i.test(p),
    )
  }
  if (/\bve\b/i.test(label)) return false
  return false
}

/**
 * Yanlış şık bu soru için mantıklı mı?
 */
export function isValidDistractor(question, candidateLabel, options = {}) {
  const expectedKind = options.expectedKind ?? inferQuestionKind(question)
  const correct = String(question.answer).trim()
  const label = String(candidateLabel).trim()

  if (!label || isTooSimilarAnswer(label, correct)) return false

  // Çapraz tip engeli
  if (expectedKind === 'person') {
    if (isProperStateLabel(label) || looksLikeTribeAnswer(label)) return false
  }
  if (expectedKind === 'state') {
    if (looksLikePersonAnswer(label)) return false
    if (looksLikeTribeAnswer(label) && !isProperStateLabel(label)) return false
    if (commaCount(correct) >= 1) {
      if (isProperStateLabel(label)) return true
      if (/Devleti|İmparatorluğu|Beyliği|Krallığı|Selçuklu|Osmanlı/i.test(label)) return true
      if (
        commaCount(label) >= 1 &&
        /\b(Çin|Moğol|Kitan|Rus|Bizans|Sasani|Abbas|Frank|Hun|İran|Suriye)\b/i.test(label)
      ) {
        return true
      }
    }
  }
  if (expectedKind === 'tribe') {
    if (isProperStateLabel(label) || looksLikePersonAnswer(label)) return false
  }
  if (expectedKind === 'place' && (looksLikePersonAnswer(label) || isProperStateLabel(label))) {
    return false
  }

  if (
    expectedKind !== 'meaning' &&
    expectedKind !== 'person' &&
    expectedKind !== 'tribe' &&
    !isLengthCompatible(label, correct)
  ) {
    return false
  }
  if (expectedKind === 'meaning' && (label.length < 2 || label.length > 48)) return false

  const correctCommas = commaCount(correct)
  const labelCommas = commaCount(label)
  if (labelCommas >= 2 && correctCommas < 2) return false
  if (labelCommas >= 1 && correctCommas === 0 && label.length > 35 && expectedKind !== 'tribe') {
    return false
  }

  if (expectedKind === 'person') {
    if (!looksLikePersonAnswer(label)) return false
    if (/\bkimlerin\b/i.test(question.text) && commaCount(correct) >= 2) {
      if (commaCount(label) >= 2) return looksLikePersonAnswer(label)
      const base = label.replace(/\([^)]*\)/g, ' ').trim()
      const words = base.split(/\s+/).filter(Boolean).length
      if (words > 3) return false
      return HISTORIC_PERSON.test(label) || PERSON_MARKERS.test(label)
    }
    if (
      options.strictEra &&
      options.sourceTopicId &&
      topicEraGroup(options.sourceTopicId) !== topicEraGroup(question.topicId)
    ) {
      return false
    }
    return true
  }

  if (expectedKind === 'state') {
    if (
      options.strictEra &&
      options.sourceTopicId &&
      topicEraGroup(options.sourceTopicId) !== topicEraGroup(question.topicId)
    ) {
      return false
    }
    const qEra = topicEraGroup(question.topicId)
    if (qEra === 'erken') {
      if (
        /Selçuklu|Osmanlı|Memluk|Timur|Gazneli|Karahanlı|Türkiye Sel|Abbasi Devleti|Tolunoğulları|Dilmaçoğulları|Beyliği|Beylik|oğulları|oğlu\b/i.test(
          label,
        )
      ) {
        return false
      }
    }
    if (qEra === 'osmanli' && /Hun Devleti|Göktürk|Uygur Devleti|Avarlar/i.test(label)) {
      return false
    }
    if (PERSON_EVENT_PHRASE.test(label) || /ortadan kaldır|kaldırmas|yıkmış|bastırmas/i.test(label)) {
      return false
    }
    if (label.length > 55) return false
    if (/Göktürk Devleti/i.test(label) && /Göktürk/i.test(correct) === false) {
      // Aynı dönem farklı devlet; II. Göktürk şıkkı bu soruda yanıltıcı olabilir ama kabul
    }
    return isProperStateLabel(label)
  }

  if (expectedKind === 'tribe') {
    if (BATTLE_MARKERS.test(label) || /savaşları|muharebesi/i.test(label)) return false
    return looksLikeTribeAnswer(label)
  }

  if (expectedKind === 'place') {
    const kind = classifyAnswerKind(label)
    return kind === 'place' || (kind === 'short' && !looksLikePersonAnswer(label) && !isProperStateLabel(label))
  }

  if (expectedKind === 'year') {
    return /^\d{3,4}/.test(label) || classifyAnswerKind(label) === 'year'
  }

  if (expectedKind === 'battle') {
    return BATTLE_MARKERS.test(label) || classifyAnswerKind(label) === 'battle'
  }

  if (expectedKind === 'meaning') {
    if (looksLikePersonAnswer(label) || isProperStateLabel(label)) return false
    if (GROUP_OR_TRIBE.test(label) && !/\b(demektir|sahibi|çağı|halk)\b/i.test(label)) return false
    if (STATE_MARKERS.test(label) || HISTORIC_PERSON.test(label)) return false
    if (BATTLE_MARKERS.test(label) || PLACE_MARKERS.test(label)) return false
    return label.length >= 2 && label.length <= 52
  }

  if (expectedKind === 'concept') {
    if (looksLikePersonAnswer(label) && correct.length < 35) return false
    if (isProperStateLabel(label) && correct.length > 35) return false
    if (correct.length > 42) {
      if (label.length < correct.length * 0.35) return false
      if (
        label.length < 32 &&
        !/[;]|yapmaları|savaş|ordu|taraf|özellik|nedeni|sonucu|geçiş|etkili/i.test(label)
      ) {
        return false
      }
    }
    return classifyAnswerKind(label) !== 'long' || label.length > 35
  }

  if (expectedKind === 'institution' || expectedKind === 'definition') {
    if (looksLikePersonAnswer(label) && correct.length < 35) return false
    if (isProperStateLabel(label) && !isProperStateLabel(correct) && correct.length < 35) return false
    if (looksLikeTribeAnswer(label) && classifyAnswerKind(correct) !== 'tribe') return false
    if (correct.length < 25 && label.length > 55) return false
    if (correct.length > 42 && label.length < 20) return false
    return classifyAnswerKind(label) !== 'long'
  }

  return classifyAnswerKind(label) !== 'long'
}

export function scoreDistractor(question, label, sourceTopicId) {
  let score = 0
  if (sourceTopicId === question.topicId) score += 20
  if (topicEraGroup(sourceTopicId) === topicEraGroup(question.topicId)) score += 10
  const correct = String(question.answer).trim()
  const lenRatio = label.length / Math.max(correct.length, 1)
  score += 10 - Math.min(10, Math.abs(lenRatio - 1) * 8)
  return score
}

export function pickBestDistractors(question, candidates, count = 3) {
  const items = candidates.map((c) =>
    typeof c === 'string' ? { label: c, topicId: question.topicId } : c,
  )
  const valid = filterDistinctDistractors(
    question,
    items.map((i) => i.label),
  )
  const validSet = new Set(valid.map((l) => normalizeAnswer(l)))

  const scored = items
    .filter((i) => validSet.has(normalizeAnswer(i.label)))
    .map((i) => ({
      label: i.label,
      score: scoreDistractor(question, i.label, i.topicId ?? question.topicId),
    }))
    .sort((a, b) => b.score - a.score)

  let h = 0
  for (let i = 0; i < question.id.length; i += 1) h = (h * 31 + question.id.charCodeAt(i)) >>> 0
  const start = h % Math.max(1, scored.length)
  const picked = []
  for (let i = 0; picked.length < count && i < scored.length; i += 1) {
    const item = scored[(start + i) % scored.length]
    if (!picked.includes(item.label)) picked.push(item.label)
  }
  return picked
}

export function filterDistinctDistractors(question, labels, options = {}) {
  const correct = String(question.answer).trim()
  const expected = options.expectedKind ?? inferQuestionKind(question)
  const out = []
  for (const raw of labels) {
    const label = String(raw).trim()
    if (!isValidDistractor(question, label, { ...options, expectedKind: expected })) continue
    if (isTooSimilarAnswer(label, correct)) continue
    if (out.some((x) => isTooSimilarAnswer(x, label))) continue
    out.push(label)
  }
  return out
}
