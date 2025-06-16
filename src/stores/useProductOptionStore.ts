import type { ApiResponseData } from '@/dto/ApiResponse';
import { useQuery } from '@pinia/colada';
import { defineStore } from 'pinia';
import { computed, shallowRef, watch } from 'vue';
import { useAuthStore } from './useAuthStore';
import { useApiFetch } from '@/plugins/api-fetch';
import type { AppSelectItem } from '@/types/select-item';

const path = ['private/products', 'options']

export const useProductOptionStore = defineStore('product-option', () => {
  const _options = shallowRef<AppSelectItem[]>([])
  const authStore = useAuthStore()
  const apiFetch = useApiFetch()

  const { data, isLoading, refetch } = useQuery({
    key: () => [...path, authStore.token],
    query: getProductOptions
  })

  const options = computed(() => _options.value)

  async function getProductOptions() {
    const { data, get } = apiFetch<ApiResponseData<AppSelectItem[]>>(path.join('/'))
    await get();
    return data.value
  }

  watch(data, () => {
    if (data.value) {
      _options.value = data.value.data
    }
  })

  return { options, loading: isLoading, refetch }
})
