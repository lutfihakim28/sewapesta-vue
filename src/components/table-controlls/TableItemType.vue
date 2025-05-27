<script setup lang="ts">
import { ItemTypeEnum } from '@/utils/enums/item-type';
import type { SelectItem } from '@nuxt/ui';
import { useRouteQuery } from '@vueuse/router';
import { ref } from 'vue';

const type = useRouteQuery<ItemTypeEnum | undefined>('type', undefined )
const items = ref<SelectItem[]>([
  {
    label: 'All types',
    value: undefined
  },
  {
    label: ItemTypeEnum.Equipment,
    value: ItemTypeEnum.Equipment
  },
  {
    label: ItemTypeEnum.Inventory,
    value: ItemTypeEnum.Inventory
  },
])
</script>

<template>
  <USelect v-model="type" placeholder="All types" :items="items" :ui="{
    content: 'z-50',
    base: 'w-32 py-2'
  }" />
</template>
