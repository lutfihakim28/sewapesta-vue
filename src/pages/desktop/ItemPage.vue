<script setup lang="ts">
import { ROUTE_NAMES } from '@/router/routes';
import { useAuthStore } from '@/stores/auth';
import { useCategoryOptionStore } from '@/stores/category-option';
import { useApiFetch } from '@/utils/composables/useApiFetch';
import { useQueryParam } from '@/utils/composables/useQueryParam';
import { ApiResponseList } from '@/utils/dtos/ApiResponse';
import type { Category } from '@/utils/dtos/Category';
import { Item } from '@/utils/dtos/Item';
import type { Meta } from '@/utils/dtos/Meta';
import type { Unit } from '@/utils/dtos/Unit';
import { ItemTypeEnum } from '@/utils/enums/item-type';
import type { SelectItem, TableColumn } from '@nuxt/ui';
import { useQuery } from '@pinia/colada';
import { capitalCase } from 'change-case';
import { computed, h, ref, resolveComponent } from 'vue';
import { useI18n } from 'vue-i18n';
import { useRouter } from 'vue-router';

const TableSorter = resolveComponent('TableSorter')

const basePath = 'private/items'
const categoryOptionStore = useCategoryOptionStore();
const authStore = useAuthStore()
const toast = useToast()
const router = useRouter()
const { t } = useI18n()

const { path } = useQueryParam(basePath)

const filterTypeOptions = ref<SelectItem[]>([
  {
    label: ItemTypeEnum.Equipment,
    value: ItemTypeEnum.Equipment,
  },
  {
    label: ItemTypeEnum.Inventory,
    value: ItemTypeEnum.Inventory,
  }
])

const columns: TableColumn<Item>[] = [
  {
    accessorKey: 'id',
    header: () => h(TableSorter, {
      label: 'ID',
      columnKey: 'id'
    }),
  },
  {
    accessorKey: 'name',
    header: () => h(TableSorter, {
      label: 'Name',
      columnKey: 'name'
    }),
  },
  {
    accessorKey: 'type',
    header: () => h(TableSorter, {
      label: 'Type',
      columnKey: 'type'
    }),
    cell: ({ row }) => {
      const type = row.getValue('type') as ItemTypeEnum;
      const colors: Record<ItemTypeEnum, string> = {
        [ItemTypeEnum.Equipment]: 'text-primary' as const,
        [ItemTypeEnum.Inventory]: 'text-secondary' as const,
      };
      const color = colors[type]
      return h('div', { class: color }, type)
    }
  },
  {
    accessorKey: 'category',
    header: 'Category',
    cell: ({ row }) => {
      const category = row.getValue('category') as Category;
      return category.name
    }
  },
  {
    accessorKey: 'unit',
    header: 'Unit',
    cell: ({ row }) => {
      const unit = row.getValue('unit') as Unit;
      return unit.name
    }
  },
];

const { data, isPending, refresh } = useQuery({
  key: () => [basePath, path.value, authStore.token],
  query: () => fetcher(path.value),
})

const items = computed<Item[]>(() => {
  if (!data.value) return [];
  const response = new ApiResponseList(data.value, Item)

  return response.data
})

const meta = computed<Meta | undefined>(() => {
  if (!data.value) return;
  const response = new ApiResponseList(data.value, Item)

  return response.meta
})

async function fetcher(path: string) {
  if (!path.includes('page=')) return
  const { data, get } = useApiFetch<ApiResponseList<Item>>(path);
  await get();
  return data.value;
}

async function refreshData() {
  await Promise.all([
    refresh(),
    categoryOptionStore.refresh()
  ])
  toast.add({
    color: 'success',
    title: 'Refreshed',
    duration: 1500,
  })
}

function toCreateView() {
  router.push({ name: ROUTE_NAMES.ITEM_CREATE })
}
</script>

<template>
  <section class="flex flex-col justify-between">
    <section class="p-4 space-y-4">
      <section class="flex justify-between items-center">
        <h4 class="text-2xl font-semibold">Items</h4>
        <section class="flex items-center gap-x-2">
          <UButton :label="capitalCase(t('new-item'))" icon="i-lucide-plus" @click="toCreateView" />
          <UButton icon="i-lucide-refresh-cw" variant="ghost" color="warning" @click="refreshData" />
        </section>
      </section>
      <section class="flex items-center gap-x-2 flex-wrap">
        <TableSearch />
        <TableSelect :label="t('type', 2)" query-key="type" class="w-32" :options="filterTypeOptions" />
        <TableSelect :label="t('category', 2)" query-key="categoryId" class="w-48"
          :options="categoryOptionStore.options" :loading="categoryOptionStore.loading" :transform="Number" />
      </section>
    </section>
    <UTable sticky :loading="isPending" :columns="columns" :data="items" :ui="{ root: 'px-0.5 flex-1' }" />
    <TablePagination :meta="meta" :disabled="isPending" record-name="items" />
  </section>
</template>
