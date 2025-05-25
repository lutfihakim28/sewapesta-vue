<script setup lang="ts">
import { useApiFetch } from '@/utils/composables/api-fetch';
import { ApiResponseList } from '@/utils/dtos/ApiResponse';
import type { Category } from '@/utils/dtos/Category';
import { Item } from '@/utils/dtos/Item';
import type { Meta } from '@/utils/dtos/Meta';
import type { Unit } from '@/utils/dtos/Unit';
import { ItemTypeEnum } from '@/utils/enums/item-type';
import type { ItemFilter } from '@/utils/schemas/item-filter';
import type { TableColumn } from '@nuxt/ui';
import { useQuery } from '@pinia/colada';
import { computed, h, reactive, ref, useTemplateRef } from 'vue';

const table = useTemplateRef('table')

const filter = reactive<ItemFilter>({
  asc: undefined,
  categoryId: undefined,
  desc: undefined,
  keyword: undefined,
  page: 1,
  pageSize: 5
})

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

const basePath = ref('private/items')

const path = computed(() => {
  const query = new URLSearchParams()
  Object.entries(filter).forEach(([_key, value]) => {
    const key = _key as keyof ItemFilter;
    if ((key === 'asc' || key === 'desc') && Array.isArray(value)) {
      value.forEach((v) => query.append(key, v))
    }
    if (value) {
      query.append(key, value.toString())
    }
  })
  return `${basePath.value}?${query.toString()}`
});

const { fetch } = useApiFetch()
const { data: fetchData, get } = fetch<ApiResponseList<Item>>(path.value);

const { data } = useQuery({
  key: () => [basePath.value, path.value],
  query: () => fetcher(),
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

async function fetcher() {
  await get();
  return fetchData.value;
}
</script>

<template>
  <section>
    <UTable ref="table" :columns="columns" :data="items" />
    <div class="flex justify-end border-t border-default pt-4">
      <UPagination
        v-model:page="filter.page"
        :total="meta?.totalData"
        :items-per-page="filter.pageSize"
        show-edges
      />
    </div>
  </section>
</template>
