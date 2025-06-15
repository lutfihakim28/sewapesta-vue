import type { ApiResponseData } from '@/dto/ApiResponse';
import type { SelectItem } from '@nuxt/ui';
import { useQuery } from '@pinia/colada';
import { defineStore } from 'pinia';
import { shallowRef, watch } from 'vue';
import { PRIVATE_QUERY_KEYS } from '@/constants/query-keys';
import { useApiFetch } from '@/plugins/api-fetch';

const path = ['private/units', 'options']

export const useUnitOptionStore = defineStore('unit-option', () => {
  const options = shallowRef<SelectItem[]>([])
  const apiFetch = useApiFetch()

  const { data, isLoading, refetch } = useQuery({
    key: PRIVATE_QUERY_KEYS.units.options,
    query: getUnitOptions,
  })

  async function getUnitOptions() {
    const { data, get } = apiFetch<ApiResponseData<SelectItem[]>>(path.join('/'))
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
