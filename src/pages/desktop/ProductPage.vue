<script setup lang="ts">
import DataGrid from '@/components/desktop/DataGrid.vue';
import { useProductCore } from '@/core/useProductCore';

const {
  products,
  meta,
  isLoading,
  refreshData,
  t
} = useProductCore();
</script>

<template>
  <DataGrid
    record-name="product"
    :post-button-label="t('New-product')"
    :items="products"
    :loading="isLoading"
    :meta="meta"
    @refresh="refreshData"
  >
    <template #filter>
      <TableSearch />
    </template>

    <template #item="{ item: product }">
      <section class="h-full flex flex-col gap-y-1.5">
        <section class="flex gap-x-2 items-start flex-1">
          <span class="font-semibold flex-1 text-wrap">{{ product.name }}</span>
          <span class="text-sm opacity-50">#{{ product.id }}</span>
        </section>
        <p>
          <span class="font-medium">{{ product.packageCount }}</span>
          <span class="opacity-70"> total {{ t('package', product.packageCount || 0) }}</span>
        </p>
      </section>
    </template>
  </DataGrid>
</template>
