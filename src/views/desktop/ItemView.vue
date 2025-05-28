<script setup lang="ts">
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
import { computed, h, ref, resolveComponent } from 'vue';

const TableSorter = resolveComponent('TableSorter')

const basePath = 'private/items'
const categoryOptionStore = useCategoryOptionStore();

const { path } = useQueryParam(basePath)

// const filter = reactive<ItemFilter>({
//   asc: ['id', 'name'],
//   categoryId: undefined,
//   desc: undefined,
//   keyword: undefined,
//   page: 1,
//   pageSize: 5
// })

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

const { data, isPending } = useQuery({
  key: () => [basePath, path.value],
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
  const { data, get } = useApiFetch<ApiResponseList<Item>>(path);
  await get();
  return data.value;
}
</script>

<template>
  <section class="flex flex-col justify-between">
    <section class="flex items-center gap-x-2 flex-wrap p-4">
      <TableSearch />
      <TableSelect label="types" query-key="type" class="w-32" :options="filterTypeOptions" />
      <TableSelect label="categories" query-key="categoryId" class="w-48" :options="categoryOptionStore.options" :transform="Number" />
    </section>
    <UTable sticky :loading="isPending" :columns="columns" :data="items" :ui="{ root: 'px-0.5 flex-1' }" />
    <TablePagination :meta="meta" :disabled="isPending" />
  </section>
</template>
