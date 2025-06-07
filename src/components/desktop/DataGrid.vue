<script setup lang="ts" generic="T extends { id: number }">
import type { RouteName } from '@/router/constants';
import { useAppRouter } from '@/router/useAppRouter';
import type { Meta } from '@/utils/dtos/Meta';
import { useI18n } from 'vue-i18n';

const { loading, items, postPageName, meta, recordName, postButtonLabel } = defineProps<{
  recordName: string,
  loading: boolean,
  postButtonLabel: string,
  items: T[]
  meta?: Meta
  postPageName?: RouteName,
}>()

const appRouter = useAppRouter();

const emit = defineEmits<{
  refresh: []
}>()

const { t } = useI18n()

function toCreatePage() {
  if (!postPageName) return;
  appRouter.push({ name: postPageName })
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
    <section class="overflow-y-auto flex-1 p-4">
      <section v-if="items.length">
        <section class="grid grid-cols-4 grid-flow-row gap-4">
          <section v-for="item in items" :key="item.id"
            class="rounded border border-default p-4 bg-(--ui-bg) flex flex-col gap-y-2">
            <section class="flex-1">
              <slot name="item" :item="item" />
            </section>
            <section class="border-t border-default pt-2 flex justify-end gap-x-1">
              <UButton icon="i-lucide-pencil" variant="ghost" color="info" />
              <UButton icon="i-lucide-trash" size="sm" variant="ghost" color="error" />
            </section>
          </section>
        </section>
      </section>
      <section v-else>
        <p class="text-center text-muted">{{ t('no data') }}</p>
      </section>
    </section>
    <TablePagination :meta="meta" :disabled="loading" :record-name="recordName" />
  </section>
</template>
