import TableSorter from '@/components/table-controlls/TableSorter.vue';
import { useCategoryOptionStore } from '@/stores/useCategoryOptionStore';
import { Item } from '@/dto/Item';
import { ItemTypeEnum } from '@/enums/item-type';
import type { TableColumn } from '@nuxt/ui';
import { computed, h } from 'vue';
import { useListCore } from './parts/useListCore';
import UButton from '@nuxt/ui/runtime/components/Button.vue'
import ItemRequest from '@/components/desktop/ItemRequest.vue';
import { useCreateItem } from '@/composables/api/items/useCreateItem';
import { PRIVATE_QUERY_KEYS } from '@/constants/query-keys';
import type { AppSelectItem } from '@/types/select-item';
import LoadingSpinner from '@/components/icons/LoadingSpinner.vue';
import DeleteConfirmationModal from '@/components/common/DeleteConfirmationModal.vue';
import { useDeleteItem } from '@/composables/api/items/useDeleteItem';

export function useItemCore() {
  const categoryOptionStore = useCategoryOptionStore();

  const overlay = useOverlay();
  const requestModal = overlay.create(ItemRequest)
  const deleteModal = overlay.create(DeleteConfirmationModal)

  const { list: items, meta, isLoading, fullPath, refreshData, t } = useListCore<Item>({
    key: 'items',
    dto: Item,
  });

  const listQueryKey = computed(() => PRIVATE_QUERY_KEYS.items.list(fullPath.value))

  const { create, isLoading: loadingCreate } = useCreateItem(listQueryKey)
  const { deleteItem, isLoading: loadingDelete } = useDeleteItem(listQueryKey)

  const loading = computed(() => isLoading.value || loadingCreate.value || loadingDelete.value)

  const filterTypeOptions = computed<AppSelectItem[]>(() => [
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
        columnKey: 'id',
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
        const type = row.original.type;
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
      header: () => h('div', t('Category')),
    },
    {
      accessorKey: 'unit.name',
      header: () => h('div', t('Unit')),
    },
    {
      accessorKey: 'action',
      header: () => h('div', { class: 'text-center' }, t('Action')),
      cell: ({ row }) => {
        const item = row.original;
        const id = item.id;
        const loading = item.loading;
        if (loading) {
          return h('div', { class: 'flex justify-center py-1.5' }, [
            h(LoadingSpinner, { class: 'w-5 h-5' })
          ])
        }
        return h('div', { class: 'flex gap-x-1 justify-center' }, [
          h(UButton, {
            icon: 'i-lucide-pencil',
            variant: 'ghost',
            color: 'info',
            disabled: loading,
            onClick() {
              console.log('edit', id);
            }
          }),
          h(UButton, {
            icon: 'i-lucide-trash',
            variant: 'ghost',
            color: 'error',
            disabled: loading,
            async onClick() {
              await openConfirmation(item)
            }
          })
        ])
      }
    }
  ]);

  async function refreshAllData() {
    await Promise.all([
      refreshData(),
      categoryOptionStore.refetch()
    ]);
  }

  async function openForm(item?: Item) {
    const instance = requestModal.open({
      item,
    })

    const newItem = await instance.result

    if (newItem && newItem.id === 0) {
      create(newItem)
      return;
    }

    if (newItem) {
      // update(newItem[0])
      return
    }
  }

  async function openConfirmation(item: Item) {
    const instance = deleteModal.open({
      data: t('item'),
      value: item.name
    })

    const result = await instance.result;

    if (result) {
      deleteItem(item)
    }
  }

  return {
    columns,
    items,
    meta,
    filterTypeOptions,
    refreshData: refreshAllData,
    isLoading: loading,
    t,
    openForm,
    categoryOptionStore,
  }
}
