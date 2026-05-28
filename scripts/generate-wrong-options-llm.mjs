#!/usr/bin/env node

/**
 * AI-powered Wrong Options Generator using Gemini API.
 * 
 * Usage:
 *   export GEMINI_API_KEY="your_api_key"
 *   node scripts/generate-wrong-options-llm.mjs [--all] [--limit 50] [--batch questions-batch1.js]
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

const root = dirname(fileURLToPath(import.meta.url))
const dataDir = join(root, '../src/assets/data')

// Parse CLI Arguments
const args = process.argv.slice(2)
const forceAll = args.includes('--all')
const limitArgIdx = args.indexOf('--limit')
const limit = limitArgIdx !== -1 ? parseInt(args[limitArgIdx + 1], 10) : Infinity
const batchArgIdx = args.indexOf('--batch')
const batchFilter = batchArgIdx !== -1 ? args[batchArgIdx + 1] : null

// Get API Key
let apiKey = process.env.GEMINI_API_KEY
if (!apiKey) {
  console.error('Error: GEMINI_API_KEY environment variable is not set.')
  console.error('Please set it using: export GEMINI_API_KEY="your_api_key"')
  process.exit(1)
}

// Function to call Gemini API in batches
async function generateWrongOptionsBatchWithGemini(questionsBatch, retries = 3) {
  const prompt = `You are an expert exam designer for the KPSS (Turkish Public Personnel Selection Examination).
Your task is to generate exactly 3 plausible but incorrect options (distractors) in Turkish for each of the given multiple-choice questions.

Here is the list of questions:
${questionsBatch.map((q, idx) => `${idx + 1}. ID: "${q.id}"
   Question: "${q.text}"
   Correct Answer: "${q.answer}"`).join('\n\n')}

Rules for distractors (MUST follow strictly for EVERY question):
1. Must be highly plausible and directly related to the question's specific context and domain. 
   - E.g. If the question asks about "social rules" (sosyal kurallar), the distractors MUST be other types of rules or concepts related to social order/norms, NOT unrelated constitutional law or history terms.
   - E.g. If the question asks about a founder of an Egyptian Turkish state, the distractors MUST be other relevant rulers or states, NOT early Central Asian characters.
2. Must not be true or partially true.
3. Must match the grammatical structure, length, style, and tone of the correct answer.
4. If the correct answer is a short phrase, a person, a year, a state, a place, or a list, the distractors must be of the exact same kind and length/style.
5. Do not include the correct answer or variations of it in the distractors.
6. The output must be a JSON object mapping each question's ID to an array of exactly 3 strings (distractors). Example format:
{
  "q_id_1": ["distractor1", "distractor2", "distractor3"],
  "q_id_2": ["distractor1", "distractor2", "distractor3"]
}`

  const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${apiKey}`

  for (let attempt = 1; attempt <= retries; attempt++) {
    try {
      const response = await fetch(url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          contents: [{ parts: [{ text: prompt }] }],
          generationConfig: {
            responseMimeType: 'application/json'
          }
        })
      })

      if (response.status === 429) {
        const delay = attempt * 10000
        console.warn(`Rate limited (429). Retrying in ${delay / 1000}s (Attempt ${attempt}/${retries})...`)
        await new Promise((resolve) => setTimeout(resolve, delay))
        continue
      }

      if (!response.ok) {
        throw new Error(`Gemini API error: ${response.status} ${response.statusText}`)
      }

      const data = await response.json()
      const text = data.candidates?.[0]?.content?.parts?.[0]?.text
      if (!text) {
        throw new Error('Empty response from Gemini API')
      }

      const parsed = JSON.parse(text)
      // Validate that it's an object with the expected IDs
      const result = {}
      for (const q of questionsBatch) {
        if (Array.isArray(parsed[q.id]) && parsed[q.id].length === 3) {
          result[q.id] = parsed[q.id].map(opt => String(opt).trim())
        } else {
          console.warn(`Warning: Missing or invalid distractors for question ID: ${q.id} in response.`)
        }
      }
      return result
    } catch (error) {
      if (attempt === retries) {
        throw error
      }
      console.warn(`Attempt ${attempt} failed: ${error.message}. Retrying...`)
      await new Promise((resolve) => setTimeout(resolve, 5000))
    }
  }
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

async function main() {
  let processedCount = 0
  const CHUNK_SIZE = 10 // Process 10 questions at a time

  for (const batch of BATCHES) {
    if (batchFilter && batch.questions !== batchFilter) {
      continue
    }

    const qPath = join(dataDir, batch.questions)
    console.log(`\nProcessing ${batch.questions}...`)
    
    let mod
    try {
      mod = await import(qPath + `?t=${Date.now()}`)
    } catch (e) {
      console.error(`Failed to load ${batch.questions}:`, e.message)
      continue
    }
    
    const questions = mod[batch.export]
    let content = readFileSync(qPath, 'utf8')
    let fileChanged = false

    // Filter questions that need wrong options
    const targets = []
    for (const q of questions) {
      const hasThreeWrongs = Array.isArray(q.wrongOptions) && q.wrongOptions.filter(Boolean).length === 3
      if (!hasThreeWrongs || forceAll) {
        targets.push(q)
      }
    }

    console.log(`Found ${targets.length} questions to process in this batch.`)

    // Process targets in chunks
    for (let i = 0; i < targets.length; i += CHUNK_SIZE) {
      if (processedCount >= limit) {
        break
      }

      const chunk = targets.slice(i, i + CHUNK_SIZE)
      console.log(`Generating options for batch of ${chunk.length} questions (IDs: ${chunk.map(q => q.id).join(', ')})...`)

      try {
        const batchResults = await generateWrongOptionsBatchWithGemini(chunk)
        let chunkUpdated = false

        for (const q of chunk) {
          if (batchResults[q.id]) {
            content = setWrongOptionsInFile(content, q.id, batchResults[q.id])
            chunkUpdated = true
            fileChanged = true
            processedCount++
            console.log(`  -> [${q.id}]: ${JSON.stringify(batchResults[q.id])}`)
          }
        }

        if (chunkUpdated) {
          cleanAndSaveContent(qPath, content)
          // Re-read content to make sure consecutive updates in same run are based on latest file state
          content = readFileSync(qPath, 'utf8')
        }

        // Delay between chunks to respect RPM limits
        // 10 questions per call. 15 RPM limit -> ~4 seconds per call is safe, let's use 6 seconds to be robust.
        if (i + CHUNK_SIZE < targets.length && processedCount < limit) {
          await new Promise((resolve) => setTimeout(resolve, 6000))
        }
      } catch (error) {
        console.error(`  x Failed to generate batch starting at index ${i}: ${error.message}`)
      }
    }

    if (processedCount >= limit) {
      break
    }
  }

  console.log(`\nFinished. Total questions processed: ${processedCount}`)
}

main().catch(console.error)
