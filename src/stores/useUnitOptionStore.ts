import type { ApiResponseData } from '@/dto/ApiResponse';
import { useQuery } from '@pinia/colada';
import { defineStore } from 'pinia';
import { shallowRef, watch } from 'vue';
import { PRIVATE_QUERY_KEYS } from '@/constants/query-keys';
import { useApiFetch } from '@/plugins/api-fetch';
import type { AppSelectItem } from '@/types/select-item';

const path = ['private/units', 'options']

export const useUnitOptionStore = defineStore('unit-option', () => {
  const options = shallowRef<AppSelectItem[]>([])
  const apiFetch = useApiFetch()

  const { data, isLoading, refetch } = useQuery({
    key: PRIVATE_QUERY_KEYS.units.options,
    query: getUnitOptions,
  })

  async function getUnitOptions() {
    const { data, get } = apiFetch<ApiResponseData<AppSelectItem[]>>(path.join('/'))
    await get();
    return data.value
  }

  watch(data, () => {
    if (data.value) {
      options.value = data.value.data
    }
  })

  return { options, loading: isLoading, refetch }
})
