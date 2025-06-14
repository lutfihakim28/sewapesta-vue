import { PRIVATE_QUERY_KEYS } from '@/constants/query-keys'
import { ApiResponseData } from '@/dto/ApiResponse'
import { Unit } from '@/dto/Unit'
import { useApiFetch } from '@/plugins/api-fetch'
import { useMutation, useQueryCache, type EntryKey } from '@pinia/colada'
import type { Ref } from 'vue'
import { useI18n } from 'vue-i18n'

export function useUpdateUnit(listQueryKey: Ref<EntryKey>) {
  const apiFetch = useApiFetch()
  const queryCache = useQueryCache()
  const toast = useToast();
  const { t } = useI18n();

  const { mutate, isLoading } = useMutation({
    mutation(unit: Unit) {
      return updateUnit(unit)
    },
    onMutate(unit: Unit) {
      const oldUnits: Unit[] = queryCache.getQueryData(listQueryKey.value) || []

      let updatedUnits = oldUnits.map((_unit) => {
        if (_unit.id !== unit.id) return _unit;
        return {
          ...unit,
          loading: true,
        };
      })

      const searchParams = new URLSearchParams(
        listQueryKey.value
          .join()
          .split('?')
        [1]
      )

      if (searchParams.has('keyword') && !unit.name.toLowerCase().includes(searchParams.get('keyword')!.toLowerCase())) {
        updatedUnits = updatedUnits.filter((_unit) => _unit.name.toLowerCase().includes(searchParams.get('keyword')!.toLowerCase()))
      }

      queryCache.setQueryData(listQueryKey.value, updatedUnits)
      queryCache.cancelQueries({ key: listQueryKey.value, exact: true })

      return { oldUnits, updatedUnits, updatedUnit: unit }
    },
    async onSettled() {
      await queryCache.invalidateQueries({ key: PRIVATE_QUERY_KEYS.units.root() })
    },
    onError(err, _title, { oldUnits, updatedUnits }) {
      if (
        updatedUnits != null
        && updatedUnits === queryCache.getQueryData(listQueryKey.value)
      ) {
        queryCache.setQueryData(listQueryKey.value, oldUnits)
      }

      console.error(err)

      toast.add({
        title: `Update Unit ${_title.id}`,
        description: t('system-error'),
        color: 'error',
      })
    },
  })


  async function updateUnit(unit: Unit): Promise<Unit> {
    const { data } = await apiFetch(`private/units/${unit.id}`).put({ name: unit.name })

    const response = new ApiResponseData(data.value, Unit)

    return response.data;
  }

  return { update: mutate, isLoading }
}
