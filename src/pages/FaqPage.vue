<template>
  <LegalPageShell title="Sık Sorulan Sorular">
    <div v-for="item in faqItems" :key="item.q" class="faq-item q-mb-lg">
      <h2>{{ item.q }}</h2>
      <p>{{ item.a }}</p>
    </div>

    <AdSenseBlock v-if="contentAdSlot" :ad-slot="contentAdSlot" />
  </LegalPageShell>
</template>

<script setup>
import AdSenseBlock from 'src/components/ads/AdSenseBlock.vue'
import LegalPageShell from 'src/components/legal/LegalPageShell.vue'
import { ADSENSE_SLOTS } from 'src/config/adsense'

const contentAdSlot = ADSENSE_SLOTS.content

const faqItems = [
  {
    q: 'KPSS Haritası ücretsiz mi?',
    a: 'Evet. Site tamamen ücretsizdir. Konu haritası, sorular ve ilerleme takibi için ücret talep edilmez.',
  },
  {
    q: 'Hesap oluşturmam gerekiyor mu?',
    a: 'Hayır. İlerlemeniz tarayıcınızda yerel olarak saklanır. Farklı cihazda devam etmek için şu an hesap sistemi bulunmamaktadır.',
  },
  {
    q: 'Sorular resmî ÖSYM soruları mı?',
    a: 'Hayır. İçerikler eğitim amaçlıdır ve KPSS Genel Kültür müfredatına uygun hazırlanmıştır; resmî sınav sorularının birebir kopyası değildir.',
  },
  {
    q: 'Yıldız sistemi nasıl çalışır?',
    a: 'Her konu quizinde aldığınız puana göre 0–3 yıldız kazanırsınız. Yüksek puan, konuyu daha iyi bildiğinizi gösterir. Sonraki konuları açmak için sırayla ilerlemeniz gerekir.',
  },
  {
    q: 'Verilerim nasıl kullanılıyor?',
    a: 'Çalışma ilerlemeniz yalnızca cihazınızda tutulur. Reklam ve analiz hizmetleri için Gizlilik Politikamıza bakın.',
  },
  {
    q: 'Hata bildirmek veya öneride bulunmak istiyorum.',
    a: 'İletişim sayfasındaki e-posta adresinden bize yazabilirsiniz. Konu adını ve mümkünse ekran görüntüsünü belirtmeniz çözümü hızlandırır.',
  },
]
</script>

<style scoped>
.faq-item h2 {
  font-size: 1.05rem;
  font-weight: 700;
  margin-bottom: 0.35rem;
}

.faq-item p {
  margin: 0;
  color: rgba(245, 243, 248, 0.85);
  line-height: 1.65;
}
</style>
