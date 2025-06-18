<script setup lang="ts">
import DataGrid from '@/components/desktop/DataGrid.vue';
import { useUnitCore } from '@/core/useUnitCore';

const {
  units,
  meta,
  loading,
  refreshData,
  openConfirmation,
  openForm,
} = useUnitCore();
</script>

<template>
  <DataGrid
    record-name="unit"
    :items="units"
    :loading="loading"
    :meta="meta"
    @refresh="refreshData"
    @edit-record="openForm"
    @delete-record="openConfirmation"
    @add-record="openForm"
  >
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
