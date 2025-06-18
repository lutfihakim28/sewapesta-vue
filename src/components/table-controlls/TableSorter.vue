<script setup lang="ts">
import { useRouteQuery } from '@vueuse/router';
import { onBeforeMount } from 'vue';
import { computed } from 'vue';

const { label, columnKey } = defineProps<{
  label: string,
  columnKey: string,
}>()

const asc = useRouteQuery<string[]>('asc', undefined);
const desc = useRouteQuery<string[]>('desc', undefined);

const icon = computed<string>(() => {
  if (asc.value?.includes(columnKey)) return 'i-lucide-arrow-up-narrow-wide'
  if (desc.value?.includes(columnKey)) return 'i-lucide-arrow-down-wide-narrow'
  return 'i-lucide-arrow-up-down';
})

onBeforeMount(() => {
  if (!asc.value && !desc.value) {
    desc.value = ['id']
  }
})

function toggleSorting() {
  if (isNotSorted()) {
    addToAscending();
  } else if (isAscending()) {
    moveToDescending();
  } else {
    removeFromDescending();
  }
}

function isNotSorted(): boolean {
  return (!asc.value || !asc.value.includes(columnKey)) &&
    (!desc.value || !desc.value.includes(columnKey));
}

function addToAscending(): void {
  asc.value = asc.value ? [...asc.value, columnKey] : [columnKey];
}

function isAscending(): boolean {
  return asc.value?.includes(columnKey);
}

function moveToDescending(): void {
  desc.value = desc.value ? [...desc.value, columnKey] : [columnKey];
  asc.value = asc.value.filter((key) => key !== columnKey);
}

function removeFromDescending(): void {
  desc.value = desc.value.filter((key) => key !== columnKey);
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
