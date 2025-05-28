<script setup lang="ts" generic="T extends string | number | null | undefined">
import type { SelectItem } from '@nuxt/ui';
import { useRouteQuery } from '@vueuse/router';
import { computed } from 'vue';

const { label, options, queryKey, transform } = defineProps<{
  label: string,
  options: SelectItem[],
  queryKey: string,
  transform?: (value: T) => T
}>()

const value = useRouteQuery<T>(queryKey, undefined, { transform })

const items = computed<SelectItem[]>(() => [
  {
    label: `All ${label}`,
    value: undefined
  },
  ...options
])
</script>

<template>
  <USelect v-model="value" :placeholder="`All ${label}`" :items="items" :ui="{
    content: 'z-50',
    base: `py-2 ${$attrs.class}`
  }" />
</template>
