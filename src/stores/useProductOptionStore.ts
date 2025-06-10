import type { ApiResponseData } from '@/dto/ApiResponse';
import type { SelectItem } from '@nuxt/ui';
import { useQuery } from '@pinia/colada';
import { defineStore } from 'pinia';
import { computed, shallowRef, watch } from 'vue';
import { useAuthStore } from './useAuthStore';
import { useApiFetch } from '@/plugins/api-fetch';

const path = ['private/products', 'options']

export const useProductOptionStore = defineStore('product-option', () => {
  const _options = shallowRef<SelectItem[]>([])
  const authStore = useAuthStore()
  const apiFetch = useApiFetch()

  const { data, isLoading, refetch } = useQuery({
    key: () => [...path, authStore.token],
    query: getProductOptions
  })

  const options = computed(() => _options.value)

  async function getProductOptions() {
    const { data, get } = apiFetch<ApiResponseData<SelectItem[]>>(path.join('/'))
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
