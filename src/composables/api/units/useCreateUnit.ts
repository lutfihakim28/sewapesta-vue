import { PRIVATE_QUERY_KEYS } from '@/constants/query-keys'
import { ApiResponseList } from '@/dto/ApiResponse'
import { Unit } from '@/dto/Unit'
import { useApiFetch } from '@/plugins/api-fetch'
import { useMutation, useQueryCache, type EntryKey } from '@pinia/colada'
import type { Ref } from 'vue'
import { useI18n } from 'vue-i18n'

export function useCreateUnit(listQueryKey: Ref<EntryKey>) {
  const apiFetch = useApiFetch()
  const queryCache = useQueryCache()
  const toast = useToast();
  const { t } = useI18n();

  const { mutate, isLoading } = useMutation({
    mutation(units: Unit[]) {
      return createUnit(units)
    },
    onMutate(units: Unit[]) {
      const searchParams = new URLSearchParams(
        listQueryKey.value
          .join()
          .split('?')
        [1]
      )

      const oldUnits: Unit[] = queryCache.getQueryData(listQueryKey.value) || []

      let newUnits = [...oldUnits];
      const latestUnits: Unit[] = [];

      units.forEach((unit, index) => {
        if (searchParams.get('page') !== '1') {
          return;
        }

        if (searchParams.has('keyword') && !unit.name.toLowerCase().includes(searchParams.get('keyword')!.toLowerCase())) {
          return
        }

        const latestUnit = oldUnits
          .toSorted((a, b) => Math.abs(b.id) - Math.abs(a.id))
          .at(0)

        const newIndex = ((latestUnit?.id || 0) + index + 1);

        const newUnit = new Unit({
          ...unit,
          loading: true,
          id: newIndex,
        })

        newUnits.pop()

        latestUnits.push(newUnit)
        newUnits = [newUnit, ...newUnits]
      })


      queryCache.setQueryData(listQueryKey.value, newUnits)
      queryCache.cancelQueries({ key: listQueryKey.value, exact: true })

      return { oldUnits, newUnits, latestUnits }
    },
    async onSettled() {
      await queryCache.invalidateQueries({ key: PRIVATE_QUERY_KEYS.units.root() })
    },

    onError(err, _title, { oldUnits, newUnits }) {
      if (
        newUnits != null
        && newUnits === queryCache.getQueryData(listQueryKey.value)
      ) {
        queryCache.setQueryData(listQueryKey.value, oldUnits)
      }

      console.error(err)

      toast.add({
        title: 'Create Unit',
        description: t('system-error'),
        color: 'error',
      })
    }
  })


  async function createUnit(units: Unit[]): Promise<Unit[]> {
    const { data } = await apiFetch<ApiResponseList<Unit>>('private/units/many').post({
      names: units.map((unit) => unit.name)
    })

    const response = new ApiResponseList({
      ...data.value,
      meta: {
        total: 0
      }
    }, Unit)

    return response.data;
  }

  return { create: mutate, isLoading }
}
