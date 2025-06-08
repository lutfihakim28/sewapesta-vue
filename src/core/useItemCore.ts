import TableSorter from '@/components/table-controlls/TableSorter.vue';
import { useCategoryOptionStore } from '@/stores/useCategoryOptionStore';
import { Item } from '@/dto/Item';
import { ItemTypeEnum } from '@/enums/item-type';
import type { SelectItem, TableColumn } from '@nuxt/ui';
import { computed, h } from 'vue';
import { useListCore } from './parts/useListCore';

export function useItemCore() {
  const basePath = 'private/items'
  const categoryOptionStore = useCategoryOptionStore();

  const { list: items, meta, isPending, refreshData, t } = useListCore<Item>({
    basePath,
    dto: Item,
  });

  const filterTypeOptions = computed<SelectItem[]>(() => [
    {
      label: t(ItemTypeEnum.Equipment),
      value: ItemTypeEnum.Equipment,
    },
    {
      label: t(ItemTypeEnum.Inventory),
      value: ItemTypeEnum.Inventory,
    },
  ]);

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
        const color = colors[type];
        return h('div', { class: color }, t(type));
      }
    },
    {
      accessorKey: 'category.name',
      header: () => h('span', t('Category')),
    },
    {
      accessorKey: 'unit.name',
      header: () => h('span', t('Unit')),
    },
  ]);

  async function refreshAllData() {
    await Promise.all([
      refreshData(),
      categoryOptionStore.refresh()
    ]);
  }

  return {
    columns,
    items,
    meta,
    filterTypeOptions,
    refreshData: refreshAllData,
    isPending,
    t,
    categoryOptionStore,
  }
}
