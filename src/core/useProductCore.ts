import { Product } from '@/dto/Product';
import { useListCore } from './parts/useListCore';

export function useProductCore() {
  const { isPending, list, meta, refreshData, t } = useListCore({
    key: 'products',
    dto: Product,
  })

  return {
    products: list,
    meta,
    refreshData,
    isPending,
    t,
  }
}
