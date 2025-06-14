import { PRIVATE_QUERY_KEYS } from '@/constants/query-keys'
import { type Unit } from '@/dto/Unit'
import { useApiFetch } from '@/plugins/api-fetch'
import { useMutation, useQueryCache, type EntryKey } from '@pinia/colada'
import type { Ref } from 'vue'
import { useI18n } from 'vue-i18n'

export function useDeleteUnit(listQueryKey: Ref<EntryKey>) {
  const apiFetch = useApiFetch()
  const queryCache = useQueryCache()
  const toast = useToast();
  const { t } = useI18n();

  const { mutate, isLoading } = useMutation({
    mutation(unit: Unit) {
      return deleteUnit(unit)
    },
    onMutate(unit: Unit) {
      const oldUnits: Unit[] = queryCache.getQueryData(listQueryKey.value) || []

      const newUnits = oldUnits.filter((_unit) => _unit.id !== unit.id)

      queryCache.setQueryData(listQueryKey.value, newUnits)
      queryCache.cancelQueries({ key: listQueryKey.value, exact: true })

      return { oldUnits, newUnits }
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
        title: `Delete Unit ${_title.id}`,
        description: t('system-error'),
        color: 'error',
      })
    }
  })


  async function deleteUnit(unit: Unit): Promise<Unit> {
    await apiFetch(`private/units/${unit.id}`).delete()
    return unit;
  }

  return { deleteUnit: mutate, isLoading }
}
