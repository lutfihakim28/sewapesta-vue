<script setup lang="ts">
import { useItemCore } from '@/core/item-core';
import { ROUTE_NAMES } from '@/router/routes';

const {
  columns,
  isPending,
  items,
  meta,
  refreshData,
  filterTypeOptions,
  categoryOptionStore,
  t
} = useItemCore()
</script>

<template>
  <DataTable record-name="item" :post-button-label="t('New-item')" :columns="columns" :loading="isPending" :meta="meta" :items="items" :post-page-name="ROUTE_NAMES.ITEM_CREATE" @refresh="refreshData">
    <template #filter>
      <TableSearch />
      <TableSelect :label="t('type', 2)" query-key="type" class="w-32" :options="filterTypeOptions" />
      <TableSelect :label="t('category', 2)" query-key="categoryId" class="w-48"
        :options="categoryOptionStore.options" :loading="categoryOptionStore.loading" :transform="Number" />
    </template>
  </DataTable>
</template>
