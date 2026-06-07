import { copyFileSync, existsSync, mkdirSync, writeFileSync } from 'node:fs'
import { dirname, join } from 'node:path'
import { fileURLToPath } from 'node:url'

const __dirname = dirname(fileURLToPath(import.meta.url))
const root = join(__dirname, '..')
const publicDir = join(root, 'public')
const distDir = join(root, 'dist', 'spa')

const ADS_TXT = 'google.com, pub-3498040280017092, DIRECT, f08c47fec0942fa0\n'

mkdirSync(distDir, { recursive: true })

writeFileSync(join(publicDir, 'ads.txt'), ADS_TXT, 'utf8')
writeFileSync(join(distDir, 'ads.txt'), ADS_TXT, 'utf8')

for (const name of ['robots.txt', 'sitemap.xml', '_redirects']) {
  const src = join(publicDir, name)
  if (existsSync(src)) {
    copyFileSync(src, join(distDir, name))
  }
}

console.log('[static] ads.txt, robots.txt, sitemap.xml, _redirects → dist/spa')
