import TableSorter from '@/components/table-controlls/TableSorter.vue';
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
import { computed, h, watch } from 'vue';
import { useI18n } from 'vue-i18n';

export function useItemCore() {
  const basePath = 'private/items'
  const categoryOptionStore = useCategoryOptionStore();
  const authStore = useAuthStore()
  const toast = useToast()
  const { t } = useI18n()

  const { path } = useQueryParam(basePath)

  const filterTypeOptions = computed<SelectItem[]>(() => [
    {
      label: t(ItemTypeEnum.Equipment),
      value: ItemTypeEnum.Equipment,
    },
    {
      label: t(ItemTypeEnum.Inventory),
      value: ItemTypeEnum.Inventory,
    }
  ])

  const columns = computed<TableColumn<Item>[]>(() => [
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
        label: t('Name'),
        columnKey: 'name'
      }),
    },
    {
      accessorKey: 'type',
      header: () => h(TableSorter, {
        label: t('Type'),
        columnKey: 'type'
      }),
      cell: ({ row }) => {
        const type = row.getValue('type') as ItemTypeEnum;
        const colors: Record<ItemTypeEnum, string> = {
          [ItemTypeEnum.Equipment]: 'text-primary' as const,
          [ItemTypeEnum.Inventory]: 'text-secondary' as const,
        };
        const color = colors[type]
        return h('div', { class: color }, t(type))
      }
    },
    {
      accessorKey: 'category',
      header: () => h('span', t('Category')),
      cell: ({ row }) => {
        const category = row.getValue('category') as Category;
        return category.name
      }
    },
    {
      accessorKey: 'unit',
      header: () => h('span', t('Unit')),
      cell: ({ row }) => {
        const unit = row.getValue('unit') as Unit;
        return unit.name
      }
    },
  ]);

  const { data, isPending, refresh } = useQuery({
    key: () => [basePath, path.value, authStore.token],
    query: () => fetcher(path.value),
  })

  const items = computed<Item[]>((previous) => {
    if (data.value) {
      const response = new ApiResponseList(data.value, Item)

      return response.data
    }

    if (previous) return previous;
    return []
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
    try {
      await Promise.all([
        refresh(),
        categoryOptionStore.refresh()
      ])
      toast.add({
        color: 'success',
        title: t('refreshed'),
        duration: 1500,
      })
    } catch (error) {
      toast.add({
        color: 'error',
        title: 'Error',
        duration: 1500,
      })
      throw error;
    }
  }

  return {
    columns,
    items,
    meta,
    filterTypeOptions,
    refreshData,
    isPending,
    t,
    categoryOptionStore,
  }
}
