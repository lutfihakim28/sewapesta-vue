import { Unit } from '@/utils/dtos/Unit';
import { useListCore } from './parts/useListCore';

export function useUnitCore() {
  const basePath = 'private/units'

  const { isPending, list, meta, refreshData, t } = useListCore({
    basePath,
    dto: Unit,
  })

  return {
    categories: list,
    meta,
    refreshData,
    isPending,
    t,
  }
}
