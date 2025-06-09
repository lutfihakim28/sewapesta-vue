<script setup lang="ts">
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
  <DataTable record-name="package" :post-button-label="t('New-package')" :columns="columns" :loading="isPending"
    :meta="meta" :items="packages" @refresh="refreshData">
    <template #filter>
      <TableSearch />
      <TableSelect :label="t('product', 2)" query-key="productId" class="w-48" :options="productOptionStore.options"
        :loading="productOptionStore.loading" :transform="Number" />
    </template>
  </DataTable>
</template>
