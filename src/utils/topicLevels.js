/** Bir harita level'ında en fazla kaç soru olsun */
export const MAX_QUESTIONS_PER_LEVEL = 20

function sortQuestions(questions) {
  return [...questions].sort((a, b) => {
    const na = Number.parseInt(String(a.id).replace(/\D/g, ''), 10) || 0
    const nb = Number.parseInt(String(b.id).replace(/\D/g, ''), 10) || 0
    if (na !== nb) return na - nb
    return String(a.id).localeCompare(String(b.id), 'tr')
  })
}

/** Level topic kaydından o bölüme düşen soruları döndürür */
export function getQuestionsForLevel(allQuestions, topic) {
  if (!topic) return []
  const sourceId = topic.sourceTopicId ?? topic.id
  const sorted = sortQuestions(allQuestions.filter((q) => q.topicId === sourceId))
  const parts = topic.levelCount ?? 1
  if (parts <= 1) return sorted
  const start = ((topic.levelPart ?? 1) - 1) * MAX_QUESTIONS_PER_LEVEL
  return sorted.slice(start, start + MAX_QUESTIONS_PER_LEVEL)
}

import { assignMapPositions } from './mapLayout.js'

/**
 * Soru sayısı MAX_QUESTIONS_PER_LEVEL'ı aşan konuları birden fazla harita level'ına böler.
 */
export function expandTopicsWithLevels(topicDefs, questions) {
  const bySubject = topicDefs.reduce((acc, t) => {
    if (!acc[t.subjectId]) acc[t.subjectId] = []
    acc[t.subjectId].push(t)
    return acc
  }, {})

  const expanded = []

  for (const subjectId of Object.keys(bySubject)) {
    const defs = [...bySubject[subjectId]].sort((a, b) => a.order - b.order)
    const subjectTopics = []
    let order = 1

    for (const def of defs) {
      const count = questions.filter((q) => q.topicId === def.id).length
      const levelCount = count > 0 ? Math.max(1, Math.ceil(count / MAX_QUESTIONS_PER_LEVEL)) : 1

      if (levelCount === 1) {
        subjectTopics.push({
          ...def,
          order,
          sourceTopicId: def.id,
          levelPart: 1,
          levelCount: 1,
        })
        order += 1
      } else {
        for (let p = 1; p <= levelCount; p += 1) {
          subjectTopics.push({
            ...def,
            id: `${def.id}--${p}`,
            order,
            sourceTopicId: def.id,
            levelPart: p,
            levelCount,
            title: `${def.title} (${p}/${levelCount})`,
          })
          order += 1
        }
      }
    }

    const { positions } = assignMapPositions(subjectTopics)
    for (const t of subjectTopics) {
      expanded.push({
        ...t,
        mapPosition: positions[t.id],
      })
    }
  }

  return expanded
}
