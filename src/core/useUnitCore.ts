import { Unit } from '@/dto/Unit';
import { useListCore } from './parts/useListCore';

export function useUnitCore() {
  const { isPending, list, meta, refreshData, t } = useListCore({
    key: 'units',
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
