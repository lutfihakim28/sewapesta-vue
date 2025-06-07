<script setup lang="ts">
import { i18n, loadLocaleMessages, setI18nLanguage } from '@/i18n';
import { STORAGE_LOCALE_KEY, type LOCALES } from '@/constants/locales';
import type { AvatarProps, SelectItem } from '@nuxt/ui';
import { useStorage } from '@vueuse/core';
import { ref, watch } from 'vue';
import { useI18n } from 'vue-i18n';

type Locale = keyof typeof LOCALES;

const FLAGS: {
  [key in Locale]: AvatarProps
} = {
  en: {
    src: '/src/assets/GB.webp',
    alt: 'Great Britain'
  },
  id: {
    src: '/src/assets/ID.webp',
    alt: 'Indonesia'
  },
}

const { locale } = useI18n()

const storageLocale = useStorage(STORAGE_LOCALE_KEY, 'en')
const value = ref<Locale>(locale.value as Locale);

const items: SelectItem[] = [
  {
    label: 'English',
    value: 'en',
    avatar: FLAGS['en']
  },
  {
    label: 'Bahasa',
    value: 'id',
    avatar: FLAGS['id']
  },
]

watch(value, async () => {
  await loadLocaleMessages(i18n, value.value)
  setI18nLanguage(i18n, value.value)
  storageLocale.value = value.value
})
</script>

<template>
  <USelect v-model="value" :items="items" :avatar="FLAGS[value]" variant="soft" :ui="{
    base: 'w-34'
  }" />
</template>
