/**
 * Build sonrası statik ön-render (tarayıcı gerektirmez).
 *
 * SPA'da ham HTML boş bir <div id="q-app"> içerir. Google AdSense / arama tarayıcıları
 * içeriği JS çalıştırmadan da görebilsin diye, indekslenebilir her sayfa için
 * dist/spa/<yol>.html dosyası üretir: sayfaya özel <title>, description, canonical,
 * Open Graph etiketleri ve gerçek metin içeriği. Vue uygulaması yüklenince bu içerik
 * normal arayüzle değiştirilir.
 *
 * Cloudflare (assets, html_handling=auto-trailing-slash) /about isteğine about.html'i,
 * Apache ise .htaccess kuralıyla aynı dosyayı sunar.
 */
import { existsSync, mkdirSync, readFileSync, writeFileSync } from 'node:fs'
import { dirname, join } from 'node:path'
import { fileURLToPath } from 'node:url'
import { faqItems } from '../src/assets/data/faq.js'
import { kpssHomeGuide, subjectGuides } from '../src/assets/data/subjectGuides.js'
import { subjects } from '../src/assets/data/subjects.js'
import { PAGE_SEO, SITE_NAME, buildDocumentTitle } from '../src/config/seo.js'
import { loadSiteUrl } from './load-site-url.mjs'

const root = join(dirname(fileURLToPath(import.meta.url)), '..')
const distDir = join(root, 'dist', 'spa')
const templatePath = join(distDir, 'index.html')

if (!existsSync(templatePath)) {
  console.warn('[prerender] dist/spa/index.html yok, atlandı')
  process.exit(0)
}

const base = loadSiteUrl()
const template = readFileSync(templatePath, 'utf8')

const esc = (s) =>
  String(s)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')

const pageUrl = (path) => `${base}${path === '/' ? '' : path}`

/** topics.js alias'lı import içerdiği için konu tanımlarını metinden okuyoruz. */
function readTopicDefs() {
  const src = readFileSync(join(root, 'src/assets/data/topics.js'), 'utf8')
  const re =
    /\{\s*id:\s*'([^']+)',\s*subjectId:\s*'([^']+)',\s*unitTitle:\s*'([^']+)',\s*order:\s*(\d+),\s*title:\s*'([^']+)'/g
  const out = []
  let m
  while ((m = re.exec(src))) {
    out.push({ id: m[1], subjectId: m[2], unitTitle: m[3], order: Number(m[4]), title: m[5] })
  }
  return out
}
const topicDefs = readTopicDefs()

const availableSubjects = subjects.filter((s) => s.available && subjectGuides[s.id])

const navHtml = `<nav aria-label="Site gezinmesi"><p>
<a href="/">Ana sayfa</a> · <a href="/nasil-calisilir">Nasıl çalışılır</a> ·
${availableSubjects.map((s) => `<a href="/rehber/${s.id}">${esc(s.title)} rehberi</a>`).join(' · ')} ·
<a href="/faq">SSS</a> · <a href="/about">Hakkında</a> · <a href="/contact">İletişim</a> ·
<a href="/privacy-policy">Gizlilik Politikası</a> · <a href="/terms">Kullanım Koşulları</a>
</p></nav>`

const sectionsHtml = (sections) =>
  sections.map((s) => `<h2>${esc(s.heading)}</h2>\n<p>${esc(s.body)}</p>`).join('\n')

function guideBody(subjectId) {
  const guide = subjectGuides[subjectId]
  const subject = subjects.find((s) => s.id === subjectId)
  const units = new Map()
  for (const t of topicDefs.filter((t) => t.subjectId === subjectId)) {
    if (!units.has(t.unitTitle)) units.set(t.unitTitle, [])
    units.get(t.unitTitle).push(t)
  }
  const unitHtml = [...units.entries()]
    .map(
      ([title, list]) =>
        `<h3>${esc(title)}</h3>\n<ul>${list
          .sort((a, b) => a.order - b.order)
          .map((t) => `<li>${esc(t.title)}</li>`)
          .join('')}</ul>`,
    )
    .join('\n')
  return `<p>Çalışma rehberi</p>
<h1>${esc(guide.title)}</h1>
<p>${esc(guide.intro)}</p>
${sectionsHtml(guide.sections)}
${units.size ? `<h2>Konu listesi</h2>\n<p>KPSS Haritası’ndaki ${esc(subject?.title ?? '')} konu haritası aşağıdaki ünite ve konulardan oluşur.</p>\n${unitHtml}` : ''}
<p><a href="/ders/${subjectId}">Konu haritasına git</a></p>`
}

function homeBody() {
  return `<h1>KPSS Genel Kültür Çalış</h1>
<p>Konu haritasında ilerle, soruları çöz, yıldız kazan. Ücretsiz KPSS Genel Kültür pratiği.</p>
<h2>KPSS Genel Kültür dersleri</h2>
<p>Tarih, Coğrafya ve Vatandaşlık derslerinde konu haritası ile sırayla ilerleyin. Her konuda çoktan seçmeli sorular çözün, yıldız kazanın ve zayıf alanlarınızı tekrar edin.</p>
<ul>${availableSubjects
    .map(
      (s) =>
        `<li><a href="/ders/${s.id}">${esc(s.title)} konu haritası</a> — <a href="/rehber/${s.id}">${esc(s.title)} çalışma rehberi</a>: ${esc(subjectGuides[s.id].intro)}</li>`,
    )
    .join('')}</ul>
${kpssHomeGuide.paragraphs.map((p) => `<p>${esc(p)}</p>`).join('\n')}
<p><a href="/nasil-calisilir">KPSS nasıl çalışılır?</a></p>`
}

function studyGuideBody() {
  return `<h1>${esc(kpssHomeGuide.title)}</h1>
${kpssHomeGuide.paragraphs.map((p) => `<p>${esc(p)}</p>`).join('\n')}
${sectionsHtml(kpssHomeGuide.sections ?? [])}`
}

function faqBody() {
  return `<h1>Sık Sorulan Sorular</h1>
${faqItems.map((f) => `<h2>${esc(f.q)}</h2>\n<p>${esc(f.a)}</p>`).join('\n')}`
}

const simpleBody = (name) => `<h1>${esc(PAGE_SEO[name].title)}</h1>\n<p>${esc(PAGE_SEO[name].description)}</p>`

const pages = [
  { path: '/', name: 'home', body: homeBody() },
  { path: '/nasil-calisilir', name: 'study-guide', body: studyGuideBody() },
  { path: '/faq', name: 'faq', body: faqBody() },
  { path: '/about', name: 'about', body: simpleBody('about') },
  { path: '/contact', name: 'contact', body: simpleBody('contact') },
  { path: '/privacy-policy', name: 'privacy-policy', body: simpleBody('privacy-policy') },
  { path: '/terms', name: 'terms', body: simpleBody('terms') },
  ...availableSubjects.map((s) => {
    const g = subjectGuides[s.id]
    return {
      path: `/rehber/${s.id}`,
      seo: {
        title: g.title,
        description: g.intro.length > 160 ? `${g.intro.slice(0, 157)}...` : g.intro,
      },
      body: guideBody(s.id),
    }
  }),
]

function setMeta(html, attr, key, content) {
  const re = new RegExp(`<meta ${attr}=${key.replace(/[:]/g, '\\:')} content=("[^"]*"|[^\\s>]+)>`)
  // data-seo: src/boot/seo-meta.js aynı etiketi güncellesin, kopya oluşturmasın
  const tag = `<meta ${attr}="${key}" content="${esc(content)}" data-seo="true">`
  return re.test(html) ? html.replace(re, tag) : html.replace('</head>', `${tag}</head>`)
}

function render({ path, name, seo, body }) {
  const { title, description } = seo ?? PAGE_SEO[name]
  const docTitle = buildDocumentTitle(title)
  const canonical = pageUrl(path)
  let html = template
  html = html.replace(/<title>[^<]*<\/title>/, `<title>${esc(docTitle)}</title>`)
  html = setMeta(html, 'name', 'description', description)
  html = setMeta(html, 'property', 'og:title', docTitle)
  html = setMeta(html, 'property', 'og:description', description)
  html = setMeta(html, 'property', 'og:image', pageUrl('/og-image.svg'))
  html = setMeta(html, 'name', 'twitter:title', docTitle)
  html = setMeta(html, 'name', 'twitter:description', description)
  html = setMeta(html, 'name', 'twitter:image', pageUrl('/og-image.svg'))
  html = html.replace(
    '</head>',
    `<link rel="canonical" href="${esc(canonical)}" data-seo="true"><meta property="og:url" content="${esc(canonical)}" data-seo="true"></head>`,
  )

  const content = `<div class="kpss-prerender" style="max-width:720px;margin:0 auto;padding:24px 16px;color:#f5f3f8;background:#12101a;font-family:system-ui,sans-serif;line-height:1.65">
<header><p><a href="/">${esc(SITE_NAME)}</a></p></header>
<main>
${body}
</main>
<footer>${navHtml}<p>© ${new Date().getFullYear()} ${esc(SITE_NAME)}</p></footer>
</div>`

  const appRe = /<div id=("q-app"|q-app)><\/div>/
  if (!appRe.test(html)) throw new Error('#q-app bulunamadı')
  return html.replace(appRe, `<div id="q-app">${content}</div>`)
}

for (const page of pages) {
  const html = render(page)
  const file = page.path === '/' ? join(distDir, 'index.html') : join(distDir, `${page.path.slice(1)}.html`)
  mkdirSync(dirname(file), { recursive: true })
  writeFileSync(file, html, 'utf8')
}

console.log(`[prerender] ${pages.length} sayfa statik HTML olarak yazıldı`)
