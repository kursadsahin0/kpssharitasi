#!/usr/bin/env node

/**
 * ChatGPT (OpenAI API) ile soru soru yanlış şık üretir ve batch dosyalarına yazar.
 *
 * Kullanım:
 *   export OPENAI_API_KEY="sk-..."
 *   node scripts/generate-wrong-options-chatgpt.mjs
 *   node scripts/generate-wrong-options-chatgpt.mjs --all
 *   node scripts/generate-wrong-options-chatgpt.mjs --limit 20
 *   node scripts/generate-wrong-options-chatgpt.mjs --batch questions-batch1.js
 *   node scripts/generate-wrong-options-chatgpt.mjs --model gpt-4o-mini
 */

import { readFileSync, writeFileSync } from 'fs'
import { fileURLToPath } from 'url'
import { dirname, join } from 'path'

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

const ANSWER_RE = /answer:\s*(?:'(?:[^'\\]|\\.)*'|"(?:[^"\\]|\\.)*")/

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

function cleanAndSaveContent(qPath, content) {
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
}

const root = dirname(fileURLToPath(import.meta.url))
const dataDir = join(root, '../src/assets/data')

const args = process.argv.slice(2)
const forceAll = args.includes('--all')
const limitArgIdx = args.indexOf('--limit')
const limit = limitArgIdx !== -1 ? parseInt(args[limitArgIdx + 1], 10) : Infinity
const batchArgIdx = args.indexOf('--batch')
const batchFilter = batchArgIdx !== -1 ? args[batchArgIdx + 1] : null
const modelArgIdx = args.indexOf('--model')
const model = modelArgIdx !== -1 ? args[modelArgIdx + 1] : 'gpt-4o-mini'
const delayArgIdx = args.indexOf('--delay')
const delayMs = delayArgIdx !== -1 ? parseInt(args[delayArgIdx + 1], 10) : 1200

const apiKey = process.env.OPENAI_API_KEY
if (!apiKey) {
  console.error('OPENAI_API_KEY tanımlı değil.')
  console.error('https://platform.openai.com/api-keys adresinden anahtar alın, sonra:')
  console.error('  export OPENAI_API_KEY="sk-..."')
  process.exit(1)
}

function buildPrompt(q) {
  return `KPSS çoktan seçmeli soru için tam 3 yanlış şık üret.

Soru: ${q.text}
Doğru cevap: ${q.answer}

Kurallar:
- Türkçe, sorunun konusu ve bağlamıyla doğrudan ilgili 3 çeldirici
- Doğru cevap doğru, kısmen doğru veya eş anlamlı olmasın
- Doğru cevapla aynı türde (kişi/yer/yıl/kavram); benzer uzunluk ve üslup
- Sadece JSON dizisi döndür: ["şık1","şık2","şık3"]`
}

async function generateWrongOptionsForOne(question, retries = 3) {
  for (let attempt = 1; attempt <= retries; attempt++) {
    try {
      const response = await fetch('https://api.openai.com/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${apiKey}`,
        },
        body: JSON.stringify({
          model,
          temperature: 0.7,
          response_format: { type: 'json_object' },
          messages: [
            {
              role: 'system',
              content:
                'Sen KPSS sınavı için çeldirici şık uzmanısın. Yanıtı her zaman {"options":["...","...","..."]} JSON formatında ver.',
            },
            { role: 'user', content: buildPrompt(question) },
          ],
        }),
      })

      if (response.status === 429) {
        const wait = attempt * 15000
        console.warn(`  Rate limit, ${wait / 1000}s bekleniyor...`)
        await new Promise((r) => setTimeout(r, wait))
        continue
      }

      if (!response.ok) {
        const errText = await response.text()
        throw new Error(`OpenAI ${response.status}: ${errText.slice(0, 300)}`)
      }

      const data = await response.json()
      const text = data.choices?.[0]?.message?.content
      if (!text) throw new Error('Boş yanıt')

      const parsed = JSON.parse(text)
      const options = parsed.options ?? parsed.wrongOptions ?? parsed
      const list = Array.isArray(options) ? options : Object.values(options)[0]
      if (!Array.isArray(list) || list.length !== 3) {
        throw new Error(`3 şık bekleniyordu, gelen: ${text}`)
      }

      const wrongs = list.map((o) => String(o).trim()).filter(Boolean)
      if (wrongs.length !== 3) throw new Error('Geçersiz şık sayısı')
      const answerNorm = question.answer.trim().toLowerCase()
      if (wrongs.some((w) => w.toLowerCase() === answerNorm)) {
        throw new Error('Çeldirici doğru cevabı içeriyor')
      }
      return wrongs
    } catch (err) {
      if (attempt === retries) throw err
      console.warn(`  Deneme ${attempt} başarısız: ${err.message}`)
      await new Promise((r) => setTimeout(r, 4000))
    }
  }
}

async function main() {
  let processedCount = 0

  console.log(`Model: ${model} | Soru başına tek istek | Gecikme: ${delayMs}ms`)

  for (const batch of BATCHES) {
    if (batchFilter && batch.questions !== batchFilter) continue

    const qPath = join(dataDir, batch.questions)
    console.log(`\n${batch.questions}`)

    let mod
    try {
      mod = await import(qPath + `?t=${Date.now()}`)
    } catch (e) {
      console.error(`  Yüklenemedi: ${e.message}`)
      continue
    }

    const questions = mod[batch.export]
    let content = readFileSync(qPath, 'utf8')

    const targets = questions.filter((q) => {
      const n = Array.isArray(q.wrongOptions) ? q.wrongOptions.filter(Boolean).length : 0
      return forceAll || n < 3
    })

    console.log(`  İşlenecek: ${targets.length} soru`)

    for (const q of targets) {
      if (processedCount >= limit) break

      process.stdout.write(`  [${q.id}] `)
      try {
        const wrongs = await generateWrongOptionsForOne(q)
        content = setWrongOptionsInFile(content, q.id, wrongs)
        cleanAndSaveContent(qPath, content)
        content = readFileSync(qPath, 'utf8')
        processedCount++
        console.log(JSON.stringify(wrongs))
      } catch (err) {
        console.log(`HATA: ${err.message}`)
      }

      if (processedCount < limit && delayMs > 0) {
        await new Promise((r) => setTimeout(r, delayMs))
      }
    }

    if (processedCount >= limit) break
  }

  console.log(`\nBitti. İşlenen soru: ${processedCount}`)
}

main().catch((e) => {
  console.error(e)
  process.exit(1)
})
