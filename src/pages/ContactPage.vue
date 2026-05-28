<template>
  <q-page class="kpss-page info-page q-pa-lg">
    <div class="info-page__inner">
      <h1 class="text-h5 text-weight-bold q-mb-md">Contact</h1>
      <p class="text-body1 q-mb-md">Iletisim icin asagidaki e-posta adresini kullanabilirsin:</p>
      <p class="text-body2 q-mb-lg">
        <a class="contact-link" href="mailto:kursatsahin565@gmail.com">kursatsahin565@gmail.com</a>
      </p>
      <p class="text-body2 text-grey-4">
        Gorus, oneriler ve teknik sorun bildirimleri icin mesaj atabilirsin.
      </p>
    </div>
  </q-page>
</template>

<script setup></script>

<style scoped>
.info-page {
  background: linear-gradient(180deg, #12101a 0%, #1e1a28 100%);
  color: var(--kpss-text);
}

.info-page__inner {
  max-width: 720px;
  margin: 0 auto;
}

.contact-link {
  color: #ffd54f;
  font-weight: 600;
  text-decoration: none;
}

.contact-link:hover {
  text-decoration: underline;
}
</style>
