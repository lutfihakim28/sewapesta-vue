<script setup lang="ts">
import DataGrid from '@/components/desktop/DataGrid.vue';
import { useUnitCore } from '@/core/useUnitCore';
import { ROUTE_NAMES } from '@/router/constants';

const {
  categories,
  meta,
  isPending,
  refreshData,
  t
} = useUnitCore();
</script>

<template>
  <DataGrid record-name="unit" :post-button-label="t('New-unit')" :items="categories" :loading="isPending" :meta="meta"
    :post-page-name="ROUTE_NAMES.ITEM_CREATE" @refresh="refreshData">
    <template #filter>
      <TableSearch />
    </template>

    <template #item="{ item: unit }">
      <section class="flex gap-x-2 items-start flex-1">
        <span class="font-semibold flex-1 text-wrap">{{ unit.name }}</span>
        <span class="text-sm opacity-50">#{{ unit.id }}</span>
      </section>
    </template>
  </DataGrid>
</template>
