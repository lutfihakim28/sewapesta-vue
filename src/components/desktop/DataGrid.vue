<script setup lang="ts" generic="T extends { id: number, loading?: boolean }">
import type { Meta } from '@/dto/Meta';
import { useI18n } from 'vue-i18n';

const { loading = undefined, items, meta = undefined, recordName } = defineProps<{
  recordName: string,
  loading?: boolean,
  items: T[]
  meta?: Meta
}>()

const emit = defineEmits<{
  refresh: [],
  addRecord: [],
  editRecord: [T],
  deleteRecord: [T],
}>()

const { t } = useI18n()

function addRecord() {
  emit('addRecord')
}

function refreshData() {
  emit('refresh')
}

function editRecord(item: T) {
  emit('editRecord', item)
}

function deleteRecord(item: T) {
  emit('deleteRecord', item)
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
            :post-button-label="t('New-entity', { entity: t(recordName) })"
            @click="addRecord"
          />
          <RefreshButton @click="refreshData" />
        </section>
      </section>
      <section class="flex items-center gap-2 flex-wrap">
        <slot name="filter" />
      </section>
    </section>
    <section class="overflow-y-auto flex-1 p-4 pt-0 relative">
      <section class="sticky top-0">
        <UProgress
          v-if="loading"
          size="2xs"
          class="mb-2"
        />
        <section
          v-else
          class="border-t border-default mb-2"
        />
      </section>
      <section v-if="items.length">
        <section class="grid grid-cols-3 xl:grid-cols-4 grid-flow-row gap-4">
          <section
            v-for="item in items"
            :key="item.id"
            :class="[
              'rounded border border-default p-4 bg-(--ui-bg) flex flex-col gap-y-2',
              {
                'animate-pulse': item.loading
              }
            ]"
          >
            <section class="flex-1">
              <slot
                name="item"
                :item="item"
              />
            </section>
            <UProgress
              v-if="item.loading"
              size="2xs"
            />
            <div
              v-else
              class="border-t border-default w-full"
            />
            <section class="flex justify-end gap-x-1">
              <UButton
                icon="i-lucide-pencil"
                :disabled="item.loading"
                variant="ghost"
                color="info"
                @click="() => editRecord(item)"
              />
              <UButton
                icon="i-lucide-trash"
                :disabled="item.loading"
                variant="ghost"
                color="error"
                @click="() => deleteRecord(item)"
              />
            </section>
          </section>
        </section>
      </section>
      <section v-else>
        <p class="text-center text-muted">
          {{ t('no data') }}
        </p>
      </section>
    </section>
    <TablePagination
      :meta="meta"
      :disabled="loading"
      :record-name="recordName"
      :default-size="20"
    />
  </section>
</template>
