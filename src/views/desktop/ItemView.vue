<script setup lang="ts">
import TableItemType from '@/components/table-controlls/TableItemType.vue';
import { useApiFetch } from '@/utils/composables/useApiFetch';
import { useQueryParam } from '@/utils/composables/useQueryParam';
import { ApiResponseList } from '@/utils/dtos/ApiResponse';
import type { Category } from '@/utils/dtos/Category';
import { Item } from '@/utils/dtos/Item';
import type { Meta } from '@/utils/dtos/Meta';
import type { Unit } from '@/utils/dtos/Unit';
import { ItemTypeEnum } from '@/utils/enums/item-type';
import type { TableColumn } from '@nuxt/ui';
import { useQuery } from '@pinia/colada';
import { computed, h } from 'vue';

// const table = useTemplateRef('table')
const basePath = 'private/items'

const { path } = useQueryParam(basePath)

// const filter = reactive<ItemFilter>({
//   asc: ['id', 'name'],
//   categoryId: undefined,
//   desc: undefined,
//   keyword: undefined,
//   page: 1,
//   pageSize: 5
// })

const columns: TableColumn<Item>[] = [
  {
    accessorKey: 'id',
    header: '#',
  },
  {
    accessorKey: 'name',
    header: 'Name'
  },
  {
    accessorKey: 'type',
    header: 'Type',
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

const { data, isLoading } = useQuery({
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
      <TableItemType />
    </section>
    <UTable sticky :columns="columns" :data="items" :ui="{ root: 'px-0.5 flex-1' }" />
    <TablePagination :meta="meta" :loading="isLoading" />
  </section>
</template>
