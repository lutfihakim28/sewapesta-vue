<script setup lang="ts">
import { SortDirectionEnum } from '@/enums/sort-by';
import { useRouteQuery } from '@vueuse/router';
import { computed } from 'vue';

const { label, columnKey } = defineProps<{
  label: string,
  columnKey: string,
}>()

const sort = useRouteQuery<string | undefined>('sort', undefined);
const sortDirection = useRouteQuery<SortDirectionEnum | undefined>('sortDirection', undefined);

const icon = computed<string>(() => {
  if (sort.value === columnKey && sortDirection.value === SortDirectionEnum.Asc) return 'i-lucide-arrow-up-narrow-wide'
  if (sort.value === columnKey && sortDirection.value === SortDirectionEnum.Desc) return 'i-lucide-arrow-down-wide-narrow'
  return 'i-lucide-arrow-up-down';
})

function toggleSorting() {
  if (isNotSorted()) {
    ascending();
  } else if (isAscending()) {
    descending();
  } else {
    unsort();
  }
}

function isNotSorted(): boolean {
  return sort.value !== columnKey
}

function ascending(): void {
  sort.value = columnKey;
  sortDirection.value = SortDirectionEnum.Asc;
}

function isAscending(): boolean {
  return sort.value === columnKey && sortDirection.value === SortDirectionEnum.Asc;
}

function descending(): void {
  sort.value = columnKey;
  sortDirection.value = SortDirectionEnum.Desc;
}

function unsort(): void {
  sort.value = undefined;
  sortDirection.value = undefined;
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
