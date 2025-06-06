<script setup lang="ts">
import { useI18n } from 'vue-i18n'
import { LOCALES } from './utils/constants/locales';
import { useLocationStore } from './stores/location';

const { locale } = useI18n()

const locationStore = useLocationStore()
</script>

<template>
  <UApp :locale="LOCALES[locale as keyof typeof LOCALES]">
    <RouterView />
  </UApp>
</template>
