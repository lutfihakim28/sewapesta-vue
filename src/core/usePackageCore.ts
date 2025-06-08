import TableSorter from '@/components/table-controlls/TableSorter.vue';
import { Package } from '@/dto/Package';
import type { TableColumn } from '@nuxt/ui';
import { computed, h } from 'vue';
import { useListCore } from './parts/useListCore';
import { useProductOptionStore } from '@/stores/useProductOptionStore';

export function usePackageCore() {
  const basePath = 'private/packages'
  const productOptionStore = useProductOptionStore();

  const { list: packages, meta, isPending, refreshData, t } = useListCore<Package>({
    basePath,
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
  ]);

  async function refreshAllData() {
    await Promise.all([
      refreshData(),
      productOptionStore.refresh()
    ]);
  }

  return {
    columns,
    packages,
    meta,
    refreshData: refreshAllData,
    isPending,
    t,
    productOptionStore,
  }
}
