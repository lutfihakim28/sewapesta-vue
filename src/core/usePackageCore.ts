import TableSorter from '@/components/table-controlls/TableSorter.vue';
import { Package } from '@/dto/Package';
import type { TableColumn } from '@nuxt/ui';
import { computed, h } from 'vue';
import { useListCore } from './parts/useListCore';
import { useProductOptionStore } from '@/stores/useProductOptionStore';
import UButton from '@nuxt/ui/runtime/components/Button.vue';

export function usePackageCore() {
  const productOptionStore = useProductOptionStore();

  const { list: packages, meta, isLoading, refreshData, t } = useListCore<Package>({
    key: 'packages',
    dto: Package,
  });

  const columns = computed<TableColumn<Package>[]>(() => [
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
      accessorKey: 'formattedPrice',
      header: () => h(TableSorter, {
        label: t('Price'),
        columnKey: 'price'
      }),
    },
    {
      accessorKey: 'product.name',
      header: () => h(TableSorter, {
        label: t('Product'),
        columnKey: 'product'
      }),
    },
    {
      accessorKey: 'action',
      header: () => h('div', { class: 'text-center' }, t('Action')),
      cell: ({ row }) => {
        const id = row.getValue('id') as number;
        return h('section', { class: 'flex gap-x-1 justify-center' }, [
          h(UButton, {
            icon: 'i-lucide-pencil',
            variant: 'ghost',
            color: 'info',
            onClick() {
              console.log('edit', id);
            }
          }),
          h(UButton, {
            icon: 'i-lucide-trash',
            variant: 'ghost',
            color: 'error',
            onClick() {
              console.log('delete', id);
            }
          })
        ])
      }
    }
  ]);

  async function refreshAllData() {
    await Promise.all([
      refreshData(),
      productOptionStore.refetch()
    ]);
  }

  return {
    columns,
    packages,
    meta,
    refreshData: refreshAllData,
    isLoading,
    t,
    productOptionStore,
  }
}
