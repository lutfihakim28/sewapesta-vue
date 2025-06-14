import { Unit } from '@/dto/Unit';
import { useListCore } from './parts/useListCore';
import UnitRequest from '@/components/desktop/UnitRequest.vue';
import DeleteConfirmationModal from '@/components/common/DeleteConfirmationModal.vue';
import { computed } from 'vue';
import { PRIVATE_QUERY_KEYS } from '@/constants/query-keys';
import { useCreateUnit } from '@/composables/api/units/useCreateUnit';
import { useDeleteUnit } from '@/composables/api/units/useDeleteUnit';
import { useUpdateUnit } from '@/composables/api/units/useUpdateUnit';

export function useUnitCore() {
  const { isLoading, list, meta, fullPath, refreshData, t } = useListCore({
    key: 'units',
    dto: Unit,
  })

  const overlay = useOverlay();
    const requestModal = overlay.create(UnitRequest)
    const confirmationModal = overlay.create(DeleteConfirmationModal)

    const listQueryKey = computed(() => PRIVATE_QUERY_KEYS.units.list(fullPath.value))

    const { create, isLoading: loadingCreate } = useCreateUnit(listQueryKey)
    const { deleteUnit, isLoading: loadingDelete } = useDeleteUnit(listQueryKey)
    const { update, isLoading: loadingUpdate } = useUpdateUnit(listQueryKey)

    const loading = computed(() => isLoading.value || loadingCreate.value || loadingDelete.value || loadingUpdate.value)

    async function openForm(unit?: Unit) {
      const instance = requestModal.open({
        unit,
      })

      const newUnits = await instance.result

      if (newUnits && newUnits.every((unit) => unit.id === 0)) {
        create(newUnits)
        return;
      }

      if (newUnits) {
        update(newUnits[0])
        return
      }
    }

    async function openConfirmation(unit: Unit) {
      const instance = confirmationModal.open({
        data: t('unit'),
        value: unit.name
      })

      const confirmed = await instance.result

      if (confirmed) {
        deleteUnit(unit)
      }
    }
    return {
      units: list,
      meta,
      loading,
      refreshData,
      openForm,
      openConfirmation,
    }
}
