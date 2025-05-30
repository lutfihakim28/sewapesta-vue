<script setup lang="ts" generic="T extends string | number | null | undefined">
import type { SelectItem } from '@nuxt/ui';
import { useRouteQuery } from '@vueuse/router';
import { computed } from 'vue';

const { label, options, queryKey, loading, transform } = defineProps<{
  label: string,
  options: SelectItem[],
  queryKey: string,
  loading?: boolean,
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

function clear() {
  value.value = undefined as T;
}
</script>

<template>
  <USelectMenu v-model="value" value-key="value" :loading="loading" :placeholder="`All ${label}`" :items="items" :ui="{
    content: 'z-50',
    base: `py-2 ${$attrs.class}`
  }">
    <template v-if="value" #trailing>
      <UButton icon="i-lucide-x" variant="ghost" size="xs" color="neutral" @click.stop="clear" />
    </template>
  </USelectMenu>
</template>
