<script setup lang="ts">
import { useUserCore } from '@/core/user-core';
import { ROUTE_NAMES } from '@/router/constants';
import type { RoleEnum } from '@/utils/enums/role';

const { role } = defineProps<{
  role: RoleEnum
}>()

const {
  columns,
  isPending,
  items,
  meta,
  refreshData,
  t
} = useUserCore(role)
</script>

<template>
  <DataTable :record-name="role.toLowerCase()" :post-button-label="t('New-user')" :columns="columns"
    :loading="isPending" :meta="meta" :items="items" :post-page-name="ROUTE_NAMES.ITEM_CREATE" @refresh="refreshData">
    <template #filter>
      <TableSearch />
    </template>
  </DataTable>
</template>
