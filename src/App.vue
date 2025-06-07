<script setup lang="ts">
import { useI18n } from 'vue-i18n'
import { LOCALES } from './utils/constants/locales';

const { locale } = useI18n()

</script>

<template>
  <UApp :locale="LOCALES[locale as keyof typeof LOCALES]">
    <RouterView />
  </UApp>
</template>
