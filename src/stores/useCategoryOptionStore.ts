import { useApiFetch } from '@/utils/composables/useApiFetch';
import type { ApiResponseData } from '@/utils/dtos/ApiResponse';
import type { SelectItem } from '@nuxt/ui';
import { useQuery } from '@pinia/colada';
import { defineStore } from 'pinia';
import { computed, shallowRef, watch } from 'vue';
import { useAuthStore } from './useAuthStore';

const path = ['private/categories', 'options']

export const useCategoryOptionStore = defineStore('category-option', () => {
  const _options = shallowRef<SelectItem[]>([])
  const authStore = useAuthStore()

  const { data, isPending, refresh } = useQuery({
    key: () => [...path, authStore.token],
    query: getCategoryOptions
  })

  const options = computed(() => _options.value)

  async function getCategoryOptions() {
    const { data, get } = useApiFetch<ApiResponseData<SelectItem[]>>(path.join('/'))
    await get();
    return data.value
  }

  watch(data, () => {
    if (data.value) {
      _options.value = data.value.data
    }
  })

  return { options, loading: isPending, refresh }
})
