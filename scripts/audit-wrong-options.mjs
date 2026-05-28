/**
 * Yanlış şık kalitesini denetler — şüpheli örnekleri listeler.
 * node scripts/audit-wrong-options.mjs
 */
import { join, dirname } from 'path'
import { fileURLToPath } from 'url'
import { isTooSimilarAnswer } from '../src/utils/answerSimilarity.js'
import {
  inferQuestionKind,
  isValidDistractor,
  isLengthCompatible,
  commaCount,
} from '../src/utils/distractorQuality.js'

const root = dirname(fileURLToPath(import.meta.url))
const dataDir = join(root, '../src/assets/data')

const BATCHES = [
  ['questions-batch1.js', 'questionsBatch1'],
  ['questions-batch2.js', 'questionsBatch2'],
  ['questions-batch3.js', 'questionsBatch3'],
  ['questions-batch4.js', 'questionsBatch4'],
  ['questions-batch5.js', 'questionsBatch5'],
  ['questions-batch6.js', 'questionsBatch6'],
  ['questions-batch7.js', 'questionsBatch7'],
  ['questions-batch8.js', 'questionsBatch8'],
  ['questions-batch9.js', 'questionsBatch9'],
  ['questions-batch10.js', 'questionsBatch10'],
  ['questions-batch11.js', 'questionsBatch11'],
  ['questions-batch12.js', 'questionsBatch12'],
  ['questions-cografya-batch1.js', 'questionsCografyaBatch1'],
  ['questions-cografya-batch2.js', 'questionsCografyaBatch2'],
  ['questions-cografya-batch3.js', 'questionsCografyaBatch3'],
  ['questions-cografya-batch4.js', 'questionsCografyaBatch4'],
  ['questions-vatandaslik-batch1.js', 'questionsVatandaslikBatch1'],
  ['questions-vatandaslik-batch2.js', 'questionsVatandaslikBatch2'],
  ['questions-vatandaslik-batch3.js', 'questionsVatandaslikBatch3'],
  ['questions-vatandaslik-batch4.js', 'questionsVatandaslikBatch4'],
  ['questions-vatandaslik-batch5.js', 'questionsVatandaslikBatch5'],
  ['questions-vatandaslik-batch6.js', 'questionsVatandaslikBatch6'],
  ['questions-vatandaslik-batch7.js', 'questionsVatandaslikBatch7'],
]

function scoreQuality(question, wrongs) {
  const issues = []
  const correct = String(question.answer).trim()

  if (!wrongs || wrongs.length < 3) issues.push('eksik_şık')

  const kind = inferQuestionKind(question)
  for (const w of wrongs ?? []) {
    if (isTooSimilarAnswer(w, correct)) issues.push('doğruya_çok_yakın')
    if (!isValidDistractor(question, w)) issues.push('geçersiz_şık')
    if (kind !== 'meaning' && !isLengthCompatible(w, correct)) issues.push('uzunluk_uyumsuz')
    if (commaCount(w) >= 2 && commaCount(correct) < 2) issues.push('çoklu_liste')
  }
  return issues
}

const flagged = []
for (const [qFile, qExport] of BATCHES) {
  const qMod = await import(join(dataDir, qFile))
  const questions = qMod[qExport]
  for (const q of questions) {
    const wrongs = q.wrongOptions
    const issues = scoreQuality(q, wrongs)
    if (issues.length) {
      flagged.push({
        id: q.id,
        issues: [...new Set(issues)],
        wrongs,
        correct: q.answer,
        text: q.text.slice(0, 60),
      })
    }
  }
}

const byIssue = {}
for (const f of flagged) {
  for (const i of f.issues) byIssue[i] = (byIssue[i] ?? 0) + 1
}
console.log('Toplam şüpheli:', flagged.length)
console.log('Sorun türleri:', byIssue)
console.log('\nÖrnekler:')
for (const f of flagged.slice(0, 25)) {
  console.log(`\n${f.id} [${f.issues.join(', ')}]`)
  console.log('  S:', f.text)
  console.log('  D:', f.correct)
  console.log('  Y:', f.wrongs)
}
