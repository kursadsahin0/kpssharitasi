import { writeFileSync } from 'node:fs'
import { dirname, join } from 'node:path'
import { fileURLToPath } from 'node:url'
import { subjects } from '../src/assets/data/subjects.js'

const __dirname = dirname(fileURLToPath(import.meta.url))
const publicDir = join(__dirname, '..', 'public')

const rawBase = process.env.VITE_SITE_URL?.trim() || ''
const base = rawBase.replace(/\/$/, '')

if (!base) {
  console.warn(
    '[sitemap] VITE_SITE_URL tanımlı değil. Netlify’de örn. https://siteniz.netlify.app ekleyin.',
  )
  process.exit(1)
}

/** Hash router: Google için tam URL (# dahil) */
function hashUrl(path = '') {
  const fragment = path ? `#${path.startsWith('/') ? path : `/${path}`}` : '#/'
  return `${base}/${fragment}`
}

const staticPaths = [
  { path: '', changefreq: 'weekly', priority: '1.0' },
  { path: '/about', changefreq: 'monthly', priority: '0.6' },
  { path: '/contact', changefreq: 'monthly', priority: '0.6' },
  { path: '/privacy-policy', changefreq: 'monthly', priority: '0.5' },
  { path: '/terms', changefreq: 'monthly', priority: '0.5' },
]

const subjectPaths = subjects
  .filter((s) => s.available)
  .map((s) => ({
    path: `/ders/${s.id}`,
    changefreq: 'weekly',
    priority: '0.8',
  }))

const lastmod = new Date().toISOString().slice(0, 10)

const urls = [...staticPaths, ...subjectPaths]
  .map(
    ({ path, changefreq, priority }) => `  <url>
    <loc>${escapeXml(hashUrl(path))}</loc>
    <lastmod>${lastmod}</lastmod>
    <changefreq>${changefreq}</changefreq>
    <priority>${priority}</priority>
  </url>`,
  )
  .join('\n')

const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls}
</urlset>
`

const robots = `User-agent: *
Allow: /

Sitemap: ${base}/sitemap.xml
`

writeFileSync(join(publicDir, 'sitemap.xml'), sitemap, 'utf8')
writeFileSync(join(publicDir, 'robots.txt'), robots, 'utf8')

console.log(`[sitemap] ${staticPaths.length + subjectPaths.length} URL → public/sitemap.xml (${base})`)

function escapeXml(s) {
  return s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')
}
