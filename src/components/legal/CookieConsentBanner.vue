<template>
  <transition name="cookie-banner-fade">
    <div v-if="visible" class="cookie-banner" role="dialog" aria-label="Çerez bilgilendirmesi">
      <div class="cookie-banner__inner">
        <p class="cookie-banner__text">
          KPSS Haritası, siteyi çalıştırmak ve (varsa) Google AdSense reklamlarını göstermek için
          çerez ve benzeri teknolojiler kullanabilir. Avrupa bölgesindeyseniz Google’ın rıza
          penceresi de görünebilir. Ayrıntılar için
          <router-link :to="{ name: 'privacy-policy' }" class="cookie-banner__link"
            >Gizlilik Politikası</router-link
          >.
        </p>
        <q-btn
          unelevated
          color="amber"
          text-color="dark"
          label="Kabul et"
          class="cookie-banner__btn"
          @click="onAccept"
        />
      </div>
    </div>
  </transition>
</template>

<script setup>
import { onMounted, ref } from 'vue'
import { acceptCookieConsent, hasCookieConsent } from 'src/utils/cookieConsent'

const visible = ref(false)

onMounted(() => {
  visible.value = !hasCookieConsent()
})

function onAccept() {
  acceptCookieConsent()
  visible.value = false
}
</script>

<style scoped>
.cookie-banner {
  padding: 12px 16px;
  background: rgba(30, 26, 40, 0.98);
  border-bottom: 1px solid rgba(255, 255, 255, 0.08);
}

.cookie-banner__inner {
  max-width: 720px;
  margin: 0 auto;
  display: flex;
  flex-direction: column;
  gap: 12px;
}

@media (min-width: 600px) {
  .cookie-banner__inner {
    flex-direction: row;
    align-items: center;
  }
}

.cookie-banner__text {
  margin: 0;
  flex: 1;
  font-size: 13px;
  line-height: 1.5;
  color: rgba(245, 243, 248, 0.9);
}

.cookie-banner__link {
  color: #ffd54f;
  text-decoration: underline;
}

.cookie-banner__btn {
  flex-shrink: 0;
  align-self: flex-end;
}

@media (min-width: 600px) {
  .cookie-banner__btn {
    align-self: center;
  }
}

.cookie-banner-fade-enter-active,
.cookie-banner-fade-leave-active {
  transition: opacity 0.25s ease, transform 0.25s ease;
}

.cookie-banner-fade-enter-from,
.cookie-banner-fade-leave-to {
  opacity: 0;
  transform: translateY(12px);
}
</style>
