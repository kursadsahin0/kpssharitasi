import { writeFileSync } from 'node:fs'
import { dirname, join } from 'node:path'
import { fileURLToPath } from 'node:url'
import { subjects } from '../src/assets/data/subjects.js'

const __dirname = dirname(fileURLToPath(import.meta.url))
const publicDir = join(__dirname, '..', 'public')

const rawBase =
  process.env.VITE_SITE_URL?.trim() || 'https://kpssharitasi.netlify.app'
const base = rawBase.replace(/\/$/, '')

function pageUrl(path = '/') {
  const normalized = path.startsWith('/') ? path : `/${path}`
  return `${base}${normalized === '/' ? '' : normalized}`
}

const staticPaths = [
  { path: '/', changefreq: 'weekly', priority: '1.0' },
  { path: '/about', changefreq: 'monthly', priority: '0.7' },
  { path: '/faq', changefreq: 'monthly', priority: '0.7' },
  { path: '/contact', changefreq: 'monthly', priority: '0.6' },
  { path: '/privacy-policy', changefreq: 'monthly', priority: '0.5' },
  { path: '/terms', changefreq: 'monthly', priority: '0.5' },
]

const guidePaths = subjects
  .filter((s) => s.available)
  .map((s) => ({
    path: `/rehber/${s.id}`,
    changefreq: 'monthly',
    priority: '0.8',
  }))

const lastmod = new Date().toISOString().slice(0, 10)

const urls = [...staticPaths, ...guidePaths]
  .map(
    ({ path, changefreq, priority }) => `  <url>
    <loc>${escapeXml(pageUrl(path))}</loc>
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

console.log(`[sitemap] ${staticPaths.length + guidePaths.length} URL → public/sitemap.xml (${base})`)

function escapeXml(s) {
  return s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')
}
