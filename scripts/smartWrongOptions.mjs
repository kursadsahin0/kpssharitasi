/**
 * Soru metni + cevap tipine göre mantıklı yanlış şık seçimi.
 */
import { isTooSimilarAnswer, normalizeAnswer } from '../src/utils/answerSimilarity.js'
import {
  filterDistinctDistractors,
  inferQuestionKind,
  isValidDistractor,
  pickBestDistractors,
  topicEraGroup,
} from '../src/utils/distractorQuality.js'

export { inferQuestionKind, classifyAnswerKind as classifyAnswer } from '../src/utils/distractorQuality.js'

const TYPED_KINDS = new Set([
  'person',
  'state',
  'tribe',
  'place',
  'year',
  'battle',
  'meaning',
  'definition',
  'concept',
  'institution',
])

function collectLabels(questions, question, options) {
  const labels = []
  for (const q of questions) {
    if (q.id === question.id) continue
    const label = String(q.answer).trim()
    if (!label) continue
    if (isValidDistractor(question, label, options)) {
      labels.push({ label, topicId: q.topicId })
    }
  }
  return labels
}

function mergePools(...pools) {
  const seen = new Set()
  const out = []
  for (const pool of pools) {
    for (const item of pool) {
      const key = normalizeAnswer(item.label)
      if (seen.has(key)) continue
      seen.add(key)
      out.push(item)
    }
  }
  return out
}

function eraQuestions(subjectQuestions, batchQuestions, era, eraIndex) {
  if (eraIndex) return eraIndex.get(era) ?? []
  const source = subjectQuestions.length ? subjectQuestions : batchQuestions
  return source.filter((q) => topicEraGroup(q.topicId) === era)
}

function expandFromEra(eraQs, batchQuestions, question, expectedKind) {
  const list = eraQs.length ? eraQs : batchQuestions
  return collectLabels(list, question, {
    expectedKind,
    strictEra: ['person', 'tribe', 'state'].includes(expectedKind),
  })
}

/** Aynı konu → aynı dönem → aynı dosya sırasıyla genişleyen aday havuzları */
function buildPaddingPools(
  question,
  topicQuestions,
  batchQuestions,
  subjectQuestions,
  expectedKind,
  eraIndex = null,
) {
  const era = topicEraGroup(question.topicId)
  const eraQs = eraQuestions(subjectQuestions, batchQuestions, era, eraIndex)
  const pools = []

  pools.push(
    collectLabels(topicQuestions, question, {
      expectedKind,
      sourceTopicId: question.topicId,
    }),
  )

  if (expectedKind === 'meaning') {
    return pools
  }

  if (['person', 'state', 'tribe'].includes(expectedKind)) {
    pools.push(expandFromEra(eraQs, batchQuestions, question, expectedKind))
    pools.push(collectLabels(batchQuestions, question, { expectedKind }))
    return pools
  }

  if (expectedKind === 'concept') {
    const conceptTopic = topicQuestions.filter((q) => {
      if (q.id === question.id) return false
      const a = String(q.answer).trim()
      return (
        a.length >= 28 &&
        /[;]|amacı|nedeni|sonucu|özellik|etkili|tehlike|yapmaları|savaş|taraf|geçiş/i.test(a)
      )
    })
    pools.push(
      collectLabels(conceptTopic, question, { expectedKind: 'concept' }),
    )
  }

  pools.push(collectLabels(batchQuestions, question, { expectedKind }))
  pools.push(collectLabels(eraQs, question, { expectedKind }))

  return pools
}

/**
 * Önce tipine uygun şıklar; anlam sorularında yalnızca aynı konudaki diğer anlamlar.
 */
function fillToThreeWrong(question, picked, pools, expectedKind, topicQuestions) {
  const correct = String(question.answer).trim()
  const out = []
  const seen = new Set([normalizeAnswer(correct)])

  const tryAdd = (label, requireValid = true) => {
    const t = String(label).trim()
    if (!t || out.length >= 3) return
    if (requireValid && !isValidDistractor(question, t, { expectedKind })) return
    const key = normalizeAnswer(t)
    if (seen.has(key)) return
    if (out.some((x) => isTooSimilarAnswer(x, t))) return
    seen.add(key)
    out.push(t)
  }

  for (const label of picked) tryAdd(label, true)

  for (const pool of pools) {
    const ranked = pickBestDistractors(question, pool, pool.length)
    for (const label of ranked) {
      if (out.length >= 3) break
      tryAdd(label, true)
    }
  }

  if (out.length < 3 && expectedKind === 'meaning') {
    for (const q of topicQuestions) {
      if (out.length >= 3) break
      if (q.id === question.id) continue
      tryAdd(q.answer, false)
    }
  }

  if (out.length < 3 && ['tribe', 'person', 'state'].includes(expectedKind)) {
    for (const pool of pools) {
      for (const { label } of pool) {
        if (out.length >= 3) break
        tryAdd(label, true)
      }
    }
  }

  if (out.length < 3 && expectedKind === 'concept') {
    for (const pool of pools) {
      for (const { label } of pool) {
        if (out.length >= 3) break
        const len = String(label).trim().length
        const correctLen = String(question.answer).trim().length
        if (len < correctLen * 0.35) continue
        tryAdd(label, true)
      }
    }
  }

  return out.slice(0, 3)
}

/**
 * @param {object} question
 * @param {object[]} topicQuestions
 * @param {object[]} batchQuestions
 * @param {object[]} [subjectQuestions]
 */
export function buildSubjectEraIndex(subjectQuestions) {
  const eraIndex = new Map()
  for (const q of subjectQuestions) {
    const era = topicEraGroup(q.topicId)
    if (!eraIndex.has(era)) eraIndex.set(era, [])
    eraIndex.get(era).push(q)
  }
  return eraIndex
}

export function pickSmartWrongOptions(
  question,
  topicQuestions,
  batchQuestions,
  subjectQuestions = [],
  eraIndex = null,
) {
  const expectedKind = inferQuestionKind(question)
  const pools = buildPaddingPools(
    question,
    topicQuestions,
    batchQuestions,
    subjectQuestions,
    expectedKind,
    eraIndex,
  )
  const finish = (picked) =>
    fillToThreeWrong(question, picked, pools, expectedKind, topicQuestions)

  if (expectedKind === 'meaning') {
    const meaningPool = topicQuestions
      .filter((q) => q.id !== question.id)
      .map((q) => ({ label: String(q.answer).trim(), topicId: q.topicId }))
    const meaningPicked = pickBestDistractors(question, meaningPool, 3)
    return finish(
      filterDistinctDistractors(question, meaningPicked, { expectedKind }).slice(0, 3),
    )
  }

  const correctLen = String(question.answer).trim().length
  if (expectedKind === 'concept' || (expectedKind === 'definition' && correctLen > 42)) {
    const longPool = mergePools(...pools)
    const conceptPicked = pickBestDistractors(question, longPool, 3)
    if (conceptPicked.length > 0) {
      return finish(
        filterDistinctDistractors(question, conceptPicked, {
          expectedKind: 'concept',
        }).slice(0, 3),
      )
    }
  }

  let pool = mergePools(...pools)
  let picked = pickBestDistractors(question, pool, 3)
  return finish(
    filterDistinctDistractors(question, picked, { expectedKind }).slice(0, 3),
  )
}

export function inferExpectedType(question) {
  return inferQuestionKind(question)
}
