import { faqItems } from 'src/assets/data/faq'
import { kpssHomeGuide, subjectGuides } from 'src/assets/data/subjectGuides'

export const SITE_NAME = 'KPSS Haritası'
export const DEFAULT_DESCRIPTION =
  'KPSS Genel Kültür hazırlık uygulaması: konu haritası, soru çözümü ve ilerleme takibi.'
export const SITE_LOCALE = 'tr_TR'
export const OG_IMAGE_PATH = '/og-image.svg'

const PAGE_SEO = {
  home: {
    title: 'KPSS Genel Kültür Çalış',
    description:
      'Ücretsiz KPSS Genel Kültür hazırlık: Tarih, Coğrafya ve Vatandaşlık konu haritası, soru çözümü ve yıldız ile ilerleme takibi.',
  },
  'study-guide': {
    title: 'KPSS Nasıl Çalışılır',
    description:
      'KPSS Genel Kültür için etkili çalışma planı, konu haritası kullanımı ve düzenli tekrar önerileri.',
  },
  about: {
    title: 'Hakkında',
    description:
      'KPSS Haritası nedir? Ücretsiz KPSS Genel Kültür çalışma platformu, içerik kapsamı ve iletişim bilgileri.',
  },
  faq: {
    title: 'Sık Sorulan Sorular',
    description:
      'KPSS Haritası hakkında sık sorulan sorular: ücretsiz kullanım, yıldız sistemi, veri gizliliği ve içerik kaynağı.',
  },
  contact: {
    title: 'İletişim',
    description: 'KPSS Haritası ile iletişime geçin. Hata bildirimi, öneri ve geri bildirim için e-posta adresimiz.',
  },
  'privacy-policy': {
    title: 'Gizlilik Politikası',
    description:
      'KPSS Haritası gizlilik politikası: çerezler, yerel veri saklama, Google AdSense ve kullanıcı hakları.',
  },
  terms: {
    title: 'Kullanım Koşulları',
    description: 'KPSS Haritası kullanım koşulları, sorumluluk reddi ve site kullanım kuralları.',
  },
  'subject-map': {
    title: 'Konu Haritası',
    description: 'KPSS konu haritasında ilerleyin, konuları tamamlayın ve yıldız kazanın.',
  },
  quiz: {
    title: 'Soru Çöz',
    description: 'KPSS Genel Kültür konu testi: çoktan seçmeli sorularla bilginizi ölçün.',
  },
  result: {
    title: 'Sonuç',
    description: 'KPSS konu testi sonuç ekranı.',
  },
  'not-found': {
    title: 'Sayfa Bulunamadı',
    description: 'Aradığınız sayfa bulunamadı. KPSS Haritası ana sayfasına dönebilirsiniz.',
  },
}

export function getSiteUrl() {
  const url = import.meta.env.VITE_SITE_URL?.trim()
  return url ? url.replace(/\/$/, '') : ''
}

export function pageUrl(path = '/') {
  const base = getSiteUrl()
  const normalized = path.startsWith('/') ? path : `/${path}`
  if (!base) return normalized
  return `${base}${normalized === '/' ? '' : normalized}`
}

export function resolvePageSeo(route) {
  if (route.name === 'subject-guide') {
    const guide = subjectGuides[route.params.subjectId]
    if (guide) {
      return {
        title: guide.title,
        description: guide.intro.length > 160 ? `${guide.intro.slice(0, 157)}...` : guide.intro,
      }
    }
    return { title: 'Çalışma Rehberi', description: DEFAULT_DESCRIPTION }
  }

  return PAGE_SEO[route.name] ?? { title: route.meta?.title ?? null, description: DEFAULT_DESCRIPTION }
}

export function buildDocumentTitle(pageTitle) {
  return pageTitle ? `${pageTitle} | ${SITE_NAME}` : SITE_NAME
}

export function buildJsonLd(route) {
  const url = pageUrl(route.fullPath)
  const siteUrl = getSiteUrl() || pageUrl('/')

  if (route.name === 'home') {
    return {
      '@context': 'https://schema.org',
      '@graph': [
        {
          '@type': 'WebSite',
          name: SITE_NAME,
          url: siteUrl,
          description: PAGE_SEO.home.description,
          inLanguage: 'tr-TR',
        },
        {
          '@type': 'Organization',
          name: SITE_NAME,
          url: siteUrl,
          logo: pageUrl('/og-image.svg'),
        },
      ],
    }
  }

  if (route.name === 'faq') {
    return {
      '@context': 'https://schema.org',
      '@type': 'FAQPage',
      mainEntity: faqItems.map((item) => ({
        '@type': 'Question',
        name: item.q,
        acceptedAnswer: {
          '@type': 'Answer',
          text: item.a,
        },
      })),
    }
  }

  if (route.name === 'subject-guide') {
    const guide = subjectGuides[route.params.subjectId]
    if (!guide) return null

    return {
      '@context': 'https://schema.org',
      '@graph': [
        {
          '@type': 'Article',
          headline: guide.title,
          description: guide.intro,
          url,
          inLanguage: 'tr-TR',
          author: {
            '@type': 'Organization',
            name: SITE_NAME,
          },
          publisher: {
            '@type': 'Organization',
            name: SITE_NAME,
            logo: {
              '@type': 'ImageObject',
              url: pageUrl('/og-image.svg'),
            },
          },
        },
        {
          '@type': 'BreadcrumbList',
          itemListElement: [
            {
              '@type': 'ListItem',
              position: 1,
              name: 'Ana sayfa',
              item: pageUrl('/'),
            },
            {
              '@type': 'ListItem',
              position: 2,
              name: 'Nasıl çalışılır',
              item: pageUrl('/nasil-calisilir'),
            },
            {
              '@type': 'ListItem',
              position: 3,
              name: guide.title,
              item: url,
            },
          ],
        },
      ],
    }
  }

  if (route.name === 'study-guide') {
    return {
      '@context': 'https://schema.org',
      '@type': 'Article',
      headline: kpssHomeGuide.title,
      description: PAGE_SEO['study-guide'].description,
      url,
      inLanguage: 'tr-TR',
      author: {
        '@type': 'Organization',
        name: SITE_NAME,
      },
    }
  }

  return null
}
