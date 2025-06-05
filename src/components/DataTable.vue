<script setup lang="ts" generic="T">
import type { RouteName } from '@/router/routes';
import type { Meta } from '@/utils/dtos/Meta';
import type { TableColumn } from '@nuxt/ui';
import { useI18n } from 'vue-i18n';
import { useRouter } from 'vue-router';

const { columns, loading, items, postPageName, meta, recordName, postButtonLabel } = defineProps<{
  columns: TableColumn<T>[]
  recordName: string,
  loading: boolean,
  postButtonLabel: string,
  items?: T[]
  meta?: Meta
  postPageName?: RouteName,
}>()

const emit = defineEmits<{
  refresh: []
}>()

const { t } = useI18n()
const router = useRouter()

function toCreatePage() {
  if (!postPageName) return;
  router.push({ name: postPageName })
}

function refreshData() {
  emit('refresh')
}
</script>

<template>
  <section class="flex flex-col justify-between">
    <section class="p-4 space-y-4">
      <section class="flex justify-between items-center">
        <h4 class="text-2xl font-semibold capitalize">{{ t(recordName, 2) }}</h4>
        <section class="flex items-center gap-x-2">
          <UButton v-if="postPageName" :label="postButtonLabel" icon="i-lucide-plus" @click="toCreatePage" />
          <UButton icon="i-lucide-refresh-cw" variant="ghost" color="warning" @click="refreshData" />
        </section>
      </section>
      <section class="flex items-center gap-2 flex-wrap">
        <slot name="filter" />
      </section>
    </section>
    <UTable sticky :loading="loading" :columns="columns" :data="items" :ui="{ root: 'px-0.5 flex-1' }" />
    <TablePagination :meta="meta" :disabled="loading" :record-name="recordName" />
  </section>
</template>