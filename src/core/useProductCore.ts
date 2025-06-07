import { Product } from '@/dtos/Product';
import { useListCore } from './parts/useListCore';

export function useProductCore() {
  const basePath = 'private/products'

  const { isPending, list, meta, refreshData, t } = useListCore({
    basePath,
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
