import { dirname, join } from 'node:path'
import { fileURLToPath } from 'node:url'
import { loadSiteUrl } from './load-site-url.mjs'

const distDir = join(dirname(fileURLToPath(import.meta.url)), '..', 'dist', 'spa')
const site = loadSiteUrl()

console.log(`
Metunic yükleme hazır.

1. Metunic panel → Hosting → Dosya Yöneticisi (veya FTP)
2. public_html klasörünü açın
3. Eski dosyaları silin (yedek alın)
4. Şu klasörün İÇİNDEKİLERİ yükleyin (klasörün kendisini değil):
   ${distDir}

5. Kontrol:
   - ${site}/
   - ${site}/ads.txt
   - ${site}/about

FTP bilgileri Metunic → Hosting → FTP Hesapları bölümündedir.
`)
