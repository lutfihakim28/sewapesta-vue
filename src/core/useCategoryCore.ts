import { Category } from '@/utils/dtos/Category';
import { useListCore } from './parts/useListCore';

export function useCategoryCore() {
  const basePath = 'private/categories'

  const { isPending, list, meta, refreshData, t } = useListCore({
    basePath,
    dto: Category,
  })

  return {
    categories: list,
    meta,
    refreshData,
    isPending,
    t,
  }
}
