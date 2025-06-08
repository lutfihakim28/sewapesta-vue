<script setup lang="ts">
import { ROUTE_NAMES } from '@/router/constants';
import { usePackageCore } from '@/core/usePackageCore';

const {
  columns,
  isPending,
  packages,
  meta,
  refreshData,
  productOptionStore,
  t
} = usePackageCore()
</script>

<template>
  <DataTable record-name="item" :post-button-label="t('New-item')" :columns="columns" :loading="isPending" :meta="meta"
    :items="packages" :post-page-name="ROUTE_NAMES.ITEM_CREATE" @refresh="refreshData">
    <template #filter>
      <TableSearch />
      <TableSelect :label="t('product', 2)" query-key="productId" class="w-48" :options="productOptionStore.options"
        :loading="productOptionStore.loading" :transform="Number" />
    </template>
  </DataTable>
</template>
