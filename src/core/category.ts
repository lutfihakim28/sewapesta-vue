import { useAuthStore } from '@/stores/auth';
import { useApiFetch } from '@/utils/composables/useApiFetch';
import { useQueryParam } from '@/utils/composables/useQueryParam';
import { ApiResponseList } from '@/utils/dtos/ApiResponse';
import { Category } from '@/utils/dtos/Category';
import type { Meta } from '@/utils/dtos/Meta';
import { useQuery } from '@pinia/colada';
import { computed } from 'vue';
import { useI18n } from 'vue-i18n';

export function useCategoryCore() {
  const basePath = 'private/categories'
  const authStore = useAuthStore()
  const toast = useToast()
  const { t } = useI18n()

  const { path } = useQueryParam(basePath)

  const { data, isPending, refresh } = useQuery({
    key: () => [basePath, path.value, authStore.token],
    query: () => fetcher(path.value),
  })

  const categories = computed<Category[]>((previous) => {
    if (data.value) {
      const response = new ApiResponseList(data.value, Category)

      return response.data
    }

    if (previous) return previous;
    return []
  })

  const meta = computed<Meta | undefined>(() => {
    if (!data.value) return;
    const response = new ApiResponseList(data.value, Category)

    return response.meta
  })

  async function fetcher(path: string) {
    if (!path.includes('page=')) return
    const { data, get } = useApiFetch<ApiResponseList<Category>>(path);
    await get();
    return data.value;
  }

  async function refreshData() {
    try {
      await refresh();
      toast.add({
        color: 'success',
        title: t('refreshed'),
        duration: 1500,
      })
    } catch (error) {
      toast.add({
        color: 'error',
        title: 'Error',
        duration: 1500,
      })
      throw error;
    }
  }

  return {
    categories,
    meta,
    refreshData,
    isPending,
    t,
  }
}
