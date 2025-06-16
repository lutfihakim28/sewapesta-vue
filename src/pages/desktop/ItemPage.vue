<script setup lang="ts">
import { useItemCore } from '@/core/useItemCore';

const {
  columns,
  isLoading,
  items,
  meta,
  refreshData,
  filterTypeOptions,
  categoryOptionStore,
  t,
  openForm,
} = useItemCore()
</script>

<template>
  <DataTable
    record-name="item"
    :post-button-label="t('New-entity', { entity: t('item') })"
    :columns="columns"
    :loading="isLoading"
    :meta="meta"
    :items="items"
    @refresh="refreshData"
    @add-record="openForm"
  >
    <template #filter>
      <TableSearch />
      <TableSelect
        :label="t('type', 2)"
        query-key="type"
        class="w-32"
        :options="filterTypeOptions"
      />
      <TableSelect
        :label="t('category', 2)"
        query-key="categoryId"
        class="w-48"
        :options="categoryOptionStore.options"
        :loading="categoryOptionStore.loading"
        :transform="Number"
      />
    </template>
  </DataTable>
</template>
