<script setup lang="ts" generic="T">
import type { RouteName } from '@/router/constants';
import { useAppRouter } from '@/router/useAppRouter';
import type { Meta } from '@/dto/Meta';
import type { TableColumn } from '@nuxt/ui';
import { useI18n } from 'vue-i18n';

const { columns, loading, items = [], postPageName = undefined, meta = undefined, recordName, postButtonLabel } = defineProps<{
  columns: TableColumn<T>[]
  recordName: string,
  loading: boolean,
  postButtonLabel: string,
  items?: T[]
  meta?: Meta
  postPageName?: RouteName,
}>()

const appRouter = useAppRouter();

const emit = defineEmits<{
  refresh: []
}>()

const { t } = useI18n()

async function toCreatePage() {
  if (!postPageName) return;
  await appRouter.push({ name: postPageName })
}

function refreshData() {
  emit('refresh')
}
</script>

<template>
  <section class="flex flex-col justify-between">
    <section class="p-4 space-y-4">
      <section class="flex justify-between items-center">
        <h4 class="text-2xl font-semibold capitalize">
          {{ t(recordName, 2) }}
        </h4>
        <section class="flex items-center gap-x-2">
          <CreateButton
            :post-button-label="postButtonLabel"
            @click="toCreatePage"
          />
          <RefreshButton @click="refreshData" />
        </section>
      </section>
      <section class="flex items-center gap-2 flex-wrap">
        <slot name="filter" />
      </section>
    </section>
    <UTable
      sticky
      :loading="loading"
      :columns="columns"
      :data="items"
      :ui="{ root: 'px-0.5 flex-1' }"
    />
    <TablePagination
      :meta="meta"
      :disabled="loading"
      :record-name="recordName"
    />
  </section>
</template>
