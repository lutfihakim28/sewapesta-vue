<script setup lang="ts">
import { useRouteQuery } from '@vueuse/router';
import { computed } from 'vue';

const { label, columnKey } = defineProps<{
  label: string,
  columnKey: string,
}>()

const asc = useRouteQuery<string[]>('asc', undefined);
const desc = useRouteQuery<string[]>('desc', undefined);

const icon = computed<string>(() => {
  if (asc.value.includes(columnKey)) return 'i-lucide-arrow-up-narrow-wide'
  if (desc.value.includes(columnKey)) return 'i-lucide-arrow-down-wide-narrow'
  return 'i-lucide-arrow-up-down';
})

function toggleSorting() {
  if (desc.value.includes(columnKey)) {
    desc.value = desc.value.filter((key) => key !== columnKey)
    return
  }
  if (asc.value.includes(columnKey)) {
    asc.value = asc.value.filter((key) => key !== columnKey)
    return
  }
  asc.value.push(columnKey)
}
</script>

<template>
  <UButton 
    color="neutral"
    variant="ghost"
    class="-mx-2.5"
    :label="label"
    :icon="icon"
    @click="toggleSorting"
  />
</template>