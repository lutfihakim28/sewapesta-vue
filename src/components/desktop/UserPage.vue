<script setup lang="ts">
import { useUserCore } from '@/core/useUserStore';
import { ROUTE_NAMES } from '@/router/constants';
import type { RoleEnum } from '@/enums/role';

const { role } = defineProps<{
  role: RoleEnum
}>()

const {
  columns,
  isPending,
  users,
  meta,
  refreshData,
  t
} = useUserCore(role)
</script>

<template>
  <DataTable :record-name="role.toLowerCase()" :post-button-label="t('New-user')" :columns="columns"
    :loading="isPending" :meta="meta" :items="users" :post-page-name="ROUTE_NAMES.ITEM_CREATE" @refresh="refreshData">
    <template #filter>
      <TableSearch />
    </template>
  </DataTable>
</template>
