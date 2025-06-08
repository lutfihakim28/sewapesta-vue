import { useAuthStore } from '@/stores/useAuthStore';
import { useApiFetch } from '@/composables/useApiFetch';
import { useQueryParam } from '@/composables/useQueryParam';
import { useQuery } from '@pinia/colada';
import { computed, type Ref } from 'vue';
import { useI18n } from 'vue-i18n';
import { ApiResponseList } from '@/dto/ApiResponse';
import type { Meta } from '@/dto/Meta';

interface UseListCoreOptions<T> {
  basePath: string;
  dto: new (data: T) => T;
  additionalQueryParam?: Ref<string> | string;
}

export function useListCore<T>(options: UseListCoreOptions<T>) {
  const { basePath, dto, additionalQueryParam } = options;
  const authStore = useAuthStore();
  const toast = useToast();
  const { t } = useI18n();

  const { path } = useQueryParam(basePath);

  const fullPath = computed(() => {
    let currentPath = path.value;
    if (additionalQueryParam) {
      const paramValue = typeof additionalQueryParam === 'string' ? additionalQueryParam : additionalQueryParam.value;
      if (paramValue) {
        currentPath += currentPath.includes('?') ? '&' : '?';
        currentPath += paramValue;
      }
    }
    return currentPath;
  });

  const { data, isPending, refresh } = useQuery({
    key: () => [basePath, fullPath.value, authStore.token],
    query: () => fetcher(fullPath.value),
  });

  const list = computed<T[]>((previous) => {
    if (data.value) {
      const response = new ApiResponseList(data.value, dto);
      return response.data;
    }
    if (previous) return previous;
    return [];
  });

  const meta = computed<Meta | undefined>(() => {
    if (!data.value) return;
    const response = new ApiResponseList(data.value, dto);
    return response.meta;
  });

  async function fetcher(currentPath: string) {
    if (!currentPath.includes('page=')) return;

    const { data, get } = useApiFetch<ApiResponseList<T>>(currentPath);
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
      });
    } catch (error) {
      toast.add({
        color: 'error',
        title: 'Error',
        duration: 1500,
      });
      throw error;
    }
  }

  return {
    list,
    meta,
    isPending,
    refreshData,
    t,
  };
}
