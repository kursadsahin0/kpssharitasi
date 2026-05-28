/**
 * Soru dosyalarına wrongOptions yazar (soru + şıklar aynı dosyada).
 *
 * npm run build:wrong-options
 */
import { readFileSync, writeFileSync } from 'fs'
import { fileURLToPath } from 'url'
import { dirname, join } from 'path'
import { buildSubjectEraIndex, pickSmartWrongOptions } from './smartWrongOptions.mjs'

const BATCHES = [
  { questions: 'questions-batch1.js', export: 'questionsBatch1' },
  { questions: 'questions-batch2.js', export: 'questionsBatch2' },
  { questions: 'questions-batch3.js', export: 'questionsBatch3' },
  { questions: 'questions-batch4.js', export: 'questionsBatch4' },
  { questions: 'questions-batch5.js', export: 'questionsBatch5' },
  { questions: 'questions-batch6.js', export: 'questionsBatch6' },
  { questions: 'questions-batch7.js', export: 'questionsBatch7' },
  { questions: 'questions-batch8.js', export: 'questionsBatch8' },
  { questions: 'questions-batch9.js', export: 'questionsBatch9' },
  { questions: 'questions-batch10.js', export: 'questionsBatch10' },
  { questions: 'questions-batch11.js', export: 'questionsBatch11' },
  { questions: 'questions-batch12.js', export: 'questionsBatch12' },
  { questions: 'questions-cografya-batch1.js', export: 'questionsCografyaBatch1' },
  { questions: 'questions-cografya-batch2.js', export: 'questionsCografyaBatch2' },
  { questions: 'questions-cografya-batch3.js', export: 'questionsCografyaBatch3' },
  { questions: 'questions-cografya-batch4.js', export: 'questionsCografyaBatch4' },
  { questions: 'questions-vatandaslik-batch1.js', export: 'questionsVatandaslikBatch1' },
  { questions: 'questions-vatandaslik-batch2.js', export: 'questionsVatandaslikBatch2' },
  { questions: 'questions-vatandaslik-batch3.js', export: 'questionsVatandaslikBatch3' },
  { questions: 'questions-vatandaslik-batch4.js', export: 'questionsVatandaslikBatch4' },
  { questions: 'questions-vatandaslik-batch5.js', export: 'questionsVatandaslikBatch5' },
  { questions: 'questions-vatandaslik-batch6.js', export: 'questionsVatandaslikBatch6' },
  { questions: 'questions-vatandaslik-batch7.js', export: 'questionsVatandaslikBatch7' },
]

const ANSWER_RE =
  /answer:\s*(?:'(?:[^'\\]|\\.)*'|"(?:[^"\\]|\\.)*")/

function setWrongOptionsInFile(content, questionId, wrongs) {
  if (!wrongs?.length) return content

  const opts = JSON.stringify(wrongs)
  const marker = `id: '${questionId}'`
  const start = content.indexOf(marker)
  if (start === -1) return content

  const windowEnd = Math.min(content.length, start + 4000)
  const chunk = content.slice(start, windowEnd)
  const answerMatch = chunk.match(ANSWER_RE)
  if (!answerMatch) return content

  const answerStart = start + answerMatch.index
  const answerEnd = answerStart + answerMatch[0].length

  let rest = content.slice(answerEnd)
  while (/^\s*,?\s*(?:\n\s*)?wrongOptions:\s*\[[^\]]*\],?/.test(rest)) {
    rest = rest.replace(/^\s*,?\s*(?:\n\s*)?wrongOptions:\s*\[[^\]]*\],?/, '')
  }
  const insert = /^\s*,\s*\}/.test(rest)
    ? `, wrongOptions: ${opts}`
    : `,\n    wrongOptions: ${opts},`
  return content.slice(0, answerEnd) + insert + rest
}

const root = dirname(fileURLToPath(import.meta.url))
const dataDir = join(root, '../src/assets/data')

function subjectPoolKey(file) {
  if (file.includes('cografya')) return 'cografya'
  if (file.includes('vatandaslik')) return 'vatandaslik'
  return 'tarih'
}

const subjectPools = { tarih: [], cografya: [], vatandaslik: [] }
const eraIndexes = {}
for (const batch of BATCHES) {
  const qPath = join(dataDir, batch.questions)
  const mod = await import(qPath + `?preload=${Date.now()}`)
  subjectPools[subjectPoolKey(batch.questions)].push(...mod[batch.export])
}
for (const key of Object.keys(subjectPools)) {
  eraIndexes[key] = buildSubjectEraIndex(subjectPools[key])
}

let total = 0
let weak = 0

for (const batch of BATCHES) {
  const qPath = join(dataDir, batch.questions)
  const mod = await import(qPath + `?t=${Date.now()}`)
  const questions = mod[batch.export]
  const byTopic = new Map()
  for (const q of questions) {
    if (!byTopic.has(q.topicId)) byTopic.set(q.topicId, [])
    byTopic.get(q.topicId).push(q)
  }

  let content = readFileSync(qPath, 'utf8')
  for (const q of questions) {
    const topicQs = byTopic.get(q.topicId) ?? []
    const sk = subjectPoolKey(batch.questions)
    const wrong = pickSmartWrongOptions(
      q,
      topicQs,
      questions,
      subjectPools[sk],
      eraIndexes[sk],
    )
    content = setWrongOptionsInFile(content, q.id, wrong)
    total += 1
    if (wrong.length !== 3) weak += 1
  }
  let prev
  do {
    prev = content
    content = content.replace(
      /(\n\s*wrongOptions:\s*\[[^\]]*\],?)\s*\n\s*wrongOptions:\s*(\[[^\]]*\],?)/g,
      '\n    wrongOptions: $2',
    )
  } while (content !== prev)
  content = content.replace(/(answer:[^\n]+)\n(\s*wrongOptions:)/g, '$1,\n$2')
  content = content.replace(/,,+/g, ',')
  content = content.replace(
    /wrongOptions: (\[[^\]]+\]),\s*,\s*(\})/g,
    'wrongOptions: $1, $2',
  )
  writeFileSync(qPath, content, 'utf8')
  console.log(`${batch.questions}: ${questions.length} soru`)
}

console.log(`Done: ${total} soru, ${weak} eksik şıklı`)
