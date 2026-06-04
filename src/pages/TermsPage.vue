<template>
  <LegalPageShell title="Kullanım Koşulları">
    <p>
      KPSS Haritası sitesini ve uygulamasını kullanarak aşağıdaki koşulları kabul etmiş olursunuz.
    </p>

    <h2>1. Hizmet</h2>
    <p>
      Site, KPSS hazırlığına yönelik eğitim içeriği ve araçlar sunar. Hizmet “olduğu gibi”
      sağlanır; sınav sonucu veya başarı garantisi verilmez.
    </p>

    <h2>2. Kullanıcı yükümlülükleri</h2>
    <ul>
      <li>Siteyi yasa dışı veya zararlı amaçlarla kullanmamak</li>
      <li>İçeriği izinsiz kopyalamamak veya otomatik olarak toplamamak</li>
      <li>Reklamlara tıklamak için hileli yöntemler kullanmamak</li>
    </ul>

    <h2>3. Fikri mülkiyet</h2>
    <p>
      Arayüz, marka ve derlenmiş içerik yapısı site sahibine aittir. Soru metinleri eğitim
      amaçlı sunulur.
    </p>

    <h2>4. Sorumluluk sınırı</h2>
    <p>
      İçerikteki olası hatalardan veya kesintilerden doğan dolaylı zararlardan sorumlu tutulamayız.
      Kritik konularda resmî kaynakları kontrol edin.
    </p>

    <h2>5. Gizlilik</h2>
    <p>
      Veri işleme için
      <router-link :to="{ name: 'privacy-policy' }">Gizlilik Politikası</router-link>
      geçerlidir.
    </p>

    <h2>6. Değişiklik ve sonlandırma</h2>
    <p>Hizmeti veya bu koşulları önceden haber vermeksizin güncelleyebiliriz.</p>
  </LegalPageShell>
</template>

<script setup>
import LegalPageShell from 'src/components/legal/LegalPageShell.vue'
</script>
