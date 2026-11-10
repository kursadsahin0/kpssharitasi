// Göreli importlar: scripts/generate-sitemap.mjs ve scripts/prerender-static.mjs Node'da da okur.
import { tarihNotes } from './tarih.js'
import { cografyaNotes } from './cografya.js'
import { vatandaslikNotes } from './vatandaslik.js'

/**
 * Ünite konu anlatımları.
 * { slug, subjectId, title, description, units: [topics.js unitTitle], intro,
 *   sections: [{ heading, paragraphs: [] }], keyPoints: [] }
 */
export const notes = [...tarihNotes, ...cografyaNotes, ...vatandaslikNotes]

export const notesBySubject = (subjectId) => notes.filter((n) => n.subjectId === subjectId)

export const findNote = (subjectId, slug) =>
  notes.find((n) => n.subjectId === subjectId && n.slug === slug) ?? null

export const noteForUnit = (subjectId, unitTitle) =>
  notes.find((n) => n.subjectId === subjectId && n.units.includes(unitTitle)) ?? null

export const notePath = (note) => `/konu-anlatimi/${note.subjectId}/${note.slug}`

export const noteWordCount = (note) =>
  [note.intro, ...note.sections.flatMap((s) => s.paragraphs), ...note.keyPoints]
    .join(' ')
    .split(/\s+/)
    .filter(Boolean).length
