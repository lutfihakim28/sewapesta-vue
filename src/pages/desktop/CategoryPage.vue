<script setup lang="ts">
import DataGrid from '@/components/desktop/DataGrid.vue';
import { useCategoryCore } from '@/core/category';
import { ROUTE_NAMES } from '@/router/constants';

const {
  categories,
  meta,
  isPending,
  refreshData,
  t
} = useCategoryCore();
</script>

<template>
  <DataGrid record-name="category" :post-button-label="t('New-category')" :items="categories" :loading="isPending"
    :meta="meta" :post-page-name="ROUTE_NAMES.ITEM_CREATE" @refresh="refreshData">
    <template #filter>
      <TableSearch />
    </template>

    <template #item="{ item: category }">
      <section class="h-full flex flex-col gap-y-1.5">
        <section class="flex gap-x-2 items-start flex-1">
          <span class="font-semibold flex-1 text-wrap">{{ category.name }}</span>
          <span class="text-sm opacity-50">#{{ category.id }}</span>
        </section>
        <p>
          <span class="font-medium">{{ category.itemCount }}</span>
          <span class="opacity-70"> total {{ t('item', category.itemCount) }}</span>
        </p>
      </section>
    </template>
  </DataGrid>
</template>
