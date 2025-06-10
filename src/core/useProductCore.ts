import { Product } from '@/dto/Product';
import { useListCore } from './parts/useListCore';

export function useProductCore() {
  const { isLoading, list, meta, refreshData, t } = useListCore({
    key: 'products',
    dto: Product,
  })

  return {
    products: list,
    meta,
    refreshData,
    isLoading,
    t,
  }
}
