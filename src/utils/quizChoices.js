import { normalizeAnswer, isTooSimilarAnswer } from 'src/utils/answerSimilarity'

const CHOICE_KEYS = ['A', 'B', 'C', 'D']
const WRONG_COUNT = 3

function shuffle(items) {
  const arr = [...items]
  for (let i = arr.length - 1; i > 0; i -= 1) {
    const j = Math.floor(Math.random() * (i + 1))
    ;[arr[i], arr[j]] = [arr[j], arr[i]]
  }
  return arr
}

/**
 * Yanlış şıklar soru kaydında wrongOptions dizisinde tanımlıdır.
 * Doğru + 3 yanlış (A–D); sıra her gösterimde karışır.
 */
export function buildChoicesForQuestion(question) {
  const correctLabel = String(question.answer).trim()
  const correctNorm = normalizeAnswer(correctLabel)

  const configured = (Array.isArray(question.wrongOptions) ? question.wrongOptions : [])
    .map((label) => String(label).trim())
    .filter(Boolean)

  const wrongLabels = []
  for (const label of configured) {
    if (wrongLabels.length >= WRONG_COUNT) break
    if (isTooSimilarAnswer(label, correctLabel)) continue
    if (wrongLabels.some((x) => isTooSimilarAnswer(x, label))) continue
    wrongLabels.push(label)
  }

  if (wrongLabels.length < WRONG_COUNT) {
    console.warn(
      `[quiz] ${question.id}: 4 şık için en az 3 yanlış gerekli (${wrongLabels.length}/${WRONG_COUNT}). wrongOptions dizisine ekleyin.`,
    )
  }

  const choiceItems = shuffle([
    { label: correctLabel, correct: true },
    ...wrongLabels.map((label) => ({ label, correct: false })),
  ])

  const choices = choiceItems.map((item, i) => ({
    key: CHOICE_KEYS[i],
    label: item.label,
  }))

  const correctKey =
    choices.find((c) => normalizeAnswer(c.label) === correctNorm)?.key ?? 'A'

  return { choices, correctKey }
}

export function enrichQuestionsWithChoices(deckQuestions) {
  return deckQuestions.map((q) => ({
    ...q,
    ...buildChoicesForQuestion(q),
  }))
}
