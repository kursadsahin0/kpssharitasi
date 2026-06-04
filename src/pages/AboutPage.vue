<template>
  <LegalPageShell title="Hakkında">
    <p>
      <strong>KPSS Haritası</strong>, Kamu Personel Seçme Sınavı (KPSS) Genel Kültür bölümüne
      hazırlanan adaylar için geliştirilmiş ücretsiz bir çalışma uygulamasıdır.
    </p>

    <h2>Ne sunuyoruz?</h2>
    <ul>
      <li>Ders ve konu bazlı harita ile ilerleme</li>
      <li>Çoktan seçmeli sorular ve anında geri bildirim</li>
      <li>Yıldız ve tamamlanma takibi (cihazınızda yerel olarak saklanır)</li>
    </ul>

    <h2>İçerik</h2>
    <p>
      Sorular ve konu yapısı eğitim amaçlıdır. Resmî ÖSYM sorularının birebir kopyası değildir;
      müfredata uygun özgün veya derlenmiş içerikler kullanılır.
    </p>

    <h2>İletişim</h2>
    <p>
      Sorularınız için
      <router-link :to="{ name: 'contact' }">İletişim</router-link>
      sayfasını kullanabilirsiniz.
    </p>
  </LegalPageShell>
</template>

<script setup>
import LegalPageShell from 'src/components/legal/LegalPageShell.vue'
</script>
